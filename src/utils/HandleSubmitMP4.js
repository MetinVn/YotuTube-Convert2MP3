import axios from "axios";
import { saveMP4 } from "./IndexedDB";
import { youtube_parser } from "./YoutubeParser";

export const fetchMP4Data = async (
  e,
  setLoading,
  setMp4List,
  inputUrl,
  toast
) => {
  e.preventDefault();
  setLoading(true);

  const youtubeURL = inputUrl.current.value;
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
        method: "GET",
        url: "https://youtube-video-download-info.p.rapidapi.com/dl",
        params: { id: youtubeID },
        headers: {
          "x-rapidapi-key":
            "bb6ca9e02bmsh37ace359628eb67p1cfcfcjsn8051f8356a0f",
          "x-rapidapi-host": "youtube-video-download-info.p.rapidapi.com",
        },
      };

      try {
        const response = await axios(options);
        const mp4Data = {
          title: response.data.title,
          thumbnail: response.data.thumb,
          links: {
            "144p": response.data.link[17][0],
            "360p": response.data.link[18][0],
            "720p": response.data.link[22][0],
          },
        };

        if (!mp4Data.links) {
          toast.error(
            "The conversion was successful, but no download link was provided. Please try again."
          );
          setLoading(false);
          reject(new Error("No download link provided"));
          return;
        }

        setMp4List((prevList) => ({
          ...prevList,
          [youtubeID]: mp4Data,
        }));
        await saveMP4(mp4Data);

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

  inputUrl.current.value = "";
};
