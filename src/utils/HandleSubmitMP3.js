import axios from "axios";
import { saveMP3 } from "./IndexedDB";
import { youtube_parser } from "./YoutubeParser";

export const fetchMP3Data = async (
  e,
  setLoading,
  setMp3List,
  mp3inputUrl,
  toast
) => {
  e.preventDefault();
  setLoading(true);

  const youtubeURL = mp3inputUrl.current.value;
  const youtubeID = youtube_parser(youtubeURL);

  if (youtubeURL.trim() === "") {
    setLoading(false);
    toast.error("The URL field can't be empty.");
    return;
  }

  if (!youtubeID) {
    setLoading(false);
    toast.error("Invalid YouTube URL. Please provide a valid video URL.");
    return;
  }

  toast.promise(
    new Promise(async (resolve, reject) => {
      const options = {
        method: "get",
        url: "https://youtube-mp36.p.rapidapi.com/dl",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
        params: {
          id: youtubeID,
        },
      };

      try {
        const response = await axios(options);
        const mp3Data = {
          title: response.data.title,
          url: response.data.link,
          fileSize: response.data.filesize,
        };

        if (!mp3Data.url) {
          toast.error(
            "The conversion was successful, but no download link was provided. Please try again."
          );
          setLoading(false);
          reject(new Error("No download link provided"));
          return;
        }

        setMp3List((prevList) => ({
          ...prevList,
          [mp3Data.url]: mp3Data,
        }));

        await saveMP3(mp3Data);
        setLoading(false);
        resolve();
      } catch (error) {
        setLoading(false);
        toast.error("Error occurred during conversion. Please try again.");
        reject(error);
        console.warn(error);
      }
    }),
    {
      pending: "Sending request...",
      success: "Conversion successful!",
      error: "Error occurred during conversion. Please try again.",
    }
  );

  mp3inputUrl.current.value = "";
};
