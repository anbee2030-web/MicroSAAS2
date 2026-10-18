"use client";

import { Button, ButtonLink, buttonClass } from "@/components/ui/button";
import { createMailtoHref } from "@/lib/studio/format";
import { getProgress, joinList, listMissingOfferParts } from "@/lib/studio/progress";
import { CopySummaryButton } from "./copy-summary-button";
import { ExportWebsiteButton } from "./export-website-button";
import { ExportedPagePreview } from "./exported-page-preview";
import { PageIntro } from "./page-intro";
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
          description="The page a client would open from the downloaded file. It uses the same draft as the editor."
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
          <ExportWebsiteButton />
        </div>
        <p id="export-note" className="mt-4 max-w-2xl text-sm leading-6 text-ink-soft">
          Export Website downloads an HTML file to this device. It does not publish the page online.
        </p>
        {missing.length > 0 ? (
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Still to add: {joinList(missing)}. The preview stays available while you fill those in.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            The required pieces are in place. Printing, emailing, and copying still use this same draft.
          </p>
        )}
      </div>
      <div className="mt-8">
        <ExportedPagePreview draft={draft} />
      </div>
    </div>
  );
}
