import { getAllMP4s } from "./IndexedDB";

export const fetchStoredMP4s = async (setMP4List, toast) => {
  const storedMP4s = await getAllMP4s();
  if (storedMP4s.length > 0) {
    setMP4List(
      storedMP4s.reduce((acc, mp4) => {
        acc[mp4.title] = mp4;
        return acc;
      }, {})
    );
  } else {
    toast.info("No stored MP4s found.");
  }
};
