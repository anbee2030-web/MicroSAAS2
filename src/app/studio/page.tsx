import type { Metadata } from "next";
import { StudioOverview } from "@/components/studio/studio-overview";

export const metadata: Metadata = {
  title: "Studio",
};

export default function StudioPage() {
  return <StudioOverview />;
}
