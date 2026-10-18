import assert from "node:assert/strict";
import test from "node:test";
import { createEmptyDocument } from "./document";
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

test("escapes user content so it cannot become markup", () => {
  const website = renderStorefrontWebsite(
    draftWith({
      businessName: `</title><script>alert("xss")</script>`,
      tagline: `Tom & Jerry's "offer"`,
      description: `"><img src=x onerror=alert(1)>`,
      included: [{ id: "1", text: `<li>injected</li>` }],
      contact: { email: `a<b>@example.com`, website: `javascript:alert(1)` },
    }),
  );

  assert.equal(website.html.includes("<script"), false);
  assert.equal(website.html.includes("<img"), false);
  assert.equal(website.html.includes("</title><script>"), false);
  assert.match(website.html, /&lt;script&gt;alert\(&quot;xss&quot;\)&lt;\/script&gt;/);
  assert.match(website.html, /Tom &amp; Jerry&#39;s &quot;offer&quot;/);
  assert.match(website.html, /&lt;li&gt;injected&lt;\/li&gt;/);
  assert.equal(hrefs(website.html).some((href) => href.toLowerCase().startsWith("javascript:")), false);
  assert.match(website.filename, /^[a-z0-9-]+\.html$/);
  assert.equal(website.filename.includes("/"), false);
});

test("omits optional fields and does not invent contact links", () => {
  const website = renderStorefrontWebsite(
    draftWith({
      businessName: "Plain Studio",
      description: "A short description of the work.",
      priceAmount: "400",
      contact: {
        email: "not-an-email",
        phone: "123",
        website: "javascript:alert(1)",
      },
    }),
  );
  const html = website.html;

  assert.match(html, /Plain Studio/);
  assert.match(html, /A short description of the work\./);
  assert.match(html, /\$400 project/);
  assert.equal(html.includes("<h2>Includes</h2>"), false);
  assert.equal(html.includes('class="promise"'), false);
  assert.equal(html.includes("not-an-email"), true);
  assert.equal(hrefs(html).some((href) => href.startsWith("mailto:")), false);
  assert.equal(hrefs(html).some((href) => href.startsWith("tel:")), false);
  assert.equal(hrefs(html).some((href) => href.startsWith("http://")), false);
  assert.equal(hrefs(html).some((href) => href.toLowerCase().includes("javascript:")), false);
  assert.match(html, /<!DOCTYPE html>/);
  assert.match(html, /name="viewport"/);
  assert.equal(html.includes("<script"), false);
  assert.equal(html.includes("fonts.googleapis.com"), false);
  assert.equal(html.includes("cdn."), false);
});

test("writes validated mailto, tel, and website links", () => {
  const website = renderStorefrontWebsite(
    draftWith({
      businessName: "Harbor Editing",
      tagline: "Clear pages for service businesses.",
      description: "I rewrite the offer and the page.",
      categoryId: "writing",
      pricingModel: "hourly",
      priceAmount: "120",
      deliveryWindow: "One week",
      included: [
        { id: "1", text: "Offer page" },
        { id: "2", text: "   " },
      ],
      contact: {
        email: "hello@example.com",
        phone: "+1 (555) 010-0142",
        location: "Portland",
        website: "http://harbor.example/work",
      },
    }),
  );
  const links = hrefs(website.html);

  assert.equal(links.includes("mailto:hello@example.com"), true);
  assert.equal(links.includes("tel:+15550100142"), true);
  assert.equal(links.includes("http://harbor.example/work"), true);
  assert.match(website.html, /href="http:\/\/harbor\.example\/work" target="_blank" rel="noopener noreferrer"/);
  assert.match(website.html, /Writing &amp; editing/);
  assert.match(website.html, /\$120 \/ hour/);
  assert.match(website.html, /One week/);
  assert.match(website.html, /Offer page/);
  assert.match(website.html, /Portland/);
  assert.equal(website.filename, "harbor-editing.html");
  assert.equal((website.html.match(/<li>/g) ?? []).length, 1);
});
