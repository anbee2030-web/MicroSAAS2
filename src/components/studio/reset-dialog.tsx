"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useStudio } from "./studio-provider";

export function ResetDialog() {
  const { resetOpen, closeReset, resetDraft } = useStudio();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!resetOpen) return;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [resetOpen]);

  if (!resetOpen) return null;

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeReset();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])");
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#1c1915]/40" aria-label="Close dialog" onClick={closeReset} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        aria-describedby="reset-body"
        className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl"
        onKeyDown={onKeyDown}
      >
        <h2 id="reset-title" className="font-display text-3xl tracking-tight text-ink">
          Clear the saved draft?
        </h2>
        <p id="reset-body" className="mt-3 text-sm leading-6 text-ink-soft">
          This removes the service, offer, and storefront stored in this browser. It does not affect any other device.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button ref={cancelRef} variant="secondary" onClick={closeReset}>
            Keep draft
          </Button>
          <Button variant="dangerSolid" onClick={resetDraft}>
            Clear draft
          </Button>
        </div>
      </div>
    </div>
  );
}
