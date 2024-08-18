import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchStoredMP3s } from "./utils/FetchStoredMP3";
import { fetchMP3Data } from "./utils/HandleSubmitMP3";
import { fetchMP4Data } from "./utils/HandleSubmitMP4";
import { fetchStoredMP4s } from "./utils/FetchStoredMP4";

import Header from "./components/Header";
import LoadingAnimation from "./components/LoadingAnimation";
import Button from "./components/Button";
import Input from "./components/Inputfield";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Select from "./components/SelectElement";

function App() {
  const inputUrl = useRef();
  const [loading, setLoading] = useState(false);
  const [convertType, setConvertType] = useState("mp3");

  //Mp3 variables
  const [list, setMp3List] = useState({});
  //Mp4 variables
  const [mp4List, setMP4List] = useState({});

  const options = [
    { value: "mp3", label: "MP3" },
    { value: "mp4", label: "MP4" },
  ];

  const handleSelectChange = (e) => {
    setConvertType(e.target.value);
  };

  useEffect(() => {
    fetchStoredMP3s(setMp3List, toast);
    fetchStoredMP4s(setMP4List, toast);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#1E1E1E] transition-all duration-300">
      <div className="flex flex-col justify-center items-center flex-grow my-20 md:my-0">
        <div className="max-w-[500px] w-full text-center">
          <Header />
          <h1 className="text-2xl sm:text-4xl font-bold text-[#333] dark:text-white mb-4 transition-colors duration-300">
            YouTube to MP3 Converter
          </h1>
          <h2 className="text-sm sm:text-lg text-[#666] dark:text-[#ccc] mb-6 transition-colors duration-300">
            Transform YouTube videos into MP3s in just a few clicks!
          </h2>
          <div>
            {loading ? (
              <LoadingAnimation />
            ) : (
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
                <Input
                  ref={inputUrl}
                  placeholder="Paste a Youtube video URL link..."
                  className="text-[#333] dark:text-white dark:bg-[#333] dark:border-[#444]"
                />
                {convertType === "mp3" && (
                  <Button
                    onClick={(e) =>
                      fetchMP3Data(e, setLoading, setMp3List, inputUrl, toast)
                    }
                    ariaLabel="Convert"
                    className="bg-[#4CAF50] text-white hover:bg-[#388E3C]">
                    Convert
                  </Button>
                )}
                {convertType === "mp4" && (
                  <Button
                    onClick={(e) =>
                      fetchMP4Data(e, setLoading, setMP4List, inputUrl, toast)
                    }
                    ariaLabel="Convert"
                    className="bg-[#4CAF50] text-white hover:bg-[#388E3C]">
                    Convert
                  </Button>
                )}
                <Select
                  value={convertType}
                  onChange={handleSelectChange}
                  options={options}
                  className="w-40"
                />
              </div>
            )}
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          draggable="touch"
          draggableDirection="y"
        />
        <Dashboard
          mp4List={mp4List}
          mp3List={list}
          setMp3List={setMp3List}
          setMP4List={setMP4List}
          toast={toast}
          toastContainer={ToastContainer}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
