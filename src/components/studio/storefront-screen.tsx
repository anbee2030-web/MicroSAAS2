"use client";

import { Button, ButtonLink, buttonClass } from "@/components/ui/button";
import { createMailtoHref } from "@/lib/studio/format";
import { getProgress, joinList, listMissingOfferParts } from "@/lib/studio/progress";
import { CopySummaryButton } from "./copy-summary-button";
import { PageIntro } from "./page-intro";
import { Storefront } from "./storefront";
import { useStudio } from "./studio-provider";

export function StorefrontScreen() {
  const { draft } = useStudio();
  const progress = getProgress(draft);
  const missing = listMissingOfferParts(progress);
  const mailto = createMailtoHref(draft.offer, progress.category?.name ?? null);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print">
        <PageIntro
          eyebrow="03 — Storefront"
          title="This is the page."
          description="A client-facing view of the offer you just wrote. It updates from the same draft as the editor."
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href="/studio/offer" variant="secondary">
            Edit offer
          </ButtonLink>
          <CopySummaryButton />
          <Button variant="secondary" onClick={() => window.print()}>
            Print
          </Button>
          <a className={buttonClass("secondary")} href={mailto}>
            Email draft
          </a>
        </div>
        {missing.length > 0 ? (
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            Still to add: {joinList(missing)}. The preview stays available while you fill those in.
          </p>
        ) : (
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            The required pieces are in place. Printing or emailing uses the text of this draft.
          </p>
        )}
      </div>
      <div className="mt-8">
        <Storefront offer={draft.offer} category={progress.category} variant="full" />
      </div>
    </div>
  );
}
