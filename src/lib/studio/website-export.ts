import { getCategory } from "./categories";
import { formatPriceLabel, includedLines, storefrontContactLinks } from "./format";
import type { ServiceOffer, StudioDocument } from "./types";

/**
 * A complete website document produced from a studio draft.
 * Later publishing can upload `html` without changing the generator.
 */
export interface StorefrontWebsite {
  filename: string;
  html: string;
}

const STYLES = `
:root {
  color-scheme: light;
  --paper: #f3f1ea;
  --surface: #fffcf7;
  --ink: #1c1915;
  --muted: #625d55;
  --line: #e3ddd1;
  --pine: #143f38;
  --pine-ink: #f6f3ec;
  --brass: #7a5a32;
}
* { box-sizing: border-box; }
html { background: var(--paper); }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.5;
}
main {
  width: min(880px, calc(100% - 32px));
  margin: 0 auto;
  padding: 56px 0 72px;
}
.eyebrow {
  margin: 0;
  color: var(--brass);
  font-size: 0.78rem;
  font-weight: 650;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
h1 {
  margin: 12px 0 0;
  font-family: Georgia, "Iowan Old Style", Palatino, "Palatino Linotype", serif;
  font-size: clamp(2.6rem, 7vw, 4.6rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 0.98;
  overflow-wrap: anywhere;
}
.promise {
  max-width: 38rem;
  margin: 18px 0 0;
  color: var(--muted);
  font-size: 1.2rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}
.description { max-width: 40rem; margin-top: 28px; }
.description p { margin: 0 0 14px; font-size: 1.02rem; line-height: 1.7; overflow-wrap: anywhere; }
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 14px;
  margin-top: 32px;
}
.grid:has(> :only-child) { grid-template-columns: 1fr; }
.card { border-radius: 24px; padding: 22px; }
.price { background: var(--pine); color: var(--pine-ink); }
.price .eyebrow, .includes .eyebrow { color: inherit; opacity: 0.72; }
.amount {
  margin: 14px 0 0;
  font-family: Georgia, "Iowan Old Style", Palatino, serif;
  font-size: clamp(2rem, 4vw, 2.7rem);
  line-height: 1.05;
  overflow-wrap: anywhere;
}
.delivery { margin: 10px 0 0; font-size: 0.95rem; }
.includes { background: var(--surface); border: 1px solid var(--line); }
.includes h2 { margin: 0; }
.includes .eyebrow { color: var(--brass); opacity: 1; }
.includes ul { margin: 14px 0 0; padding: 0; list-style: none; }
.includes li {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  margin-top: 10px;
  overflow-wrap: anywhere;
}
.includes li::before {
  content: "";
  width: 8px;
  height: 8px;
  margin-top: 0.5em;
  border-radius: 99px;
  background: var(--pine);
}
.contact {
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}
.contact h2 {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 650;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brass);
}
.rows { margin: 14px 0 0; }
.row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--line);
}
.row dt { color: var(--muted); }
.row dd { margin: 0; overflow-wrap: anywhere; }
a { color: var(--pine); }
@media (max-width: 700px) {
  main { width: min(100% - 28px, 880px); padding-top: 36px; }
  .grid, .row { grid-template-columns: 1fr; }
  .row { gap: 2px; }
}
@media print {
  body, html { background: white; }
  main { width: auto; padding: 0; }
  .price { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`.trim();

export function renderStorefrontWebsite(draft: StudioDocument): StorefrontWebsite {
  const offer = draft.offer;
  const category = getCategory(offer.categoryId);
  const title = cleanText(offer.businessName).trim() || "Untitled service";
  const html = renderDocument(offer, title, category?.name ?? null);
  return { filename: websiteFilename(title), html };
}

function renderDocument(offer: ServiceOffer, title: string, categoryName: string | null): string {
  const tagline = cleanText(offer.tagline).trim();
  const description = descriptionHtml(offer.description);
  const included = includedLines(offer).map(cleanText).filter((item) => item.trim());
  const price = escapeHtml(formatPriceLabel(offer));
  const delivery = cleanText(offer.deliveryWindow).trim();
  const summary = tagline || firstLine(offer.description);
  const contact = contactHtml(offer);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
${summary ? `<meta name="description" content="${escapeHtml(summary)}">` : ""}
<style>
${STYLES}
</style>
</head>
<body>
<main>
${categoryName ? `<p class="eyebrow">${escapeHtml(categoryName)}</p>` : ""}
<h1>${escapeHtml(title)}</h1>
${tagline ? `<p class="promise">${escapeHtml(tagline)}</p>` : ""}
${description}
<section class="grid">
<article class="card price">
<p class="eyebrow">${escapeHtml(pricingEyebrow(offer))}</p>
<p class="amount">${price}</p>
${delivery ? `<p class="delivery">${escapeHtml(delivery)}</p>` : ""}
</article>
${
  included.length > 0
    ? `<article class="card includes">
<h2 class="eyebrow">Includes</h2>
<ul>
${included.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
</ul>
</article>`
    : ""
}
</section>
${contact}
</main>
</body>
</html>
`;
}

function descriptionHtml(value: string): string {
  const cleaned = cleanText(value).trim();
  if (!cleaned) return "";
  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`);
  return `<div class="description">\n${paragraphs.join("\n")}\n</div>`;
}

function contactHtml(offer: ServiceOffer): string {
  const links = storefrontContactLinks(offer.contact);
  const rows = [
    contactRow("Email", offer.contact.email, links.email),
    contactRow("Phone", offer.contact.phone, links.phone),
    contactRow("Location", offer.contact.location, null),
    contactRow("Website", offer.contact.website, links.website),
  ].filter((row): row is string => row !== null);

  if (rows.length === 0) return "";
  return `<section class="contact">
<h2>Contact</h2>
<dl class="rows">
${rows.join("\n")}
</dl>
</section>`;
}

function contactRow(label: string, value: string, href: string | null): string | null {
  const visible = cleanText(value).trim();
  if (!visible) return null;
  const text = escapeHtml(visible);
  const external = href !== null && (href.startsWith("https://") || href.startsWith("http://"));
  const content =
    href === null
      ? text
      : `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
  return `<div class="row"><dt>${escapeHtml(label)}</dt><dd>${content}</dd></div>`;
}

function pricingEyebrow(offer: ServiceOffer): string {
  if (offer.pricingModel === "hourly") return "Hourly";
  if (offer.pricingModel === "retainer") return "Monthly retainer";
  return "Fixed project";
}

function firstLine(value: string): string {
  return cleanText(value)
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean) ?? "";
}

function websiteFilename(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "service-storefront"}.html`;
}

function cleanText(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
