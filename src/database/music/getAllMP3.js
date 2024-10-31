import { firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getAllMP3s = async (user, loadingState) => {
  try {
    if (!loadingState) {
      if (!user || !user.uid) {
        throw new Error("User is not logged in.");
      }
      const userId = user.uid;
      const mp3sCollectionRef = collection(firestore, `users/${userId}/mp3s`);
      const mp3sSnapshot = await getDocs(mp3sCollectionRef);
      return mp3sSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.error("Failed to retrieve MP3s from Firestore:", error.message);
    return [];
  }
};
