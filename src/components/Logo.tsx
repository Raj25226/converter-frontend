interface LogoProps {
    size?: number;
    showWordmark?: boolean;
    animated?: boolean;
    className?: string;
}
export default function Logo({
    size = 30,
    showWordmark = true,
    className = '',
}: LogoProps) {
    return (
        <span
            className={`inline-flex items-center gap-2.5 select-none ${className}`}
            aria-label="Unimorpher"
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
            >
                <rect width="32" height="32" rx="7" fill="#185f46" />
                <path
                    d="M8 11h15m-4-4 4 4-4 4M24 21H9m4-4-4 4 4 4"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {showWordmark && (
                <span
                    className="text-[18px] font-semibold tracking-[-.04em]"
                    style={{ color: 'rgb(var(--fg))' }}
                >
                    unimorpher<span className="accent">.</span>
                </span>
            )}
        </span>
    );
}
