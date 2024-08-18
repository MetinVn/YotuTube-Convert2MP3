import { openDB } from "idb";

const dbPromise = openDB("AppDatabase", 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("mp3s")) {
      db.createObjectStore("mp3s", { keyPath: "url" });
    }
    if (!db.objectStoreNames.contains("theme")) {
      db.createObjectStore("theme", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("mp4s")) {
      db.createObjectStore("mp4s", { keyPath: "title" });
    }
  },
});

const calculateSize = (data) => {
  const jsonString = JSON.stringify(data);
  return new Blob([jsonString]).size;
};

// Calculate Total Storage Size
const calculateTotalSize = async () => {
  try {
    const db = await dbPromise;

    // Helper function to calculate size for a store
    const calculateStoreSize = async (storeName) => {
      let totalSize = 0;
      const tx = db.transaction(storeName);
      const store = tx.objectStore(storeName);
      const allItems = await store.getAll();
      allItems.forEach((item) => {
        totalSize += calculateSize(item);
      });
      await tx.done;
      return totalSize;
    };

    const mp3Size = await calculateStoreSize("mp3s");
    const mp4Size = await calculateStoreSize("mp4s");
    const themeSize = await calculateStoreSize("theme");

    const totalSize = mp3Size + mp4Size + themeSize;

    console.log(`Total IndexedDB Size: ${totalSize} bytes`);

    // Check against 1GB limit (1,000,000,000 bytes)
    if (totalSize > 1000000000) {
      alert("Your storage has exceeded 1GB. Please manage your data.");
      // Implement additional logic here (e.g., notify user, clean up old data)
    }
  } catch (error) {
    console.error("Error calculating total storage size:", error);
  }
};

// MP3 Functions
export const saveMP3 = async (mp3List) => {
  try {
    const db = await dbPromise;
    await db.put("mp3s", mp3List);
    await calculateTotalSize();
  } catch (error) {
    console.error("Error saving MP3 data:", error);
  }
};

export const deleteMP3 = async (url) => {
  const db = await dbPromise;
  await db.delete("mp3s", url);
  await calculateTotalSize();
};

export const getAllMP3s = async () => {
  const db = await dbPromise;
  return await db.getAll("mp3s");
};

export const clearMP3Store = async () => {
  const db = await dbPromise;
  await db.clear("mp3s");
  await calculateTotalSize();
};

// MP4 Functions
export const saveMP4 = async (mp4Data) => {
  try {
    const db = await dbPromise;
    await db.put("mp4s", mp4Data);
    await calculateTotalSize();
  } catch (error) {
    console.error("Error saving MP4 data:", error);
  }
};

export const deleteMP4 = async (title) => {
  const db = await dbPromise;
  await db.delete("mp4s", title);
  await calculateTotalSize();
};

export const getAllMP4s = async () => {
  try {
    const db = await dbPromise;
    return await db.getAll("mp4s");
  } catch (error) {
    console.error("Error fetching MP4s:", error);
    return [];
  }
};

export const clearMP4Store = async () => {
  const db = await dbPromise;
  await db.clear("mp4s");
  await calculateTotalSize();
};

// Theme Functions
export const saveTheme = async (theme) => {
  const db = await dbPromise;
  await db.put("theme", { id: "user-theme", value: theme });
};

export const getTheme = async () => {
  const db = await dbPromise;
  const theme = await db.get("theme", "user-theme");
  return theme ? theme.value : null;
};
