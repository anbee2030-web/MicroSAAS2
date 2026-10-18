import { cn } from "@/lib/cn";
import type { StudioProgress } from "@/lib/studio/progress";

const labels = [
  { key: "hasCategory", label: "Category" },
  { key: "hasName", label: "Name" },
  { key: "hasDescription", label: "Description" },
  { key: "hasPrice", label: "Price" },
  { key: "hasEmail", label: "Email" },
] as const;

export function OfferChecklist({
  progress,
  layout = "stack",
}: {
  progress: StudioProgress;
  layout?: "stack" | "row";
}) {
  return (
    <ul className={cn(layout === "row" ? "flex flex-wrap gap-2" : "space-y-2")} aria-label="Offer checklist">
      {labels.map((item) => {
        const done = progress[item.key];
        return (
          <li
            key={item.key}
            className={cn(
              "flex items-center gap-2 text-sm",
              layout === "row" && "rounded-full border border-line bg-surface px-3 py-1.5",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border",
                done ? "border-pine bg-pine text-surface" : "border-line bg-surface text-transparent",
              )}
              aria-hidden="true"
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.5 8.2 6.4 11l6.1-6" />
              </svg>
            </span>
            <span className={done ? "text-ink" : "text-ink-soft"}>
              {item.label}
              <span className="sr-only">{done ? " complete" : " still needed"}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
