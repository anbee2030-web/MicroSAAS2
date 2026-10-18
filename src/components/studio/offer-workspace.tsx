"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, SelectInput, TextArea, TextInput, controlClass } from "@/components/ui/field";
import { currencyOptions, pricingChoices, sanitizePrice } from "@/lib/studio/format";
import { createId } from "@/lib/studio/document";
import { getProgress } from "@/lib/studio/progress";
import { cn } from "@/lib/cn";
import { CopySummaryButton } from "./copy-summary-button";
import { OfferChecklist } from "./offer-checklist";
import { PageIntro } from "./page-intro";
import { Storefront } from "./storefront";
import { useStudio } from "./studio-provider";

export function OfferWorkspace() {
  const { draft, updateOffer, addIncluded, updateIncluded, removeIncluded, saveNow } = useStudio();
  const offer = draft.offer;
  const progress = getProgress(draft);
  const [panel, setPanel] = useState<"edit" | "preview">("edit");
  const [limitNote, setLimitNote] = useState<string | null>(null);
  const focusId = useRef<string | null>(null);

  useEffect(() => {
    if (!focusId.current) return;
    const node = document.getElementById(`included-${focusId.current}`);
    if (node instanceof HTMLInputElement) node.focus();
    focusId.current = null;
  }, [offer.included]);

  function addLine() {
    if (offer.included.length >= 12) {
      setLimitNote("The preview holds up to 12 included items.");
      return;
    }
    const id = createId("included");
    focusId.current = id;
    setLimitNote(null);
    addIncluded(id);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        eyebrow="02 — Offer"
        title="Write the offer."
        description="Name the business, describe the work, set a price, and add a way to be reached."
        action={
          <Button type="submit" form="offer-form">
            Save draft
          </Button>
        }
      />
      <p className="mt-4 text-sm text-ink-soft">Edits are saved in this browser as you type.</p>

      <div className="mt-6">
        <OfferChecklist progress={progress} layout="row" />
      </div>

      <div className="sticky top-14 z-20 mt-6 flex rounded-xl border border-line bg-paper p-1 xl:hidden">
        <button
          type="button"
          aria-pressed={panel === "edit"}
          className={cn("h-10 flex-1 rounded-lg text-sm font-medium", panel === "edit" ? "bg-surface text-ink shadow-sm" : "text-ink-soft")}
          onClick={() => setPanel("edit")}
        >
          Edit
        </button>
        <button
          type="button"
          aria-pressed={panel === "preview"}
          className={cn(
            "h-10 flex-1 rounded-lg text-sm font-medium",
            panel === "preview" ? "bg-surface text-ink shadow-sm" : "text-ink-soft",
          )}
          onClick={() => setPanel("preview")}
        >
          Preview
        </button>
      </div>

      <div className="mt-6 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form
          id="offer-form"
          noValidate
          className={cn("space-y-5", panel === "edit" ? "block" : "hidden xl:block")}
          onSubmit={(event) => {
            event.preventDefault();
            saveNow();
          }}
        >
          <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl tracking-tight">The service</h2>
              <Link
                href="/studio/service"
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink"
              >
                {progress.category ? progress.category.name : "Choose a service"}
                <span className="ml-2 text-ink-soft">Change</span>
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              <Field label="Business name" htmlFor="business-name" hint="Required">
                <TextInput
                  id="business-name"
                  name="businessName"
                  maxLength={80}
                  autoComplete="organization"
                  placeholder="Your business name"
                  value={offer.businessName}
                  onChange={(event) => updateOffer({ businessName: event.target.value })}
                />
              </Field>
              <Field label="Tagline" htmlFor="tagline" hint="Optional">
                <TextInput
                  id="tagline"
                  name="tagline"
                  maxLength={120}
                  placeholder="The result a client can expect"
                  value={offer.tagline}
                  onChange={(event) => updateOffer({ tagline: event.target.value })}
                />
              </Field>
              <Field label="Description" htmlFor="description" hint={`${offer.description.length}/800`}>
                <TextArea
                  id="description"
                  name="description"
                  maxLength={800}
                  placeholder="Who it is for, how the work happens, and what they leave with."
                  value={offer.description}
                  onChange={(event) => updateOffer({ description: event.target.value })}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-2xl tracking-tight">Pricing</h2>
            <div className="mt-5 space-y-4">
              <div role="radiogroup" aria-label="Pricing model" className="grid gap-2 sm:grid-cols-3">
                {pricingChoices.map((choice) => {
                  const selected = offer.pricingModel === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => updateOffer({ pricingModel: choice.id })}
                      className={cn(
                        "rounded-2xl border px-3 py-3 text-left",
                        selected ? "border-pine bg-pine-soft" : "border-line bg-surface hover:border-brass",
                      )}
                    >
                      <span className="block text-sm font-medium text-ink">{choice.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-ink-soft">{choice.description}</span>
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                <Field label="Currency" htmlFor="currency">
                  <SelectInput
                    id="currency"
                    name="currency"
                    value={offer.currency}
                    onChange={(event) => {
                      const currency = currencyOptions.find((option) => option.id === event.target.value);
                      if (currency) updateOffer({ currency: currency.id });
                    }}
                  >
                    {currencyOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Price" htmlFor="price" hint="Required">
                  <TextInput
                    id="price"
                    name="price"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="1800"
                    value={offer.priceAmount}
                    onChange={(event) => updateOffer({ priceAmount: sanitizePrice(event.target.value) })}
                  />
                </Field>
              </div>
              <Field label="Delivery" htmlFor="delivery" hint="Optional">
                <TextInput
                  id="delivery"
                  name="delivery"
                  maxLength={60}
                  placeholder="2 weeks"
                  value={offer.deliveryWindow}
                  onChange={(event) => updateOffer({ deliveryWindow: event.target.value })}
                />
              </Field>
              <div>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-ink">Included</p>
                  <p className="text-xs text-ink-soft">What the engagement covers</p>
                </div>
                <ul className="space-y-2">
                  {offer.included.map((item, index) => (
                    <li key={item.id} className="flex gap-2">
                      <input
                        id={`included-${item.id}`}
                        className={controlClass}
                        maxLength={120}
                        value={item.text}
                        aria-label={`Included item ${index + 1}`}
                        placeholder="A kickoff conversation"
                        onChange={(event) => updateIncluded(item.id, event.target.value)}
                      />
                      <Button
                        variant="ghost"
                        className="shrink-0"
                        aria-label={`Remove included item ${index + 1}`}
                        onClick={() => removeIncluded(item.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Button variant="secondary" onClick={addLine}>
                    Add a line
                  </Button>
                  {limitNote ? (
                    <p role="status" className="text-sm text-ink-soft">
                      {limitNote}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-2xl tracking-tight">Contact</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Email" htmlFor="email" hint="Required">
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={120}
                  placeholder="you@email.com"
                  value={offer.contact.email}
                  onChange={(event) => updateOffer({ contact: { email: event.target.value } })}
                />
              </Field>
              <Field label="Phone" htmlFor="phone" hint="Optional">
                <TextInput
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  placeholder="(555) 010-0142"
                  value={offer.contact.phone}
                  onChange={(event) => updateOffer({ contact: { phone: event.target.value } })}
                />
              </Field>
              <Field label="Location" htmlFor="location" hint="Optional">
                <TextInput
                  id="location"
                  name="location"
                  autoComplete="address-level2"
                  maxLength={80}
                  placeholder="City or region"
                  value={offer.contact.location}
                  onChange={(event) => updateOffer({ contact: { location: event.target.value } })}
                />
              </Field>
              <Field label="Website" htmlFor="website" hint="Optional">
                <TextInput
                  id="website"
                  name="website"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  maxLength={160}
                  placeholder="yoursite.com"
                  value={offer.contact.website}
                  onChange={(event) => updateOffer({ contact: { website: event.target.value } })}
                />
              </Field>
            </div>
          </section>
        </form>

        <aside className={cn("xl:sticky xl:top-8", panel === "preview" ? "block" : "hidden xl:block")}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink">Live preview</p>
            <div className="flex gap-2">
              <CopySummaryButton size="sm" />
              <ButtonLink href="/studio/preview" variant="secondary" size="sm">
                Full page
              </ButtonLink>
            </div>
          </div>
          <Storefront offer={offer} category={progress.category} variant="embedded" />
        </aside>
      </div>
    </div>
  );
}
