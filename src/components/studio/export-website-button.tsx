"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { renderStorefrontWebsite } from "@/lib/studio/website-export";
import { useStudio } from "./studio-provider";

export function ExportWebsiteButton() {
  const { draft } = useStudio();
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  function onExport() {
    try {
      const website = renderStorefrontWebsite(draft);
      if (!website.html.startsWith("<!DOCTYPE html>")) {
        throw new Error("The generator did not return a complete HTML document.");
      }
      downloadWebsite(website.html, website.filename);
      setStatus({
        tone: "ok",
        text: `${website.filename} was saved to this device. That file is not published online until you host it yourself.`,
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown error while creating the file.";
      setStatus({
        tone: "error",
        text: `The website file could not be created. ${detail}`,
      });
    }
  }

  return (
    <>
      <Button onClick={onExport}>Export Website</Button>
      {status ? (
        <p role="status" className={status.tone === "error" ? "basis-full text-sm leading-6 text-danger" : "basis-full text-sm leading-6 text-ink"}>
          {status.text}
        </p>
      ) : null}
    </>
  );
}

function downloadWebsite(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
