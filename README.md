# Unimorpher frontend

Next.js 16 / React 19 frontend for the sibling `converter-backend` service. Includes the searchable conversion toolbox, upload validation/progress/cancellation, temporary downloads, email and Google sign-in, verification/recovery pages, profile settings, server conversion history, themes, and admin user management.

Requires Node 22+.

```sh
cp .env.example .env.local
npm ci
npm run dev
```

`API_URL` configures the server-side API proxy (default `http://localhost:8080`). `NEXT_PUBLIC_GOOGLE_CLIENT_ID` enables Google sign-in and must match the backend OAuth audience. `NEXT_PUBLIC_SITE_URL` configures canonical metadata and sitemaps. These values are captured at build time; rebuild after changing them. Keep secrets out of public environment variables.

```sh
npm run format:check
npm run lint
npm run build
npm run typecheck
npm audit
npm start
```

Use `../converter-backend/docker-compose.yaml` to build the full stack at http://localhost:8088. The bundled Dockerfile creates a standalone server running as the Node user. The backend README documents real conversion fidelity, quotas, data retention, migrations, provider setup, and deployment requirements.

Quotas and signed-in history come from the backend. Failed attempts count against quota. Cancellation aborts the browser request; work already received may complete. There is no implemented Pro subscription. Complex/scanned PDFs do not receive OCR or full layout reconstruction.

The full dependency audit, including development tooling, is checked in CI. Run `npm audit` to check current advisory data. Tailwind 4 uses `@tailwindcss/postcss` and preserves the existing palette through `tailwind.config.js`; the dark variant follows the manually toggled `.dark` class. Its browser baseline is Safari 16.4+, Chrome 111+, and Firefox 128+.

Prettier formats source, scripts, and configuration with four spaces. Run `npm run format` to apply formatting or `npm run format:check` to verify it. Generated files and the npm-managed lockfile are excluded. ESLint uses maintained TypeScript, React, React Hooks, and accessibility rules. The Next-specific preset was removed because its glob dependency has an unpatched advisory; it is not silently suppressed or replaced with an incompatible glob implementation.

Auth tokens are currently stored in localStorage. Password changes revoke old tokens and return the user to login. Account verification and reset tokens are removed from the browser URL after being read. Configure HTTPS and review the operator's privacy/support details before publishing.

The interface uses a shared forest-green accent, warm neutral surfaces, and a corresponding dark theme. Update semantic color variables in `src/app/globals.css` and the `brand` scale in `tailwind.config.js` to change the palette. Tool metadata and categories live in `src/lib/tools.ts`.

## Conversion jobs and regression checks

This frontend requires the backend `/api/jobs` endpoints and migrations V4/V5. Deploy the backend first. Uploads receive a durable job ID; once accepted, users can navigate away and return to resume processing or download the result. The UI displays conversion warnings and uses native browser downloads. Navbar and converter share one account-scoped quota request/cache. History is paginated with abortable requests and pauses automatic refresh while hidden.

Browser regression tests use isolated API fixtures and a real local download endpoint. They verify quota deduplication, state transitions, refresh recovery, recovery after a lost submission response, warnings, native downloads, cancellation, pagination, and stale account responses. They start and stop an isolated production frontend automatically.

```sh
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run build
npx playwright-core install chromium-headless-shell
npm run test:ui
```

On Linux CI, install browser OS dependencies using `npx playwright-core install --with-deps chromium-headless-shell`. `CONVERTER_BROWSER_EXECUTABLE` may select an existing compatible Chromium binary. `CONVERTER_UI_TEST_URL` may point at an already running local frontend instead of starting one; API responses are intercepted within the fresh test browser contexts.
