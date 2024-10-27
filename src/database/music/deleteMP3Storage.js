import { openDB } from "idb";

export async function DeleteMP3() {
  try {
    const db = await openDB("MP3Database", 1);
    const tx = db.transaction("mp3s", "readwrite");
    await tx.objectStore("mp3s").clear();
    await tx.done;
    console.log("MP3 list cleared successfully!");
    return true;
  } catch (error) {
    console.error("Failed to delete MP3 list:", error.message);
    return false;
  }
}
