import axios from "axios";
import { getAllMP3s } from "../database/music/getAllMP3";
import { refreshMP3 } from "../database/music/refreshMP3";

export const refreshMP3Link = async (itemUrl, youtubeID, setMp3List, toast, fileSize, authUser, loadingUser) => {
  try {
    const response = await fetch(itemUrl, {
      method: "GET",
      headers: {
        Range: `bytes=0-${fileSize - 1}`,
      },
    });

    if (response.status === 206 || response.status === 200) {
      toast.info(`Link is fresh and valid`);
      return true;
    }

    toast.info("Executing link refresh.");
    await refreshLink(toast, youtubeID, setMp3List, authUser, loadingUser);
    return false;
  } catch (error) {
    console.error("Error checking the link:", error.message);
    toast.error("Error checking the link.");
    return null;
  }
};

const refreshLink = async (toast, youtubeID, setMp3List, authUser, loadingUser) => {
  const allMP3s = await getAllMP3s(authUser, loadingUser);
  try {
    const options = {
      method: "get",
      url: "https://youtube-mp36.p.rapidapi.com/dl",
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
        "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
      },
      params: { id: youtubeID },
    };

    const response = await axios(options);
    const { link } = response?.data;

    if (!link) {
      toast.error("No download link provided. Please try again later.");
      return;
    }

    const updatedMP3s = allMP3s.map((mp3) => (mp3.youtubeID === youtubeID ? { ...mp3, url: link } : mp3));

    const mp3ToUpdate = updatedMP3s.find((mp3) => mp3.youtubeID === youtubeID);
    if (mp3ToUpdate) {
      await refreshMP3(youtubeID, mp3ToUpdate);
      setMp3List(updatedMP3s);
      toast.success("Link refreshed and replaced successfully!");
      return true;
    }
  } catch (error) {
    toast.error("Failed to refresh the link. Please try again.");
    console.error("Error refreshing the link:", error);
    return false;
  }
};
