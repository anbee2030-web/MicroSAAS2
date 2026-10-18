import { cn } from "@/lib/cn";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#143f38" />
      <path
        d="M8 22.5 16 8.5l8 14"
        fill="none"
        stroke="#f6f3ec"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M11.2 22.5h9.6" stroke="#e0c08a" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ tone = "ink" }: { tone?: "ink" | "light" }) {
  const light = tone === "light";
  return (
    <span className="flex items-center gap-3">
      <Mark className="h-8 w-8 shrink-0" />
      <span className="leading-tight">
        <span
          className={cn(
            "block text-[10px] font-medium uppercase tracking-[0.18em]",
            light ? "text-sidebar-muted" : "text-ink-soft",
          )}
        >
          Service
        </span>
        <span className={cn("block text-sm font-semibold", light ? "text-surface" : "text-ink")}>
          Launch Studio
        </span>
      </span>
    </span>
  );
}
