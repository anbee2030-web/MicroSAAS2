import type { CategoryId, ServiceCategory } from "./types";

export const serviceCategories: ServiceCategory[] = [
  {
    id: "brand-design",
    name: "Brand & visual design",
    summary:
      "Identity, logos, and art direction for a business that needs to look deliberate.",
    clients: "Founders and local businesses preparing to face customers.",
    offerShape: "A fixed project with named deliverables and revision rounds.",
  },
  {
    id: "web-design",
    name: "Websites & product design",
    summary:
      "Pages and interfaces that help someone understand an offer and take the next step.",
    clients: "Teams that already have something to sell and need the screen to explain it.",
    offerShape: "A project fee tied to a page, a flow, or a short design sprint.",
  },
  {
    id: "development",
    name: "Software & automation",
    summary: "Sites, tools, and small automations that ship a feature or remove manual work.",
    clients: "Operators who already know the workflow they want improved.",
    offerShape: "A fixed build, an hourly rate, or a retainer for ongoing changes.",
  },
  {
    id: "writing",
    name: "Writing & editing",
    summary: "Clear writing for sites, offers, newsletters, and other pages people actually read.",
    clients: "Experts who know the subject and want the words to sound like them.",
    offerShape: "A fee per piece, or a monthly retainer for a set number of pieces.",
  },
  {
    id: "marketing",
    name: "Marketing & growth",
    summary: "Positioning, campaigns, and content plans aimed at one specific audience.",
    clients: "Businesses that have an offer and need a practical way to reach buyers.",
    offerShape: "A campaign project, or a monthly retainer with a written scope.",
  },
  {
    id: "photo-video",
    name: "Photo & video",
    summary: "Photography, filming, and editing that shows the work, the place, or the product.",
    clients: "Businesses that need visuals for a launch, a site, or a channel.",
    offerShape: "A session fee plus editing, with usage written into the offer.",
  },
  {
    id: "coaching",
    name: "Coaching & training",
    summary: "One-to-one or group sessions that help a client practice a specific skill.",
    clients: "People who want structured guidance rather than done-for-you work.",
    offerShape: "A package of sessions, or a monthly coaching retainer.",
  },
  {
    id: "consulting",
    name: "Advisory & consulting",
    summary: "A diagnosis and a recommendation a client can act on.",
    clients: "Owners who want an outside view before they spend more time or money.",
    offerShape: "A fixed diagnostic, a day rate, or an ongoing advisory retainer.",
  },
];

export function getCategory(id: CategoryId | null): ServiceCategory | null {
  if (!id) return null;
  return serviceCategories.find((category) => category.id === id) ?? null;
}
