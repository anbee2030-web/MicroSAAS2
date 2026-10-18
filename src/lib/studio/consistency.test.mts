import assert from "node:assert/strict";
import test from "node:test";
import { createEmptyDocument } from "./document";
import { storefrontContactLinks, toWebsiteHref } from "./format";
import { getOfferStatus, getProgress, listMissingOfferParts, nextStudioStep } from "./progress";
import { renderStorefrontWebsite } from "./website-export";
import type { ContactDetails, ServiceOffer, StudioDocument } from "./types";

function draftWith(
  offer: Partial<Omit<ServiceOffer, "contact">> & { contact?: Partial<ContactDetails> } = {},
): StudioDocument {
  const base = createEmptyDocument();
  return {
    ...base,
    offer: {
      ...base.offer,
      ...offer,
      contact: { ...base.offer.contact, ...offer.contact },
      included: offer.included ?? base.offer.included,
    },
  };
}

function hrefs(html: string): string[] {
  return [...html.matchAll(/\shref="([^"]*)"/g)].map((match) => match[1] ?? "");
}

const readyOffer = {
  businessName: "Harbor Editing",
  description: "I rewrite the offer and the page.",
  priceAmount: "120",
  categoryId: "writing" as const,
  contact: { email: "hello@example.com" },
};

test("a missing category prevents Ready and agrees with the missing-field list", () => {
  const incomplete = draftWith({ ...readyOffer, categoryId: null });
  const progress = getProgress(incomplete);
  const missing = listMissingOfferParts(progress);

  assert.equal(progress.hasName, true);
  assert.equal(progress.hasDescription, true);
  assert.equal(progress.hasPrice, true);
  assert.equal(progress.hasEmail, true);
  assert.equal(progress.hasCategory, false);
  assert.equal(progress.offerReady, false);
  assert.equal(missing.length === 0, progress.offerReady);
  assert.equal(missing.includes("a service category"), true);
  assert.notEqual(getOfferStatus(incomplete, progress), "Ready");
  assert.equal(nextStudioStep(progress).href, "/studio/service");

  const complete = draftWith(readyOffer);
  const ready = getProgress(complete);
  assert.equal(ready.offerReady, true);
  assert.deepEqual(listMissingOfferParts(ready), []);
  assert.equal(getOfferStatus(complete, ready), "Ready");
  assert.equal(nextStudioStep(ready).href, "/studio/preview");
});

test("preview and export use the same contact links", () => {
  const cases = [
    {
      email: "hello@example.com",
      phone: "+1 (555) 010-0142",
      location: "Portland",
      website: "http://harbor.example/work",
    },
    {
      email: "not-an-email",
      phone: "123",
      location: "",
      website: "harbor.example/work",
    },
    {
      email: "a<b>@example.com",
      phone: "+1 (555) 010-0142 ext 999999",
      location: "",
      website: "https://user:secret@harbor.example/work",
    },
    {
      email: "",
      phone: "",
      location: "",
      website: "javascript:alert(1)",
    },
  ];

  for (const contact of cases) {
    const links = storefrontContactLinks(contact);
    const html = renderStorefrontWebsite(draftWith({ businessName: "Harbor", contact })).html;
    const found = hrefs(html);

    for (const href of [links.email, links.phone, links.website]) {
      if (href) assert.equal(found.includes(href), true, href);
    }
    for (const href of found) {
      assert.equal([links.email, links.phone, links.website].includes(href), true, href);
    }
  }

  assert.equal(toWebsiteHref("http://harbor.example/work"), "http://harbor.example/work");
  assert.equal(toWebsiteHref("harbor.example/work"), "https://harbor.example/work");
  assert.equal(toWebsiteHref("https://user:secret@harbor.example/work"), null);
  assert.equal(toWebsiteHref("javascript:alert(1)"), null);
  assert.equal(storefrontContactLinks(cases[0]).website, "http://harbor.example/work");
  assert.equal(storefrontContactLinks(cases[1]).website, "https://harbor.example/work");
});
