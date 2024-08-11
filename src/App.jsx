import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { youtube_parser } from "./utils/YoutubeParser";
import Header from "./components/Header";
import LoadingAnimation from "./components/LoadingAnimation";
import Button from "./components/Button";
import Input from "./components/Inputfield";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import ResultLink from "./components/ResultLink";
import { getAllMP3s, saveMP3 } from "./utils/IndexedDB";

function App() {
  const inputUrl = useRef();
  const [result, setResult] = useState(null);
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mp3List, setMp3List] = useState({});

  useEffect(() => {
    const fetchStoredMP3s = async () => {
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

    fetchStoredMP3s();
  }, []);

  const handleSubmit = async (e) => {
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
          setTimeout(async () => {
            setLoading(false);
            const mp3Data = {
              title: response.data.title,
              url: response.data.link,
            };
            setResult(mp3Data.url);
            setTitle(mp3Data.title);
            setMp3List((prevList) => ({
              ...prevList,
              [mp3Data.url]: mp3Data,
            }));
            await saveMP3(mp3Data);
            resolve();
          }, 300);
        } catch (error) {
          setLoading(false);
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

  return (
    <div className="h-screen flex justify-center items-center bg-white dark:bg-[#1E1E1E] transition-all duration-300">
      <div className="max-w-[500px] w-full text-center">
        <Header />
        <h1 className="text-2xl sm:text-4xl font-bold text-[#333] dark:text-white mb-4 transition-colors duration-300">
          YouTube to MP3 Converter
        </h1>
        <h2 className="text-sm sm:text-lg text-[#666] dark:text-[#ccc] mb-6 transition-colors duration-300">
          Transform YouTube videos into MP3s in just a few clicks!
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3">
          <Input
            ref={inputUrl}
            placeholder="Paste a Youtube video URL link..."
            className="text-[#333] dark:text-white dark:bg-[#333] dark:border-[#444]"
          />
          {loading ? (
            <LoadingAnimation />
          ) : (
            <Button
              ariaLabel="Convert"
              children={null}
              type="submit"
              className="bg-[#4CAF50] text-white hover:bg-[#388E3C]">
              Convert
            </Button>
          )}
        </form>
        <div className="mt-4">
          {result && <ResultLink href={result} title={title} />}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        draggable="mouse"
        draggableDirection="x"
      />
      <Dashboard
        mp3List={mp3List}
        setMp3List={setMp3List}
        toast={toast}
        toastContainer={ToastContainer}
      />
    </div>
  );
}

export default App;
