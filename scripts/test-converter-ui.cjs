// Run npm run build, then npm run test:ui. API responses are isolated test fixtures.
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const nodePath = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');

(async () => {
    let frontend, browser, artifact;
    const downloadDirectory = await fs.mkdtemp(
        nodePath.join(os.tmpdir(), 'converter-ui-'),
    );
    try {
        let baseUrl = process.env.CONVERTER_UI_TEST_URL;
        if (!baseUrl) {
            const probe = http.createServer();
            await new Promise((resolve) =>
                probe.listen(0, '127.0.0.1', resolve),
            );
            const port = probe.address().port;
            await new Promise((resolve) => probe.close(resolve));
            baseUrl = `http://127.0.0.1:${port}`;
            const entry = nodePath.resolve(
                __dirname,
                '../.next/standalone/server.js',
            );
            await fs.access(entry).catch(() => {
                throw new Error('Run npm run build before npm run test:ui.');
            });
            frontend = spawn(process.execPath, [entry], {
                cwd: nodePath.resolve(__dirname, '..'),
                env: {
                    ...process.env,
                    PORT: String(port),
                    HOSTNAME: '127.0.0.1',
                },
                stdio: ['ignore', 'ignore', 'pipe'],
            });
            let diagnostic = '';
            frontend.stderr.on('data', (chunk) => {
                diagnostic = (diagnostic + chunk).slice(-8192);
            });
            let ready = false;
            for (let attempt = 0; attempt < 50; attempt++) {
                if (frontend.exitCode !== null)
                    throw new Error('Test frontend exited: ' + diagnostic);
                try {
                    if (
                        (
                            await fetch(baseUrl, {
                                signal: AbortSignal.timeout(1000),
                            })
                        ).ok
                    ) {
                        ready = true;
                        break;
                    }
                } catch {}
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
            if (!ready)
                throw new Error('Test frontend did not start: ' + diagnostic);
        }
        artifact = http.createServer((req, res) => {
            const body = 'native download artifact';
            res.writeHead(200, {
                'content-type': 'application/octet-stream',
                'content-disposition': 'attachment; filename="result.docx"',
                'content-length': Buffer.byteLength(body),
            });
            res.end(body);
        });
        await new Promise((resolve) =>
            artifact.listen(0, '127.0.0.1', resolve),
        );
        const artifactUrl =
            'http://127.0.0.1:' + artifact.address().port + '/artifact';
        browser = await chromium.launch({
            headless: true,
            executablePath:
                process.env.CONVERTER_BROWSER_EXECUTABLE || undefined,
            downloadsPath: downloadDirectory,
        });
        const layoutContext = await browser.newContext({
            viewport: { width: 1440, height: 1000 },
            colorScheme: 'light',
        });
        await layoutContext.route('**/api/**', (route) =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ remaining: 99, limit: 100, used: 1 }),
            }),
        );
        const layoutPage = await layoutContext.newPage();
        await layoutPage.goto(baseUrl);
        await layoutPage.locator('.tool-card').first().waitFor();
        const desktop = await layoutPage.evaluate(() => {
            const card = document.querySelector('.tool-card');
            return {
                columns: getComputedStyle(
                    card.parentElement,
                ).gridTemplateColumns.split(' ').length,
                padding: getComputedStyle(card).paddingTop,
                background: getComputedStyle(document.body).backgroundColor,
            };
        });
        assert.equal(
            desktop.columns,
            3,
            'desktop toolbox retains three columns',
        );
        assert.equal(
            desktop.padding,
            '20px',
            'Tailwind component padding is compiled',
        );
        await layoutPage
            .getByRole('button', { name: 'Switch to dark mode' })
            .click();
        await layoutPage.waitForFunction(
            (background) =>
                getComputedStyle(document.body).backgroundColor !== background,
            desktop.background,
        );
        if (process.env.CONVERTER_UI_SCREENSHOT_DIR) {
            await fs.mkdir(process.env.CONVERTER_UI_SCREENSHOT_DIR, {
                recursive: true,
            });
            await layoutPage.screenshot({
                path: nodePath.join(
                    process.env.CONVERTER_UI_SCREENSHOT_DIR,
                    'desktop-dark.png',
                ),
                fullPage: true,
            });
        }
        await layoutPage.setViewportSize({ width: 390, height: 844 });
        const mobile = await layoutPage.evaluate(() => ({
            width: document.documentElement.scrollWidth,
            columns: getComputedStyle(
                document.querySelector('.tool-card').parentElement,
            ).gridTemplateColumns.split(' ').length,
        }));
        assert.ok(
            mobile.width <= 390,
            'mobile layout must not overflow horizontally',
        );
        assert.equal(mobile.columns, 1, 'mobile toolbox retains one column');
        if (process.env.CONVERTER_UI_SCREENSHOT_DIR)
            await layoutPage.screenshot({
                path: nodePath.join(
                    process.env.CONVERTER_UI_SCREENSHOT_DIR,
                    'mobile-dark.png',
                ),
                fullPage: true,
            });
        await layoutContext.close();
        console.log(
            'PASS browser: desktop/mobile layout and manual dark theme',
        );
        const context = await browser.newContext({ acceptDownloads: true });
        let quotaReads = 0,
            submissions = 0,
            downloads = 0,
            latest,
            loseAcknowledgement = false;
        const jobs = new Map();
        await context.route('**/api/**', async (route) => {
            const request = route.request(),
                url = new URL(request.url()),
                path = url.pathname;
            const send = (data) =>
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(data),
                });
            if (path === '/api/convert/quota') {
                quotaReads++;
                return send({ remaining: 99, limit: 100, used: 1 });
            }
            if (path.startsWith('/api/analytics/'))
                return send({ status: 'success' });
            if (path.startsWith('/api/download/')) {
                downloads++;
                assert.notEqual(request.resourceType(), 'xhr');
                assert.notEqual(request.resourceType(), 'fetch');
                return route.fulfill({
                    status: 302,
                    headers: { location: artifactUrl },
                });
            }
            if (path.startsWith('/api/jobs/') && request.method() === 'POST') {
                submissions++;
                const requestId = request
                    .postDataBuffer()
                    .toString()
                    .match(/name="requestId"\r\n\r\n([^\r]+)/)[1];
                latest = {
                    jobId: submissions.toString(16).padStart(32, '0'),
                    requestId,
                    status: 'queued',
                    tool: 'pdf-to-word',
                    originalFileName: 'sample.pdf',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                jobs.set(latest.jobId, latest);
                if (loseAcknowledgement) {
                    loseAcknowledgement = false;
                    return route.abort('failed');
                }
                return route.fulfill({
                    status: 202,
                    contentType: 'application/json',
                    body: JSON.stringify(latest),
                });
            }
            if (path.startsWith('/api/jobs/request/'))
                return send(
                    [...jobs.values()].find(
                        (job) => job.requestId === path.split('/').pop(),
                    ),
                );
            if (path.startsWith('/api/jobs/')) {
                const job = jobs.get(path.split('/').pop());
                if (request.method() === 'DELETE') {
                    job.status = 'cancelled';
                    job.error = 'Conversion cancelled.';
                }
                return send(job);
            }
            if (path === '/api/jobs') return send([]);
            throw new Error('Unhandled request: ' + path);
        });
        const page = await context.newPage();
        await page.goto(baseUrl + '/pdf-to-word');
        await page
            .getByText('99 of 100 conversions left today', { exact: true })
            .waitFor();
        assert.equal(
            quotaReads,
            1,
            'Navbar and converter share the initial quota request',
        );
        const choose = () =>
            page.locator('input[type=file]').setInputFiles({
                name: 'sample.pdf',
                mimeType: 'application/pdf',
                buffer: Buffer.from('fixture'),
            });
        await choose();
        await page
            .getByRole('button', { name: 'Convert file', exact: true })
            .click();
        await page
            .getByText('Waiting for an available worker…', { exact: true })
            .waitFor();
        assert.equal(submissions, 1);
        await page.reload();
        await page
            .getByText('Waiting for an available worker…', { exact: true })
            .waitFor();
        assert.equal(
            submissions,
            1,
            'Reload recovers the job instead of uploading again',
        );
        latest.status = 'running';
        await page
            .getByText('Processing your file…', { exact: true })
            .waitFor();
        latest.status = 'succeeded';
        latest.result = {
            downloadUrl: 'http://backend:8080/api/download/' + 'a'.repeat(32),
            fileName: 'result.docx',
            expiresAt: new Date(Date.now() + 1800000).toISOString(),
            fileSize: 123,
            warnings: [
                'Text verification found differences. Review the converted document.',
            ],
        };
        await page
            .getByRole('heading', { name: 'Your file is ready.' })
            .waitFor();
        await page
            .getByText(
                'Text verification found differences. Review the converted document.',
                { exact: true },
            )
            .waitFor();
        const downloadEvent = page.waitForEvent('download');
        await page
            .getByRole('link', { name: 'Download file', exact: true })
            .click();
        const downloaded = await downloadEvent;
        assert.equal(
            await fs.readFile(await downloaded.path(), 'utf8'),
            'native download artifact',
        );
        assert.equal(downloads, 1);
        await page
            .getByRole('button', { name: 'Convert another', exact: true })
            .click();
        await choose();
        await page
            .getByRole('button', { name: 'Convert file', exact: true })
            .click();
        await page
            .getByRole('button', { name: 'Cancel conversion', exact: true })
            .click();
        await page
            .getByText('Conversion cancelled.', { exact: true })
            .waitFor();
        assert.equal(latest.status, 'cancelled');
        await choose();
        loseAcknowledgement = true;
        await page
            .getByRole('button', { name: 'Convert file', exact: true })
            .click();
        await page.getByRole('alert').waitFor();
        assert.equal(submissions, 3);
        await page.reload();
        await page
            .getByText('Waiting for an available worker…', { exact: true })
            .waitFor();
        assert.equal(
            submissions,
            3,
            'Lost acknowledgement is recovered by request ID without a duplicate upload',
        );
        console.log(
            'PASS browser: shared quota, async status, reload recovery, warnings, native download, cancellation, lost-acknowledgement recovery',
        );
        await context.close();
        const history = await browser.newContext();
        let historyReads = 0;
        await history.addInitScript(() => {
            localStorage.setItem('token', 'test-token');
            localStorage.setItem(
                'user',
                JSON.stringify({ id: '1', firstName: 'Test', role: 'user' }),
            );
        });
        await history.route('**/api/**', async (route) => {
            const url = new URL(route.request().url());
            let body = { status: 'success' };
            if (url.pathname === '/api/convert/quota')
                body = { remaining: 99, limit: 100 };
            if (url.pathname === '/api/user/history') {
                historyReads++;
                const page = Number(url.searchParams.get('page'));
                assert.equal(url.searchParams.get('size'), '20');
                body = {
                    page,
                    size: 20,
                    hasNext: page === 0,
                    hasPrevious: page > 0,
                    usedToday: 1,
                    dailyLimit: 100,
                    remaining: 99,
                    conversions: [
                        {
                            id: page + 1,
                            converterType: 'pdf-to-word',
                            originalFileName: 'sample.pdf',
                            convertedFileName:
                                page === 0
                                    ? 'Page one result'
                                    : 'Page two result',
                            expired: true,
                            createdAt: new Date().toISOString(),
                            expiresAt: new Date().toISOString(),
                        },
                    ],
                };
            }
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(body),
            });
        });
        const dashboard = await history.newPage();
        await dashboard.goto(baseUrl + '/dashboard');
        await dashboard.getByText('Page one result', { exact: true }).waitFor();
        await dashboard
            .getByRole('button', { name: 'Next', exact: true })
            .click();
        await dashboard.getByText('Page two result', { exact: true }).waitFor();
        assert.equal(historyReads, 2);
        assert.equal(
            await dashboard
                .getByRole('button', { name: 'Next', exact: true })
                .isDisabled(),
            true,
        );
        console.log(
            'PASS browser: history pagination requests only the selected page',
        );
        await history.close();

        const authContext = await browser.newContext();
        let identityReads = 0;
        await authContext.route('**/api/**', async (route) => {
            const path = new URL(route.request().url()).pathname;
            if (path === '/api/convert/quota') {
                identityReads++;
                const authenticated = !!route.request().headers().authorization;
                if (!authenticated)
                    await new Promise((resolve) => setTimeout(resolve, 500));
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        remaining: authenticated ? 88 : 1,
                        limit: 100,
                    }),
                });
            }
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(path === '/api/jobs' ? [] : {}),
            });
        });
        const authPage = await authContext.newPage();
        await authPage.goto(baseUrl + '/pdf-to-word');
        await authPage.evaluate(() => {
            localStorage.setItem('token', 'new-user-token');
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: '42',
                    firstName: 'New user',
                    role: 'user',
                }),
            );
            window.dispatchEvent(new StorageEvent('storage', { key: 'token' }));
        });
        await authPage
            .getByText('88 of 100 conversions left today', { exact: true })
            .waitFor();
        await authPage.waitForTimeout(600);
        assert.equal(
            await authPage
                .getByText('88 of 100 conversions left today', { exact: true })
                .count(),
            1,
        );
        assert.equal(
            identityReads,
            2,
            'The stale anonymous response cannot replace the new account quota',
        );
        await authContext.close();
        console.log(
            'PASS browser: quota identity changes ignore stale requests',
        );
    } finally {
        if (browser) await browser.close();
        if (artifact) await new Promise((resolve) => artifact.close(resolve));
        if (frontend) frontend.kill('SIGTERM');
        await fs.rm(downloadDirectory, { recursive: true, force: true });
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
