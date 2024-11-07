import { firestore } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase";

export async function saveMP3(mp3) {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not logged in.");
    }

    const userId = user.uid;
    const mp3Ref = doc(firestore, `users/${userId}/mp3s`, mp3.youtubeID);
    await setDoc(mp3Ref, mp3);
  } catch (error) {
    console.error("Failed to save MP3:", error.message);
  }
}
