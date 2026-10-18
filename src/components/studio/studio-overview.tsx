"use client";

import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatPriceLabel, formatSavedAt } from "@/lib/studio/format";
import { getOfferStatus, getProgress, hasSavedDraft, nextStudioStep } from "@/lib/studio/progress";
import { cn } from "@/lib/cn";
import { OfferChecklist } from "./offer-checklist";
import { PageIntro } from "./page-intro";
import { useStudio } from "./studio-provider";

export function StudioOverview() {
  const { draft, saveState, requestReset } = useStudio();
  const progress = getProgress(draft);
  const next = nextStudioStep(progress);
  const offerStatus = getOfferStatus(draft, progress);
  const started = hasSavedDraft(draft);

  const steps = [
    {
      index: "01",
      title: "Service",
      href: "/studio/service",
      status: progress.category?.name ?? "Not chosen",
      ready: progress.hasCategory,
      detail: "Pick the kind of work you want to sell.",
    },
    {
      index: "02",
      title: "Offer",
      href: "/studio/offer",
      status: offerStatus,
      ready: progress.offerReady,
      detail: "Name, description, price, and a way to be reached.",
    },
    {
      index: "03",
      title: "Storefront",
      href: "/studio/preview",
      status: progress.offerReady ? "Ready to show" : "Draft preview",
      ready: progress.offerReady,
      detail: "See the page a client would read.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageIntro
        eyebrow="Studio"
        title="Build the offer you can send."
        description="Three decisions stand between you and a page you can show: the service, the offer, and a look at the storefront. The draft stays in this browser."
        action={<ButtonLink href={next.href}>{next.label}</ButtonLink>}
      />

      <ol className="mt-10 grid gap-3 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.href}>
            <Link
              href={step.href}
              className="flex h-full flex-col rounded-3xl border border-line bg-surface p-5 transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-brass"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-display text-2xl text-brass">{step.index}</span>
                <span className={cn("h-1.5 w-1.5 rounded-full", step.ready ? "bg-pine" : "bg-line")} aria-hidden="true" />
              </span>
              <span className="mt-4 text-lg font-semibold text-ink">{step.title}</span>
              <span className="mt-1 text-sm text-pine">{step.status}</span>
              <span className="mt-3 text-sm leading-6 text-ink-soft">{step.detail}</span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-2xl tracking-tight">Offer checklist</h2>
          <div className="mt-4">
            <OfferChecklist progress={progress} />
          </div>
        </section>
        <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-2xl tracking-tight">Current draft</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <DraftRow label="Business" value={draft.offer.businessName.trim() || "Untitled service"} />
            <DraftRow label="Service" value={progress.category?.name ?? "No service yet"} />
            <DraftRow label="Price" value={formatPriceLabel(draft.offer)} />
            <DraftRow label="Email" value={draft.offer.contact.email.trim() || "No email yet"} />
            <DraftRow
              label="Last edit"
              value={
                saveState === "error"
                  ? "Not saved in this browser"
                  : draft.updatedAt
                    ? formatSavedAt(draft.updatedAt)
                    : "Not saved yet"
              }
            />
          </dl>
          <div className="mt-5">
            <ButtonLink href="/studio/offer" variant="secondary">
              Edit the offer
            </ButtonLink>
          </div>
        </section>
      </div>

      {started ? (
        <div className="mt-8">
          <Button variant="danger" onClick={requestReset}>
            Clear this browser draft
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function DraftRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-line pb-3 last:border-b-0 last:pb-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="break-words text-ink">{value}</dd>
    </div>
  );
}
