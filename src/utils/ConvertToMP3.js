import axios from "axios";
import { youtube_parser } from "./YoutubeParser";
import "react-toastify/dist/ReactToastify.css";
import { saveMP3 } from "../database/music/saveMP3";

export const fetchMP3Data = async (e, mp3inputUrl, setMP3List, toast) => {
  e.preventDefault();

  const youtubeURLToUse = mp3inputUrl.current?.value.trim();
  const youtubeIDToUse = youtube_parser(youtubeURLToUse);

  if (!youtubeURLToUse) {
    toast.error("The URL field can't be empty.");
    return;
  }

  if (!youtubeIDToUse) {
    toast.error("Invalid YouTube URL. Please provide a valid video URL.");
    return;
  }

  try {
    const options = {
      method: "get",
      url: "https://youtube-mp36.p.rapidapi.com/dl",
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,

        "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
      },
      params: { id: youtubeIDToUse },
    };

    const response = await axios(options);
    const { title, link, filesize } = response?.data;

    if (!link) {
      toast.error("No link provided. Try lyrical songs or wait and retry.");
      return;
    }

    const mp3Data = {
      title,
      url: link,
      fileSize: filesize,
      youtubeID: youtubeIDToUse,
      youtubeURL: youtubeURLToUse,
    };

    toast.success("MP3 succesfully converted");
    setMP3List((prevList) => ({ ...prevList, [mp3Data.youtubeID]: mp3Data }));
    saveMP3(mp3Data);
    return mp3Data;
  } catch (error) {
    toast.error(error.message || "Error occurred during conversion. Please try again.");
  } finally {
    if (mp3inputUrl.current) {
      mp3inputUrl.current.value = "";
    }
  }
};
