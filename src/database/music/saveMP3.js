import { firestore } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase";

export async function saveMP3(mp3) {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not logged in.");
    }

    const userId = user.uid; // Get user's UID
    // Create a document reference in Firestore for this user's MP3
    const mp3Ref = doc(firestore, `users/${userId}/mp3s`, mp3.youtubeID);
    // Save MP3 data under the user's 'mp3s' collection
    await setDoc(mp3Ref, mp3);
    console.log("MP3 saved successfully for user:", userId);
  } catch (error) {
    console.error("Failed to save MP3:", error.message);
  }
}
