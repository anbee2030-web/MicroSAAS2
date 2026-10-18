import type { Metadata } from "next";
import { StorefrontScreen } from "@/components/studio/storefront-screen";

export const metadata: Metadata = {
  title: "Storefront",
};

export default function PreviewPage() {
  return <StorefrontScreen />;
}
