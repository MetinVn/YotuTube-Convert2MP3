import { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";

import { fetchMP3Data } from "./utils/ConvertToMP3";

import LoadingAnimation from "./components/LoadingAnimation";
import Button from "./components/Button";
import Input from "./components/Inputfield";
import Footer from "./components/Footer";
import CustomSelect from "./components/ReactSelect";
import { MP3Context } from "./contexts/MP3Context";
import ResultLink from "./components/ResultLink";
import Modal from "./components/Modal";

function App() {
  const [modal, setModal] = useState(false);
  const inputUrl = useRef(null);
  const [loading, setLoading] = useState(false);
  const [convertType, setConvertType] = useState("mp3");
  const { setMP3List } = useContext(MP3Context);
  const options = [{ value: "mp3", label: "MP3" }];
  const [lastConvertedMP3, setLastConvertedMP3] = useState(null);

  const handleModal = () => {
    setModal(false);
  };

  const handleSelectChange = (e) => {
    setConvertType(e);
  };

  const handleConversion = async (e) => {
    setLoading(true);
    try {
      const displayItem = await fetchMP3Data(e, inputUrl, setMP3List, toast);
      if (displayItem) {
        setLastConvertedMP3(displayItem);
      }
    } catch (error) {
      console.error("Error during conversion:", error);
      toast.error("An error occurred during conversion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {modal && (
        <Modal
          isOpen={modal}
          onClose={handleModal}
          description="For Registered Users"
          paragraph="Enhance your experience by signing up! Once logged in, you'll easily access your converted MP3 list. You’ll have the ability to save your converted songs and listen to them with the integrated MP3 player. Log in to take advantage of our helpful features and make your music conversion process even smoother!"
        />
      )}

      <ToastContainer position="bottom-right" transition={Slide} stacked limit={8} />
      <div className="min-h-screen flex flex-col justify-between bg-[#1E1E1E] transition-all duration-300">
        <div className="flex flex-col justify-center items-center flex-grow my-20 md:mt-40">
          <h1 className="text-2xl text-center sm:text-4xl font-semibold text-white mb-4">YouTube Converter</h1>
          <div className="max-w-[500px] w-full text-center">
            <div>
              {loading ? (
                <LoadingAnimation />
              ) : (
                <div className="flex flex-col mx-1 items-center justify-center gap-2">
                  <div className="w-full flex items-center gap-1 sm:gap-2">
                    <Input
                      type="search"
                      ref={inputUrl}
                      placeholder="Paste a YouTube video URL link..."
                      className="sm:mx-0 text-white bg-[#333] border-[#444] "
                    />
                    <CustomSelect
                      width={"100px"}
                      value={convertType}
                      onChange={handleSelectChange}
                      options={options}
                      className="w-10"
                    />
                  </div>
                  {convertType === "mp3" && (
                    <Button
                      className="px-4 py-2 w-full text-white bg-[#4CAF50] hover:bg-[#388E3C]"
                      onClick={handleConversion}
                      children="Convert"
                      type="button"
                      aria_label="Convert to mp3"
                    />
                  )}
                  {/* {convertType === "mp4" && (
                  <Button
                    type="button"
                    onClick={(e) =>
                      fetchMP4Data(e, setLoading, setMP4List, inputUrl, toast)
                    }
                    aria_label="Convert to mp4"
                    children="Convert"
                  />
                )} */}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3">
            {/* <a
              href={lastConvertedMP3?.url}
              download
              target="_self"
              rel="noopener noreferrer"
              key={lastConvertedMP3?.youtubeID}>
              <span>{lastConvertedMP3?.title}</span>
            </a> */}
            <ResultLink href={lastConvertedMP3?.url} title={lastConvertedMP3?.title} target={"_self"} button={false} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
