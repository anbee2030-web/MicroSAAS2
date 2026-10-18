import type { Metadata } from "next";
import { OfferWorkspace } from "@/components/studio/offer-workspace";

export const metadata: Metadata = {
  title: "Offer",
};

export default function OfferPage() {
  return <OfferWorkspace />;
}
