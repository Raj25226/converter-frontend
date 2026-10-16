'use client';
import { useEffect, useRef, useState } from 'react';
import Link from '@/components/FeatureLink';
import {
    ArrowRight,
    Search,
    X,
    Clock,
    HardDrive,
    ChevronDown,
    History,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { categories, tools } from '@/lib/tools';
import { getUser } from '@/lib/auth';
import { useFeatures } from '@/components/FeatureProvider';

export default function Home() {
    const { enabled, ready, error, refresh } = useFeatures();
    const availableTools = tools.filter(
        (tool) => enabled('conversions') && enabled(`conversion-${tool.id}`),
    );
    const [signedIn, setSignedIn] = useState(false);
    const [category, setCategory] = useState('all');
    const [search, setSearch] = useState('');
    const searchInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setSignedIn(Boolean(getUser()));
        const handleKey = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                searchInput.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);
    const visible = availableTools.filter(
        (tool) =>
            (category === 'all' || tool.category === category) &&
            `${tool.name} ${tool.description} ${tool.from} ${tool.to} ${tool.category}`
                .toLowerCase()
                .includes(search.trim().toLowerCase()),
    );
    const groups = categories.filter(
        (group) =>
            group.id !== 'all' &&
            visible.some((tool) => tool.category === group.id),
    );
    const activeCategory = categories.find((group) => group.id === category)!;
    return (
        <>
            <Navbar />
            <main className="app-container flex-1 pb-14">
                {!ready && (
                    <p role="status" className="muted py-4">
                        Loading feature availability…
                    </p>
                )}
                {error && (
                    <p role="alert" className="py-4">
                        {error}{' '}
                        <button onClick={() => void refresh()}>Retry</button>
                    </p>
                )}
                <header
                    className="pt-10 sm:pt-14 pb-9 sm:pb-11 border-b"
                    style={{ borderColor: 'rgb(var(--card-border))' }}
                >
                    <div className="flex items-center gap-2 text-xs muted mb-5">
                        <span>Workspace</span>
                        <span aria-hidden="true">/</span>
                        <span style={{ color: 'rgb(var(--fg))' }}>
                            File tools
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-[36px] sm:text-[44px] font-semibold tracking-tight">
                                Convert your files.
                            </h1>
                            <p className="muted mt-3 max-w-xl text-[15px] sm:text-base">
                                Documents, images and media, in the format you
                                need.
                                <br className="hidden sm:block" /> Choose a tool
                                below to get started.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs muted pb-1">
                            <span className="flex items-center gap-2">
                                <HardDrive size={15} /> Up to 50 MB
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={15} /> 30-minute downloads
                            </span>
                        </div>
                    </div>
                </header>
                <div
                    id="converters"
                    className="grid grid-cols-1 lg:grid-cols-[208px_minmax(0,1fr)] gap-7 lg:gap-10 pt-8 sm:pt-10"
                >
                    <aside
                        aria-label="Tool categories"
                        className="min-w-0 lg:sticky lg:top-24 self-start"
                    >
                        <p className="hidden lg:block text-xs font-medium muted px-3 mb-3">
                            Browse tools
                        </p>
                        <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
                            {categories.map((group) => {
                                const Icon = group.icon;
                                const count =
                                    group.id === 'all'
                                        ? availableTools.length
                                        : availableTools.filter(
                                              (tool) =>
                                                  tool.category === group.id,
                                          ).length;
                                return (
                                    <button
                                        key={group.id}
                                        aria-pressed={category === group.id}
                                        onClick={() => setCategory(group.id)}
                                        className={`category-link !w-auto lg:!w-full shrink-0 ${category === group.id ? 'selected' : ''}`}
                                    >
                                        <Icon size={17} strokeWidth={1.7} />
                                        <span className="whitespace-nowrap">
                                            {group.label}
                                        </span>
                                        <span className="ml-auto text-xs tabular-nums pl-4 muted">
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <div
                            className="hidden lg:block mt-9 px-3 pt-6 border-t"
                            style={{ borderColor: 'rgb(var(--card-border))' }}
                        >
                            <History size={20} className="muted mb-3" />
                            <h2 className="text-sm font-medium mb-2">
                                {signedIn
                                    ? 'Your recent work'
                                    : 'Pick up where you left off'}
                            </h2>
                            <p className="text-xs muted leading-relaxed">
                                {signedIn
                                    ? 'Find your recent conversions and available downloads in your history.'
                                    : 'Sign in to keep your conversion history in one place.'}
                            </p>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-xs font-medium accent mt-4"
                            >
                                Your history <ArrowRight size={13} />
                            </Link>
                        </div>
                    </aside>
                    <div className="min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {activeCategory.label}
                                </h2>
                                <p
                                    className="text-xs muted mt-1"
                                    role="status"
                                    aria-live="polite"
                                >
                                    {visible.length}{' '}
                                    {visible.length === 1 ? 'tool' : 'tools'}
                                    {search
                                        ? ` matching “${search}”`
                                        : ' available'}
                                </p>
                            </div>
                            <div className="relative sm:w-[290px] w-full">
                                <Search
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 muted pointer-events-none"
                                />
                                <label
                                    htmlFor="tool-search"
                                    className="sr-only"
                                >
                                    Search tools
                                </label>
                                <input
                                    ref={searchInput}
                                    id="tool-search"
                                    className="input-field !pl-10 !pr-16"
                                    type="search"
                                    placeholder="Search by format or tool"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                />
                                {search ? (
                                    <button
                                        aria-label="Clear search"
                                        onClick={() => {
                                            setSearch('');
                                            searchInput.current?.focus();
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 icon-button !w-8 !h-8"
                                    >
                                        <X size={15} />
                                    </button>
                                ) : (
                                    <kbd
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] muted border rounded px-1.5 py-0.5"
                                        style={{
                                            borderColor:
                                                'rgb(var(--card-border))',
                                        }}
                                    >
                                        ⌘ K
                                    </kbd>
                                )}
                            </div>
                        </div>
                        {visible.length === 0 && (
                            <div className="card py-16 px-6 text-center">
                                <Search
                                    size={28}
                                    className="muted mx-auto mb-4"
                                />
                                <h3 className="text-lg font-medium">
                                    No tools found
                                </h3>
                                <p className="muted text-sm mt-2">
                                    Try another format or browse all categories.
                                </p>
                                <button
                                    className="btn btn-secondary px-4 mt-5"
                                    onClick={() => {
                                        setSearch('');
                                        setCategory('all');
                                    }}
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                        {groups.map((group) => (
                            <section
                                key={group.id}
                                aria-label={group.label}
                                className="mb-8 last:mb-0"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-xs font-medium muted">
                                        {group.label}
                                    </h3>
                                    <div
                                        className="h-px flex-1"
                                        style={{
                                            background:
                                                'rgb(var(--card-border))',
                                        }}
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {visible
                                        .filter(
                                            (tool) =>
                                                tool.category === group.id,
                                        )
                                        .map((tool) => {
                                            const Icon = tool.icon;
                                            return (
                                                <Link
                                                    key={tool.id}
                                                    href={`/${tool.id}`}
                                                    className="tool-card group"
                                                >
                                                    <div className="flex items-center justify-between mb-5">
                                                        <div className="icon-tile w-9 h-9">
                                                            <Icon
                                                                size={19}
                                                                strokeWidth={
                                                                    1.65
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="format-tag">
                                                                {tool.from}
                                                            </span>
                                                            <ArrowRight
                                                                size={12}
                                                                className="muted"
                                                            />
                                                            <span className="format-tag">
                                                                {tool.to}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                                        <h4 className="text-[15px] font-semibold">
                                                            {tool.name}
                                                        </h4>
                                                        <ArrowRight
                                                            size={14}
                                                            className="accent shrink-0"
                                                        />
                                                    </div>
                                                    <p className="text-[13px] muted leading-relaxed min-h-[40px]">
                                                        {tool.description}
                                                    </p>
                                                </Link>
                                            );
                                        })}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
                <section
                    className="mt-12 sm:mt-16 border-t pt-7 grid md:grid-cols-[208px_minmax(0,1fr)] gap-7 lg:gap-10"
                    style={{ borderColor: 'rgb(var(--card-border))' }}
                >
                    <h2 className="text-sm font-medium lg:px-3">
                        A few things to know
                    </h2>
                    <div className="space-y-1">
                        {[
                            {
                                question: 'How do downloads work?',
                                answer: 'Choose your file, run the conversion and download the result. Download links expire after 30 minutes, so save a copy before closing the page.',
                            },
                            {
                                question: 'Do I need an account?',
                                answer: 'You can use the tools as a guest. Create an account for a larger daily allowance and conversion history. The remaining allowance is shown in the navigation.',
                            },
                            {
                                question:
                                    'Will the original formatting be preserved?',
                                answer: 'Document tools extract and render content. Complex layouts, charts and scanned PDFs may need a dedicated editor or OCR tool. Each converter explains what to expect.',
                            },
                        ].map((item) => (
                            <details
                                key={item.question}
                                className="group border-b py-3"
                                style={{
                                    borderColor: 'rgb(var(--card-border))',
                                }}
                            >
                                <summary className="flex items-center justify-between gap-4 list-none text-sm font-medium">
                                    {item.question}
                                    <ChevronDown
                                        size={15}
                                        className="muted group-open:rotate-180 transition-transform"
                                    />
                                </summary>
                                <p className="text-sm muted max-w-2xl pt-3 pb-2 leading-relaxed">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
