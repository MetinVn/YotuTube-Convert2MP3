import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import { youtube_parser } from "./utils";

function App() {
  function setDarkMode() {
    document.documentElement.classList = "dark";
  }
  function setLightMode() {
    document.documentElement.classList = "light";
  }
  const inputUrl = useRef();
  const [result, setResult] = useState(null);
  const [title, setTitle] = useState(null);
  const [error, setError] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const youtubeID = youtube_parser(inputUrl.current.value);

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
    if (inputUrl.current.value === "") {
      setError(true);
    } else {
      axios(options)
        .then((res) => {
          setResult(res.data.link), setTitle(res.data.title), setError(false);
        })
        .catch((err) => console.warn(err));
      inputUrl.current.value = "";
    }
  };

  return (
    <>
      <div className="h-screen text-white font-[Kanit] flex justify-center bg-emerald-400 dark:bg-black duration-300">
        <div className="max-w-[1350px] text-center w-full m-auto">
          <div className="flex gap-10 justify-center">
            <button
              onClick={setLightMode}
              className="px-2 rounded-sm dark:text-emerald-400 dark:hover:bg-emerald-600 duration-300"
            >
              Light Mode
            </button>
            <button
              onClick={setDarkMode}
              className="px-2 rounded-sm hover:bg-black hover:text-white dark:text-emerald-400 duration-300"
            >
              Dark Mode
            </button>
          </div>
          <h1 className="sm:text-5xl text-sm m-3 dark:text-emerald-400 duration-300">
            YouTube to MP3 Converter
          </h1>
          <h2 className="sm:text-lg text-sm m-3 dark:text-emerald-400 duration-300">
            Transform YouTube videos into MP3s in just a few clicks!
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 items-center"
          >
            <input
              className="text-black outline-none rounded-sm pl-2 m-auto w-full max-w-[350px] sm:p-1"
              type="text"
              ref={inputUrl}
              placeholder="Paste a Youtube video URL link..."
            />
            <button
              type="submit"
              className="border-[1px] p-1 w-[120px] mb-3 rounded-sm hover:opacity-80 dark:bg-emerald-400 duration-300"
            >
              Convert
            </button>
          </form>
          <div className="flex flex-col items-center">
            <span
              className={
                !error
                  ? "hidden"
                  : "border-2 border-red-500 text-red-400 dark:border-red-600 dark:text-red-400 px-4 py-1 rounded-sm w-full max-w-[390px]"
              }
            >
              You have problem with your eyes?
            </span>
            {result ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={result}
                className="underline"
              >
                Download {title}
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
