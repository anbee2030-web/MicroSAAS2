"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { serviceCategories } from "@/lib/studio/categories";
import { getProgress } from "@/lib/studio/progress";
import { CategoryIcon } from "./category-icon";
import { PageIntro } from "./page-intro";
import { useStudio } from "./studio-provider";
import { cn } from "@/lib/cn";

export function CategoryPicker() {
  const router = useRouter();
  const { draft, selectCategory } = useStudio();
  const progress = getProgress(draft);
  const [hint, setHint] = useState<string | null>(null);

  function continueToOffer() {
    if (!draft.offer.categoryId) {
      setHint("Choose a category to continue.");
      return;
    }
    router.push("/studio/offer");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageIntro
        eyebrow="01 — Service"
        title="Choose what you sell."
        description="Start with the kind of work a client would hire. You can change this later without losing the offer."
      />

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {serviceCategories.map((category) => {
          const selected = draft.offer.categoryId === category.id;
          return (
            <li key={category.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  selectCategory(category.id);
                  setHint(null);
                }}
                className={cn(
                  "h-full w-full rounded-3xl border bg-surface p-5 text-left transition duration-200 motion-safe:hover:-translate-y-0.5",
                  selected ? "border-pine bg-pine-soft" : "border-line hover:border-brass",
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", selected ? "bg-pine text-surface" : "bg-paper text-pine")}>
                    <CategoryIcon id={category.id} />
                  </span>
                  <span className={cn("text-xs font-medium uppercase tracking-[0.14em]", selected ? "text-pine" : "text-ink-soft")}>
                    {selected ? "Selected" : "Choose"}
                  </span>
                </span>
                <span className="mt-4 block text-lg font-semibold text-ink">{category.name}</span>
                <span className="mt-2 block text-sm leading-6 text-ink-soft">{category.summary}</span>
                <span className="mt-4 block text-xs font-medium uppercase tracking-[0.14em] text-brass">Usual shape</span>
                <span className="mt-1 block text-sm leading-6 text-ink">{category.offerShape}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-3 mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 shadow-[0_16px_40px_-28px_rgba(28,25,21,0.6)] sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="px-2 text-sm text-ink-soft">
          {hint ??
            (progress.category
              ? `${progress.category.name} is selected.`
              : "Select a category to continue.")}
        </p>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/studio" variant="ghost">
            Back to overview
          </ButtonLink>
          <Button onClick={continueToOffer}>Continue to offer</Button>
        </div>
      </div>
    </div>
  );
}
