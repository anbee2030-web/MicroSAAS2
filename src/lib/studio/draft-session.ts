import { createEmptyDocument, parseStudioDocument } from "./document";
import { STORAGE_UNAVAILABLE } from "./repository";
import type { StudioDocument } from "./types";

/**
 * The draft the editor is working on, kept apart from localStorage.
 * A failed write leaves `draft` in place so preview, copy, and export
 * can keep using it. Storage is applied on top only when there are no
 * unsaved edits.
 */
export interface DraftMemory {
  draft: StudioDocument;
  dirty: boolean;
  saveError: boolean;
  loaded: boolean;
  /** Last storage snapshot accepted, or null when storage could not be read. */
  baseline: string | null;
}

export function createDraftMemory(): DraftMemory {
  return {
    draft: createEmptyDocument(),
    dirty: false,
    saveError: false,
    loaded: false,
    baseline: null,
  };
}

export function draftFromSnapshot(raw: string): StudioDocument {
  if (!raw) return createEmptyDocument();
  try {
    return parseStudioDocument(JSON.parse(raw));
  } catch {
    return createEmptyDocument();
  }
}

/**
 * Adopt a storage snapshot. Does not write. An unloaded session takes
 * the stored draft instead of keeping the empty placeholder. A dirty
 * session keeps its in-memory edits.
 */
export function acceptStorageSnapshot(memory: DraftMemory, snapshot: string): DraftMemory {
  if (snapshot === STORAGE_UNAVAILABLE) {
    if (!memory.loaded) {
      return {
        draft: createEmptyDocument(),
        dirty: false,
        saveError: true,
        loaded: true,
        baseline: null,
      };
    }
    return memory;
  }

  if (!memory.loaded) {
    return {
      draft: draftFromSnapshot(snapshot),
      dirty: false,
      saveError: false,
      loaded: true,
      baseline: snapshot,
    };
  }

  if (memory.dirty) return memory;
  if (snapshot === memory.baseline) return memory;

  return {
    draft: draftFromSnapshot(snapshot),
    dirty: false,
    saveError: false,
    loaded: true,
    baseline: snapshot,
  };
}

export function storageConflicts(memory: DraftMemory, snapshot: string): boolean {
  return (
    memory.loaded &&
    memory.dirty &&
    snapshot !== STORAGE_UNAVAILABLE &&
    snapshot !== memory.baseline
  );
}

/**
 * Record an edit and the result of trying to store it.
 * Refuses to run before the stored draft has been loaded, so an empty
 * placeholder cannot replace a saved draft.
 */
export function persistDraft(
  memory: DraftMemory,
  next: StudioDocument,
  write: (draft: StudioDocument) => boolean,
): { memory: DraftMemory; persisted: boolean } {
  if (!memory.loaded) return { memory, persisted: false };

  let persisted = false;
  try {
    persisted = write(next);
  } catch {
    persisted = false;
  }

  if (!persisted) {
    return {
      memory: { ...memory, draft: next, dirty: true, saveError: true },
      persisted: false,
    };
  }

  return {
    memory: {
      draft: next,
      dirty: false,
      saveError: false,
      loaded: true,
      baseline: JSON.stringify(next),
    },
    persisted: true,
  };
}

export function resetDraftMemory(memory: DraftMemory, cleared: boolean): DraftMemory {
  if (!memory.loaded) return memory;
  if (!cleared) return { ...memory, saveError: true };
  return {
    draft: createEmptyDocument(),
    dirty: false,
    saveError: false,
    loaded: true,
    baseline: "",
  };
}
