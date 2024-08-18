import { getAllMP3s } from "./IndexedDB";

export const fetchStoredMP3s = async (setMp3List, toast) => {
  const storedMP3s = await getAllMP3s();
  if (storedMP3s.length > 0) {
    setMp3List(
      storedMP3s.reduce((acc, mp3) => {
        acc[mp3.url] = mp3;
        return acc;
      }, {})
    );
  } else {
    toast.info("No stored MP3s found.");
  }
};
