import assert from "node:assert/strict";
import test from "node:test";
import {
  acceptStorageSnapshot,
  createDraftMemory,
  persistDraft,
  storageConflicts,
} from "./draft-session";
import { createEmptyDocument } from "./document";
import { renderStorefrontWebsite } from "./website-export";
import type { StudioDocument } from "./types";

function storedDraft(businessName: string): StudioDocument {
  const draft = createEmptyDocument();
  draft.updatedAt = "2026-10-18T12:00:00.000Z";
  draft.offer.businessName = businessName;
  draft.offer.description = "A saved description.";
  return draft;
}

test("loading an existing draft does not overwrite it with an empty draft", () => {
  const stored = storedDraft("Harbor Editing");
  const snapshot = JSON.stringify(stored);
  let writes = 0;

  const blocked = persistDraft(createDraftMemory(), createEmptyDocument(), () => {
    writes += 1;
    return true;
  });
  assert.equal(writes, 0);
  assert.equal(blocked.persisted, false);
  assert.equal(blocked.memory.loaded, false);

  const loaded = acceptStorageSnapshot(createDraftMemory(), snapshot);
  assert.equal(loaded.loaded, true);
  assert.equal(loaded.dirty, false);
  assert.equal(loaded.draft.offer.businessName, "Harbor Editing");
  assert.equal(loaded.draft.offer.description, "A saved description.");
  assert.equal(loaded.baseline, snapshot);
  assert.equal(writes, 0);

  const again = acceptStorageSnapshot(loaded, snapshot);
  assert.equal(again, loaded);
});

test("a failed storage write keeps the draft exportable, and a later save stores it", () => {
  const original = storedDraft("Harbor Editing");
  let storage = JSON.stringify(original);
  const loaded = acceptStorageSnapshot(createDraftMemory(), storage);

  const next: StudioDocument = {
    ...loaded.draft,
    updatedAt: "2026-10-18T15:00:00.000Z",
    offer: {
      ...loaded.draft.offer,
      businessName: "Latest Name",
      tagline: "Still on this page",
    },
  };

  const failed = persistDraft(loaded, next, () => false);
  assert.equal(failed.persisted, false);
  assert.equal(failed.memory.dirty, true);
  assert.equal(failed.memory.saveError, true);
  assert.equal(failed.memory.draft.offer.businessName, "Latest Name");
  assert.equal(storage, JSON.stringify(original));
  assert.match(renderStorefrontWebsite(failed.memory.draft).html, /Latest Name/);
  assert.match(renderStorefrontWebsite(failed.memory.draft).html, /Still on this page/);

  const saved = persistDraft(failed.memory, failed.memory.draft, (draft) => {
    storage = JSON.stringify(draft);
    return true;
  });
  assert.equal(saved.persisted, true);
  assert.equal(saved.memory.dirty, false);
  assert.equal(saved.memory.saveError, false);
  assert.equal(JSON.parse(storage).offer.businessName, "Latest Name");
  assert.equal(JSON.parse(storage).offer.tagline, "Still on this page");
  assert.equal(saved.memory.baseline, storage);
});

test("unsaved edits survive a newer snapshot from another tab", () => {
  const loaded = acceptStorageSnapshot(createDraftMemory(), JSON.stringify(storedDraft("Harbor Editing")));
  const edited = persistDraft(
    loaded,
    {
      ...loaded.draft,
      offer: { ...loaded.draft.offer, businessName: "Kept locally" },
    },
    () => false,
  ).memory;

  const otherTab = JSON.stringify(storedDraft("Other tab"));
  assert.equal(storageConflicts(edited, otherTab), true);
  const kept = acceptStorageSnapshot(edited, otherTab);
  assert.equal(kept, edited);
  assert.equal(kept.draft.offer.businessName, "Kept locally");

  const clean = persistDraft(loaded, loaded.draft, () => true).memory;
  const adopted = acceptStorageSnapshot(clean, otherTab);
  assert.equal(adopted.draft.offer.businessName, "Other tab");
  assert.equal(adopted.baseline, otherTab);
});
