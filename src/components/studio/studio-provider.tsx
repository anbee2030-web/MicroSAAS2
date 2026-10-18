"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createEmptyDocument, parseStudioDocument } from "@/lib/studio/document";
import { hasSavedDraft } from "@/lib/studio/progress";
import {
  clearStudioDocument,
  getServerStudioSnapshot,
  getStudioSnapshot,
  saveStudioDocument,
  subscribeStudio,
} from "@/lib/studio/repository";
import type { CategoryId, OfferPatch, StudioDocument } from "@/lib/studio/types";

type SaveState = "idle" | "saved" | "error";

interface StudioContextValue {
  draft: StudioDocument;
  hydrated: boolean;
  saveState: SaveState;
  notice: string | null;
  resetOpen: boolean;
  selectCategory: (categoryId: CategoryId) => void;
  updateOffer: (patch: OfferPatch) => void;
  addIncluded: (id: string) => void;
  updateIncluded: (id: string, text: string) => void;
  removeIncluded: (id: string) => void;
  saveNow: () => void;
  resetDraft: () => void;
  requestReset: () => void;
  closeReset: () => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

function draftFromSnapshot(raw: string | null): StudioDocument {
  if (!raw) return createEmptyDocument();
  try {
    return parseStudioDocument(JSON.parse(raw));
  } catch {
    return createEmptyDocument();
  }
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribeStudio, getStudioSnapshot, getServerStudioSnapshot);
  const draft = useMemo(() => draftFromSnapshot(raw), [raw]);
  const hydrated = raw !== null;
  const [saveError, setSaveError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const saveState: SaveState = saveError ? "error" : draft.updatedAt ? "saved" : "idle";

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const write = useCallback((next: StudioDocument, successNotice?: string) => {
    const ok = saveStudioDocument(next).ok;
    setSaveError(!ok);
    if (successNotice || !ok) {
      setNotice(ok ? successNotice ?? null : "This browser blocked saving the draft.");
    }
    return ok;
  }, []);

  const selectCategory = useCallback(
    (categoryId: CategoryId) => {
      write({
        ...draft,
        updatedAt: new Date().toISOString(),
        offer: { ...draft.offer, categoryId },
      });
    },
    [draft, write],
  );

  const updateOffer = useCallback(
    (patch: OfferPatch) => {
      write({
        ...draft,
        updatedAt: new Date().toISOString(),
        offer: {
          ...draft.offer,
          ...patch,
          contact: { ...draft.offer.contact, ...patch.contact },
        },
      });
    },
    [draft, write],
  );

  const addIncluded = useCallback(
    (id: string) => {
      write({
        ...draft,
        updatedAt: new Date().toISOString(),
        offer: {
          ...draft.offer,
          included: [...draft.offer.included, { id, text: "" }],
        },
      });
    },
    [draft, write],
  );

  const updateIncluded = useCallback(
    (id: string, text: string) => {
      write({
        ...draft,
        updatedAt: new Date().toISOString(),
        offer: {
          ...draft.offer,
          included: draft.offer.included.map((item) => (item.id === id ? { ...item, text } : item)),
        },
      });
    },
    [draft, write],
  );

  const removeIncluded = useCallback(
    (id: string) => {
      const included = draft.offer.included.filter((item) => item.id !== id);
      write({
        ...draft,
        updatedAt: new Date().toISOString(),
        offer: {
          ...draft.offer,
          included: included.length > 0 ? included : [{ id: "included-1", text: "" }],
        },
      });
    },
    [draft, write],
  );

  const saveNow = useCallback(() => {
    write({ ...draft, updatedAt: new Date().toISOString() }, "Draft saved in this browser.");
  }, [draft, write]);

  const resetDraft = useCallback(() => {
    const ok = clearStudioDocument().ok;
    setResetOpen(false);
    setSaveError(!ok);
    setNotice(ok ? "Draft removed from this browser." : "This browser blocked clearing the draft.");
  }, []);

  const requestReset = useCallback(() => {
    if (!hasSavedDraft(draft)) {
      setNotice("There is no draft to clear yet.");
      return;
    }
    setResetOpen(true);
  }, [draft]);

  const closeReset = useCallback(() => setResetOpen(false), []);

  const value = useMemo<StudioContextValue>(
    () => ({
      draft,
      hydrated,
      saveState,
      notice,
      resetOpen,
      selectCategory,
      updateOffer,
      addIncluded,
      updateIncluded,
      removeIncluded,
      saveNow,
      resetDraft,
      requestReset,
      closeReset,
    }),
    [
      draft,
      hydrated,
      saveState,
      notice,
      resetOpen,
      selectCategory,
      updateOffer,
      addIncluded,
      updateIncluded,
      removeIncluded,
      saveNow,
      resetDraft,
      requestReset,
      closeReset,
    ],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) {
    throw new Error("useStudio must be used inside StudioProvider");
  }
  return value;
}
