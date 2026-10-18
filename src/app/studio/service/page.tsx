import type { Metadata } from "next";
import { CategoryPicker } from "@/components/studio/category-picker";

export const metadata: Metadata = {
  title: "Service",
};

export default function ServicePage() {
  return <CategoryPicker />;
}
