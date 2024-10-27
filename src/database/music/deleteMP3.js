import { firestore } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteMP3(user, item, toast) {
  try {
    if (!user || !user.uid) {
      throw new Error("User is not logged in.");
    }

    const userId = user.uid;
    const mp3DocRef = doc(firestore, `users/${userId}/mp3s`, item.youtubeID);

    await deleteDoc(mp3DocRef);
    toast.success(`MP3 named ${item.title} deleted successfully!`);
    return true;
  } catch (error) {
    console.error("Failed to delete MP3:", error.message);
    toast.error("Failed to delete MP3:", error.message);
    return false;
  }
}
