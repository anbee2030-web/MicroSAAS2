import type { StudioDocument } from "./types";

/**
 * Interface copy for the marketing page. This is a layout sample,
 * not a customer, testimonial, or result.
 */
export const layoutSample: StudioDocument = {
  schemaVersion: 1,
  updatedAt: null,
  offer: {
    businessName: "Studio name",
    tagline: "A clear promise to the client.",
    description:
      "Who the service is for, how the engagement works, and what the client leaves with.",
    categoryId: "brand-design",
    pricingModel: "project",
    priceAmount: "1800",
    currency: "USD",
    deliveryWindow: "2 weeks",
    included: [
      { id: "sample-1", text: "A kickoff conversation" },
      { id: "sample-2", text: "The core deliverable" },
      { id: "sample-3", text: "One round of revisions" },
    ],
    contact: {
      email: "you@email.com",
      phone: "",
      location: "Your city",
      website: "",
    },
  },
};
