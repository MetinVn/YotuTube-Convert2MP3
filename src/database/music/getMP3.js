import { openDB } from "idb";

export async function getMP3(youtubeID) {
  try {
    const db = await openDB("MP3Database", 1);
    const tx = db.transaction("mp3s", "readonly");
    const store = tx.objectStore("mp3s");
    const mp3 = await store.get(youtubeID);
    await tx.done;
    return mp3 || false;
  } catch (error) {
    console.error("Failed to get MP3:", error.message);
    return false;
  }
}
