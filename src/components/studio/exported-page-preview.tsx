"use client";

import { renderStorefrontWebsite } from "@/lib/studio/website-export";
import type { StudioDocument } from "@/lib/studio/types";

export function ExportedPagePreview({ draft }: { draft: StudioDocument }) {
  const website = renderStorefrontWebsite(draft);

  return (
    <section aria-labelledby="exported-preview-title">
      <div className="mb-3 max-w-2xl">
        <h2 id="exported-preview-title" className="text-sm font-medium text-ink">
          Website file
        </h2>
        <p className="mt-1 text-sm leading-6 text-ink-soft">
          This preview is the HTML file Export Website downloads. Empty fields are left out. The offer editor is
          the only place that fills those gaps with placeholders.
        </p>
      </div>
      <iframe
        title={`Preview of ${website.filename}`}
        className="export-frame h-[min(80dvh,920px)] w-full rounded-[28px] border border-line bg-surface"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        referrerPolicy="no-referrer"
        srcDoc={website.html}
      />
    </section>
  );
}
