"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { copyText, createOfferSummary } from "@/lib/studio/format";
import { getProgress } from "@/lib/studio/progress";
import { useStudio } from "./studio-provider";

export function CopySummaryButton({ size = "md" }: { size?: "md" | "sm" }) {
  const { draft } = useStudio();
  const progress = getProgress(draft);
  const [label, setLabel] = useState("Copy summary");

  async function onCopy() {
    const ok = await copyText(createOfferSummary(draft.offer, progress.category?.name ?? null));
    setLabel(ok ? "Copied" : "Could not copy");
    window.setTimeout(() => setLabel("Copy summary"), 2000);
  }

  return (
    <Button variant="secondary" size={size} onClick={onCopy}>
      {label}
    </Button>
  );
}
