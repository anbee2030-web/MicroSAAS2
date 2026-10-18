import { getCategory } from "./categories";
import { sanitizePrice } from "./format";
import {
  STUDIO_SCHEMA_VERSION,
  isCategoryId,
  isCurrency,
  isPricingModel,
  type IncludedItem,
  type ServiceOffer,
  type StudioDocument,
} from "./types";

export function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyOffer(): ServiceOffer {
  return {
    businessName: "",
    tagline: "",
    description: "",
    categoryId: null,
    pricingModel: "project",
    priceAmount: "",
    currency: "USD",
    deliveryWindow: "",
    included: [{ id: "included-1", text: "" }],
    contact: {
      email: "",
      phone: "",
      location: "",
      website: "",
    },
  };
}

export function createEmptyDocument(): StudioDocument {
  return {
    schemaVersion: STUDIO_SCHEMA_VERSION,
    updatedAt: null,
    offer: createEmptyOffer(),
  };
}

export function isDraftStarted(draft: StudioDocument): boolean {
  const offer = draft.offer;
  return Boolean(
    draft.updatedAt ||
      offer.categoryId ||
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
}

function asString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max);
}

function asTimestamp(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return null;
  return new Date(time).toISOString();
}

function parseIncluded(value: unknown): IncludedItem[] {
  if (!Array.isArray(value)) return [{ id: "included-1", text: "" }];

  const seen = new Set<string>();
  const items = value.slice(0, 12).flatMap((item, index) => {
    if (typeof item === "string") {
      const text = item.slice(0, 120);
      const id = `included-${index + 1}`;
      seen.add(id);
      return [{ id, text }];
    }
    if (!item || typeof item !== "object" || !("text" in item)) return [];
    const record = item as { id?: unknown; text?: unknown };
    const text = asString(record.text, 120);
    let id = typeof record.id === "string" && record.id.trim() ? record.id.slice(0, 80) : `included-${index + 1}`;
    if (seen.has(id)) id = `${id}-${index + 1}`;
    seen.add(id);
    return [{ id, text }];
  });

  return items.length > 0 ? items : [{ id: "included-1", text: "" }];
}

/**
 * Reads the fields this version understands and drops anything else.
 * A newer schema still loads best-effort instead of crashing the studio.
 */
export function parseStudioDocument(value: unknown): StudioDocument {
  if (!value || typeof value !== "object") return createEmptyDocument();
  const record = value as Record<string, unknown>;
  const offerValue = record.offer;
  if (!offerValue || typeof offerValue !== "object") return createEmptyDocument();

  const offer = offerValue as Record<string, unknown>;
  const contactValue = offer.contact;
  const contact =
    contactValue && typeof contactValue === "object"
      ? (contactValue as Record<string, unknown>)
      : {};

  const categoryRaw = offer.categoryId;
  const categoryId =
    typeof categoryRaw === "string" && isCategoryId(categoryRaw) && getCategory(categoryRaw)
      ? categoryRaw
      : null;

  return {
    schemaVersion: STUDIO_SCHEMA_VERSION,
    updatedAt: asTimestamp(record.updatedAt),
    offer: {
      businessName: asString(offer.businessName, 80),
      tagline: asString(offer.tagline, 120),
      description: asString(offer.description, 800),
      categoryId,
      pricingModel: isPricingModel(offer.pricingModel) ? offer.pricingModel : "project",
      priceAmount: sanitizePrice(asString(offer.priceAmount, 12)),
      currency: isCurrency(offer.currency) ? offer.currency : "USD",
      deliveryWindow: asString(offer.deliveryWindow, 60),
      included: parseIncluded(offer.included),
      contact: {
        email: asString(contact.email, 120),
        phone: asString(contact.phone, 40),
        location: asString(contact.location, 80),
        website: asString(contact.website, 160),
      },
    },
  };
}
