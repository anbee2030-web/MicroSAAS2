import { getCategory } from "./categories";
import { isDraftStarted } from "./document";
import { formatMoney, includedLines, isEmail } from "./format";
import type { ServiceCategory, StudioDocument } from "./types";

export interface StudioProgress {
  category: ServiceCategory | null;
  hasCategory: boolean;
  hasName: boolean;
  hasDescription: boolean;
  hasPrice: boolean;
  hasEmail: boolean;
  offerReady: boolean;
  included: string[];
}

export function getProgress(draft: StudioDocument): StudioProgress {
  const offer = draft.offer;
  const category = getCategory(offer.categoryId);
  const hasCategory = category !== null;
  const hasName = offer.businessName.trim().length > 0;
  const hasDescription = offer.description.trim().length > 0;
  const hasPrice = formatMoney(offer.priceAmount, offer.currency) !== null;
  const hasEmail = isEmail(offer.contact.email);
  const included = includedLines(offer);

  return {
    category,
    hasCategory,
    hasName,
    hasDescription,
    hasPrice,
    hasEmail,
    offerReady: hasName && hasDescription && hasPrice && hasEmail,
    included,
  };
}

export type StepStatus = "Not started" | "In progress" | "Ready";

export function getOfferStatus(draft: StudioDocument, progress: StudioProgress): StepStatus {
  if (progress.offerReady) return "Ready";
  const offer = draft.offer;
  const started = Boolean(
    offer.businessName.trim() ||
      offer.tagline.trim() ||
      offer.description.trim() ||
      offer.priceAmount.trim() ||
      offer.deliveryWindow.trim() ||
      offer.included.some((item) => item.text.trim()) ||
      offer.contact.email.trim() ||
      offer.contact.phone.trim() ||
      offer.contact.location.trim() ||
      offer.contact.website.trim(),
  );
  return started ? "In progress" : "Not started";
}

export function nextStudioStep(progress: StudioProgress): { href: string; label: string } {
  if (!progress.hasCategory) return { href: "/studio/service", label: "Choose a service" };
  if (!progress.offerReady) return { href: "/studio/offer", label: "Finish the offer" };
  return { href: "/studio/preview", label: "Open the storefront" };
}

export function listMissingOfferParts(progress: StudioProgress): string[] {
  const missing: string[] = [];
  if (!progress.hasCategory) missing.push("a service category");
  if (!progress.hasName) missing.push("a business name");
  if (!progress.hasDescription) missing.push("a description");
  if (!progress.hasPrice) missing.push("a price");
  if (!progress.hasEmail) missing.push("an email address");
  return missing;
}

export function joinList(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

export function hasSavedDraft(draft: StudioDocument): boolean {
  return isDraftStarted(draft);
}
