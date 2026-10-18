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

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function toWebsiteHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function toPhoneHref(value: string): string | null {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7) return null;
  return `tel:${trimmed.replace(/[^\d+]/g, "")}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
