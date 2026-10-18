import { createEmptyDocument, parseStudioDocument } from "./document";
import type { StudioDocument } from "./types";

/**
 * Persistence boundary for the studio draft.
 * The MVP writes to localStorage. A later account-backed repository
 * can replace these functions without changing the editor UI.
 */
export const STUDIO_STORAGE_KEY = "microsaas2.service-launch-studio";

/** Snapshot value when localStorage cannot be read. Distinct from an empty draft. */
export const STORAGE_UNAVAILABLE = "\u0000unavailable";

export function loadStudioDocument(): StudioDocument {
  try {
    const raw = window.localStorage.getItem(STUDIO_STORAGE_KEY);
    if (!raw) return createEmptyDocument();
    return parseStudioDocument(JSON.parse(raw));
  } catch {
    return createEmptyDocument();
  }
}

export function saveStudioDocument(draft: StudioDocument): { ok: true } | { ok: false } {
  try {
    window.localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(draft));
    emitStudio();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function clearStudioDocument(): { ok: true } | { ok: false } {
  try {
    window.localStorage.removeItem(STUDIO_STORAGE_KEY);
    emitStudio();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

type StudioListener = () => void;

const studioListeners = new Set<StudioListener>();

function emitStudio() {
  studioListeners.forEach((listener) => listener());
}

export function subscribeStudio(listener: StudioListener) {
  studioListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STUDIO_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    studioListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getStudioSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STUDIO_STORAGE_KEY) ?? "";
  } catch {
    return STORAGE_UNAVAILABLE;
  }
}

export function getServerStudioSnapshot(): string | null {
  return null;
}
