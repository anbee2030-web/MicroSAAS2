"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { getProgress } from "@/lib/studio/progress";
import { useStudio } from "./studio-provider";

const items = [
  { href: "/studio", label: "Overview", caption: "Where the draft stands" },
  { href: "/studio/service", label: "Service", caption: "What you sell" },
  { href: "/studio/offer", label: "Offer", caption: "Price and contact" },
  { href: "/studio/preview", label: "Storefront", caption: "The page clients see" },
] as const;

export function StudioNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { draft } = useStudio();
  const progress = getProgress(draft);

  return (
    <nav aria-label="Studio" className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.href === "/studio" ? pathname === "/studio" : pathname.startsWith(item.href);
        const ready =
          item.href === "/studio/service"
            ? progress.hasCategory
            : item.href === "/studio/offer" || item.href === "/studio/preview"
              ? progress.offerReady
              : false;
        const showDot = item.href !== "/studio";

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition",
              active ? "bg-white/10 text-surface" : "text-sidebar-muted hover:bg-white/5 hover:text-surface",
            )}
          >
            <span>
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-xs text-sidebar-muted">{item.caption}</span>
            </span>
            {showDot ? (
              <span
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", ready ? "bg-[#e0c08a]" : "bg-white/25")}
                aria-hidden="true"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
