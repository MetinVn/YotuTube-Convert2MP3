import { openDB } from "idb";

const dbPromise = openDB("AppDatabase", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("mp3s")) {
      db.createObjectStore("mp3s", { keyPath: "url" });
    }
    if (!db.objectStoreNames.contains("theme")) {
      db.createObjectStore("theme", { keyPath: "id" });
    }
  },
});

export const saveMP3 = async (mp3List) => {
  const db = await dbPromise;
  await db.put("mp3s", mp3List);
};

export const getAllMP3s = async () => {
  const db = await dbPromise;
  return await db.getAll("mp3s");
};

export const clearMP3Store = async () => {
  const db = await dbPromise;
  return db.clear("mp3s");
};

export const saveTheme = async (theme) => {
  const db = await dbPromise;
  await db.put("theme", { id: "user-theme", value: theme });
};

export const getTheme = async () => {
  const db = await dbPromise;
  const theme = await db.get("theme", "user-theme");
  return theme ? theme.value : null;
};
