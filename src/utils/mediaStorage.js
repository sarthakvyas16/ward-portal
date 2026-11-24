import { openDB } from "idb";

const DB_NAME = "ward-portal-media";
const STORE_NAME = "media";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

// Media save karna
export async function saveMedia(file) {
  const db = await dbPromise;

  const mediaItem = {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type,
    size: file.size,
    blob: file,
    createdAt: new Date().toISOString(),
  };

  await db.put(STORE_NAME, mediaItem);
  return mediaItem;
}

// Media nikalna
export async function getMedia(id) {
  const db = await dbPromise;
  return db.get(STORE_NAME, id);
}

// Saare media nikalna
export async function getAllMedia() {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
}

// Media delete karna
export async function deleteMedia(id) {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
}

// Multiple files save karna
export async function saveMultipleMedia(files) {
  const results = [];

  for (const file of files) {
    const saved = await saveMedia(file);
    results.push(saved);
  }

  return results;
}