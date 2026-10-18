"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  acceptStorageSnapshot,
  createDraftMemory,
  persistDraft,
  resetDraftMemory,
  storageConflicts,
  type DraftMemory,
} from "@/lib/studio/draft-session";
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

const UNSAVED_NOTICE = "Changes are not saved in this browser.";

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const storageSnapshot = useSyncExternalStore(subscribeStudio, getStudioSnapshot, getServerStudioSnapshot);
  const [memory, setMemory] = useState<DraftMemory>(createDraftMemory);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [announcedConflict, setAnnouncedConflict] = useState<string | null>(null);

  let current = memory;
  if (storageSnapshot !== null) {
    const accepted = acceptStorageSnapshot(memory, storageSnapshot);
    if (accepted !== memory) {
      current = accepted;
      setMemory(accepted);
    }
  }

  const draft = current.draft;
  const hydrated = current.loaded;
  const saveState: SaveState = !current.loaded ? "idle" : current.saveError ? "error" : draft.updatedAt ? "saved" : "idle";
  const conflict = storageSnapshot !== null && storageConflicts(current, storageSnapshot);
  if (!conflict && announcedConflict !== null) {
    setAnnouncedConflict(null);
  } else if (conflict && storageSnapshot !== announcedConflict) {
    setAnnouncedConflict(storageSnapshot);
    setNotice("Another tab updated the saved draft. Your unsaved edits on this tab were kept.");
  }

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const write = useCallback(
    (next: StudioDocument, successNotice?: string) => {
      const hadError = current.saveError;
      const result = persistDraft(current, next, (document) => saveStudioDocument(document).ok);
      setMemory(result.memory);
      if (result.persisted) {
        if (successNotice) setNotice(successNotice);
        else if (hadError) setNotice("Draft saved in this browser.");
        return;
      }
      if (successNotice || !hadError) setNotice(UNSAVED_NOTICE);
    },
    [current],
  );

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
    if (!current.loaded) return;
    const cleared = clearStudioDocument().ok;
    setMemory(resetDraftMemory(current, cleared));
    setResetOpen(false);
    setNotice(cleared ? "Draft removed from this browser." : "This browser blocked clearing the draft.");
  }, [current]);

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
