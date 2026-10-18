"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { formatSavedAt } from "@/lib/studio/format";
import { ResetDialog } from "./reset-dialog";
import { StudioNav } from "./studio-nav";
import { useStudio } from "./studio-provider";

function saveLabel(hydrated: boolean, saveState: "idle" | "saved" | "error", updatedAt: string | null) {
  if (!hydrated) return "Loading your draft";
  if (saveState === "error") return "Changes are not saved";
  if (updatedAt) return `Saved ${formatSavedAt(updatedAt)}`;
  return "Nothing saved in this browser yet";
}

export function StudioFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { draft, hydrated, saveState, notice, requestReset } = useStudio();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const status = saveLabel(hydrated, saveState, draft.updatedAt);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      const link = drawerRef.current?.querySelector("a");
      if (link instanceof HTMLAnchorElement) link.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        menuButtonRef.current?.focus();
        setOpenPath(null);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function openMenu() {
    setOpenPath(pathname);
  }

  function closeMenu(restoreFocus = false) {
    if (restoreFocus) menuButtonRef.current?.focus();
    setOpenPath(null);
  }

  return (
    <div className="min-h-dvh bg-paper text-ink lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      <aside className="studio-sidebar no-print sticky top-0 hidden h-dvh flex-col border-r border-sidebar-line bg-sidebar px-4 py-5 lg:flex">
        <Link href="/studio" className="rounded-xl px-2 py-1">
          <Wordmark tone="light" />
        </Link>
        <div className="mt-8">
          <StudioNav />
        </div>
        <div className="mt-auto space-y-3 border-t border-sidebar-line pt-4">
          <p className="px-2 text-xs leading-5 text-sidebar-muted" role="status">
            {status}
          </p>
          <Button variant="sidebar" size="sm" className="w-full" onClick={requestReset}>
            Clear draft
          </Button>
          <Link href="/" className="block rounded-xl px-3 py-2 text-sm text-sidebar-muted hover:text-surface">
            Marketing site
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-paper px-4 lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-10 items-center rounded-xl px-2 text-sm font-medium"
            aria-expanded={menuOpen}
            aria-controls="studio-menu"
            onClick={openMenu}
          >
            Menu
          </button>
          <Link href="/studio" className="min-w-0">
            <Wordmark />
          </Link>
          <span className="sr-only" role="status">
            {status}
          </span>
        </header>

        <main id="content" className="studio-main px-4 py-6 sm:px-6 lg:px-10 lg:py-10" aria-busy={!hydrated}>
          {hydrated ? (
            children
          ) : (
            <div className="mx-auto max-w-5xl">
              <p className="sr-only">Loading your saved draft.</p>
              <div className="animate-pulse space-y-4 motion-reduce:animate-none" aria-hidden="true">
                <div className="h-3 w-24 rounded-full bg-paper-deep" />
                <div className="h-12 w-2/3 rounded-2xl bg-paper-deep" />
                <div className="h-36 rounded-3xl bg-paper-deep" />
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="h-28 rounded-3xl bg-paper-deep" />
                  <div className="h-28 rounded-3xl bg-paper-deep" />
                  <div className="h-28 rounded-3xl bg-paper-deep" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {menuOpen ? (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#1c1915]/40"
            aria-label="Close menu"
            onClick={() => closeMenu(true)}
          />
          <div
            id="studio-menu"
            ref={drawerRef}
            className="studio-sidebar absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-sidebar px-4 py-5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <Wordmark tone="light" />
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-sm text-surface"
                onClick={() => closeMenu(true)}
              >
                Close
              </button>
            </div>
            <div className="mt-8">
              <StudioNav onNavigate={() => closeMenu()} />
            </div>
            <div className="mt-auto space-y-3 border-t border-sidebar-line pt-4">
              <p className="px-2 text-xs leading-5 text-sidebar-muted">{status}</p>
              <Button
                variant="sidebar"
                size="sm"
                className="w-full"
                onClick={() => {
                  closeMenu();
                  requestReset();
                }}
              >
                Clear draft
              </Button>
              <Link
                href="/"
                className="block rounded-xl px-3 py-2 text-sm text-sidebar-muted"
                onClick={() => closeMenu()}
              >
                Marketing site
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <ResetDialog />

      {notice ? (
        <p
          role="status"
          className="no-print fixed bottom-4 left-1/2 z-50 max-w-[min(100%-2rem,28rem)] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center text-sm text-surface shadow-lg"
        >
          {notice}
        </p>
      ) : null}
    </div>
  );
}
