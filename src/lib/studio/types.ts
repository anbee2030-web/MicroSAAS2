export const STUDIO_SCHEMA_VERSION = 1 as const;

export const categoryIds = [
  "brand-design",
  "web-design",
  "development",
  "writing",
  "marketing",
  "photo-video",
  "coaching",
  "consulting",
] as const;

export type CategoryId = (typeof categoryIds)[number];

export const pricingModels = ["project", "hourly", "retainer"] as const;

export type PricingModel = (typeof pricingModels)[number];

export const currencies = ["USD", "EUR", "GBP", "CAD"] as const;

export type CurrencyCode = (typeof currencies)[number];

export interface ServiceCategory {
  id: CategoryId;
  name: string;
  summary: string;
  clients: string;
  offerShape: string;
}

export interface IncludedItem {
  id: string;
  text: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface ServiceOffer {
  businessName: string;
  tagline: string;
  description: string;
  categoryId: CategoryId | null;
  pricingModel: PricingModel;
  priceAmount: string;
  currency: CurrencyCode;
  deliveryWindow: string;
  included: IncludedItem[];
  contact: ContactDetails;
}

/**
 * The studio draft is the source of truth for the MVP.
 * schemaVersion is the migration point: later accounts, AI drafts,
 * planning notes, and publishing settings can be added as new fields
 * and read forward from older browser data.
 */
export interface StudioDocument {
  schemaVersion: number;
  updatedAt: string | null;
  offer: ServiceOffer;
}

export type OfferPatch = Partial<
  Omit<ServiceOffer, "contact" | "included" | "categoryId">
> & {
  contact?: Partial<ContactDetails>;
};

export function isCategoryId(value: string): value is CategoryId {
  return (categoryIds as readonly string[]).includes(value);
}

export function isPricingModel(value: unknown): value is PricingModel {
  return typeof value === "string" && (pricingModels as readonly string[]).includes(value);
}

export function isCurrency(value: unknown): value is CurrencyCode {
  return typeof value === "string" && (currencies as readonly string[]).includes(value);
}
