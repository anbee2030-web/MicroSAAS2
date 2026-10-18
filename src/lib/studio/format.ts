import type { CurrencyCode, PricingModel, ServiceOffer } from "./types";

export const pricingChoices: {
  id: PricingModel;
  label: string;
  description: string;
}[] = [
  {
    id: "project",
    label: "Fixed project",
    description: "One price for a defined engagement",
  },
  {
    id: "hourly",
    label: "Hourly",
    description: "A rate for time spent",
  },
  {
    id: "retainer",
    label: "Retainer",
    description: "A monthly amount",
  },
];

export const currencyOptions: { id: CurrencyCode; label: string }[] = [
  { id: "USD", label: "USD — US dollar" },
  { id: "EUR", label: "EUR — Euro" },
  { id: "GBP", label: "GBP — British pound" },
  { id: "CAD", label: "CAD — Canadian dollar" },
];

export function sanitizePrice(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const dot = cleaned.indexOf(".");
  if (dot === -1) return cleaned.slice(0, 7);
  const whole = cleaned.slice(0, dot).slice(0, 7);
  const fraction = cleaned.slice(dot + 1).replace(/\./g, "").slice(0, 2);
  return `${whole}.${fraction}`;
}

export function formatMoney(amount: string, currency: CurrencyCode): string | null {
  const trimmed = amount.trim();
  if (!trimmed || trimmed === ".") return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) return null;
  const hasCents = trimmed.includes(".");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPriceLabel(
  offer: Pick<ServiceOffer, "priceAmount" | "currency" | "pricingModel">,
): string {
  const money = formatMoney(offer.priceAmount, offer.currency);
  if (!money) return "Price not set";
  if (offer.pricingModel === "hourly") return `${money} / hour`;
  if (offer.pricingModel === "retainer") return `${money} / month`;
  return `${money} project`;
}

export function formatSavedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function includedLines(offer: ServiceOffer): string[] {
  return offer.included.map((item) => item.text.trim()).filter(Boolean);
}

export function createOfferSummary(offer: ServiceOffer, categoryName: string | null): string {
  const included = includedLines(offer);
  const lines = [
    offer.businessName.trim() || "Untitled service",
    offer.tagline.trim(),
    categoryName ? `Service: ${categoryName}` : "",
    "",
    offer.description.trim(),
    "",
    `Pricing: ${formatPriceLabel(offer)}`,
    offer.deliveryWindow.trim() ? `Delivery: ${offer.deliveryWindow.trim()}` : "",
    included.length > 0 ? ["Includes:", ...included.map((item) => `- ${item}`)].join("\n") : "",
    "",
    "Contact",
    offer.contact.email.trim() ? `Email: ${offer.contact.email.trim()}` : "",
    offer.contact.phone.trim() ? `Phone: ${offer.contact.phone.trim()}` : "",
    offer.contact.location.trim() ? `Location: ${offer.contact.location.trim()}` : "",
    offer.contact.website.trim() ? `Website: ${offer.contact.website.trim()}` : "",
  ];

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function createMailtoHref(offer: ServiceOffer, categoryName: string | null): string {
  const email = offer.contact.email.trim();
  const recipient = isEmail(email) ? email : "";
  const subject = offer.businessName.trim() || "Service offer draft";
  const body = createOfferSummary(offer, categoryName);
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const SAFE_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const SAFE_TEL = /^tel:\+?\d{7,15}$/;

export function isEmail(value: string): boolean {
  return SAFE_EMAIL.test(value.trim());
}

/** Contact mailto used by both the editor preview and the downloaded page. */
export function toMailtoHref(value: string): string | null {
  const email = value.trim();
  if (!isEmail(email)) return null;
  return `mailto:${email}`;
}

/**
 * Website href used by both the editor preview and the downloaded page.
 * An explicit http or https URL keeps that scheme. A missing scheme becomes https.
 * Other schemes and URLs with credentials are rejected.
 */
export function toWebsiteHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("//") || /[\u0000-\u0020"'<>\\]/.test(trimmed)) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  if (hasScheme && !/^https?:\/\//i.test(trimmed)) return null;
  const withProtocol = hasScheme ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }
  if (url.username || url.password) return null;
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!url.hostname.includes(".")) return null;
  const href = url.toString();
  if (url.protocol === "http:" && !href.startsWith("http://")) return null;
  if (url.protocol === "https:" && !href.startsWith("https://")) return null;
  if (/[\s"'<>]/.test(href)) return null;
  return href;
}

/** Phone href used by both the editor preview and the downloaded page. */
export function toPhoneHref(value: string): string | null {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  const href = `tel:${trimmed.replace(/[^\d+]/g, "")}`;
  if (!SAFE_TEL.test(href)) return null;
  return href;
}

export interface StorefrontContactLinks {
  email: string | null;
  phone: string | null;
  website: string | null;
}

export function storefrontContactLinks(contact: {
  email: string;
  phone: string;
  website: string;
}): StorefrontContactLinks {
  return {
    email: toMailtoHref(contact.email),
    phone: toPhoneHref(contact.phone),
    website: toWebsiteHref(contact.website),
  };
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
