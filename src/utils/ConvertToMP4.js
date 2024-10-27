import axios from "axios";
import { saveMP4, getAllMP4s } from "./mp4DB";
import { youtube_parser } from "./YoutubeParser";
import "react-toastify/dist/ReactToastify.css";

const calculateTotalSizeInMB = async (mp4s) => {
  const totalSizeInBytes = mp4s.reduce((total, mp4) => total + mp4.fileSize, 0);
  return totalSizeInBytes / 1048576;
};

const checkStorageLimit = (totalSizeInMB, fileSizeInMB, storageLimit, triggerTheModal, isModalOpened) => {
  if (totalSizeInMB + fileSizeInMB > storageLimit) {
    if (!isModalOpened) {
      triggerTheModal();
    }
    return false;
  }
  return true;
};

export const fetchMP4Data = async (
  e,
  setLoading,
  setMp4List,
  inputUrl,
  toast,
  storageLimit,
  triggerTheModal,
  isModalOpened,
  userID
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
          "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
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
          userID,
          fileSize: response.data.fileSize,
        };

        if (!mp4Data.links) {
          toast.error("The conversion was successful, but no download link was provided. Please try again.");
          setLoading(false);
          reject(new Error("No download link provided"));
          return;
        }

        const existingMp4s = await getAllMP4s();
        const userMp4s = existingMp4s.filter((mp4) => mp4.userID === userID);

        const isDuplicate = userMp4s.some((mp4) => mp4.title === mp4Data.title);

        if (isDuplicate) {
          toast.info("This MP4 already exists in Converted Videos.");
          setLoading(false);
          resolve();
          return;
        }

        const totalSizeInMB = await calculateTotalSizeInMB(userMp4s);
        const fileSizeInMB = mp4Data.fileSize / 1048576;

        const canSave = checkStorageLimit(totalSizeInMB, fileSizeInMB, storageLimit, triggerTheModal, isModalOpened);

        if (canSave) {
          await saveMP4(mp4Data);
          setMp4List((prevList) => ({
            ...prevList,
            [youtubeID]: mp4Data,
          }));
          toast.success("MP4 added to Converted Videos.");
        } else {
          setMp4List((prevList) => ({
            ...prevList,
            [youtubeID]: mp4Data,
          }));
          toast.info("MP4 converted, but storage limit exceeded. It wasn't saved.");
        }

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
