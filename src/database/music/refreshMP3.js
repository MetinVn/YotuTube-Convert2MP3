import { firestore } from "../../firebase"; // Firestore import
import { doc, updateDoc } from "firebase/firestore";
import { auth } from "../../firebase";

export async function refreshMP3(youtubeID, updatedFields) {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not logged in.");
    }

    const userId = user.uid; // Get user's UID

    // Reference to the specific MP3 document in the user's 'mp3s' collection
    const mp3Ref = doc(firestore, `users/${userId}/mp3s`, youtubeID);

    // Update the document with the new fields (only the keys in updatedFields will be changed)
    await updateDoc(mp3Ref, updatedFields);
    console.log(`MP3 with ID ${youtubeID} updated successfully!`);
  } catch (error) {
    console.error("Failed to update MP3:", error.message);
  }
}
