import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NowPlaying from "./NowPlaying";
import DisplayMusic from "./DisplayMusic";
import DisplayArtist from "../components/DisplayArtist";
import DisplayAlbum from "../components/DisplayAlbum";
import { ToastContainer, toast } from "react-toastify";
import { MP3Context } from "../contexts/MP3Context";
import { refreshMP3Link } from "../utils/RefreshLink";
import { UserContext } from "../contexts/UserContext";

const MP3Dashboard = () => {
  const [selected, setSelected] = useState("Songs");
  const [prevIndex, setPrevIndex] = useState(0);
  const [currentMP3, setCurrentMP3] = useState(null);
  const [loadingRefresh, setLoadingRefresh] = useState(null);
  const { mp3List, setMP3List, loading } = useContext(MP3Context);
  const { authUser, loadingUser } = useContext(UserContext);

  const handleRefreshLink = async (mp3Item) => {
    setLoadingRefresh(true);
    try {
      await refreshMP3Link(mp3Item.url, mp3Item.youtubeID, setMP3List, toast, mp3Item.fileSize, authUser, loadingUser);
    } catch (error) {
      console.error("Error refreshing the link:", error);
    } finally {
      setLoadingRefresh(false);
    }
  };

  const components = {
    Songs: {
      component: () => (
        <DisplayMusic
          authUser={authUser}
          loadingRefresh={loadingRefresh}
          refreshMP3Link={handleRefreshLink}
          mp3List={mp3List}
          loading={loading}
          setMP3List={setMP3List}
          toast={toast}
          setCurrentMP3={setCurrentMP3}
        />
      ),
      index: 0,
    },
    Artists: {
      component: () => (
        <DisplayArtist
          loading={loading}
          loadingRefresh={loadingRefresh}
          refreshMP3Link={handleRefreshLink}
          mp3List={mp3List}
        />
      ),
      index: 1,
    },
    Albums: {
      component: () => (
        <DisplayAlbum
          refreshMP3Link={handleRefreshLink}
          loadingRefresh={loadingRefresh}
          mp3List={mp3List}
          loading={loading}
        />
      ),
      index: 2,
    },
  };

  const handleButtonClick = (label) => {
    setPrevIndex(components[selected].index);
    setSelected(label);
  };

  const currentIndex = components[selected].index;
  const direction = currentIndex > prevIndex ? 1 : -1;

  const slideVariants = {
    initial: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const nextTrack = () => {
    const currentIndex = !loading && mp3List.findIndex((track) => track.id === currentMP3.id);
    if (currentIndex < mp3List.length - 1) {
      setCurrentMP3(mp3List[currentIndex + 1]);
    }
  };

  return (
    <div className="h-full min-h-screen pt-10 pb-32 bg-[#1A1A1A] text-white">
      <ToastContainer position="bottom-right" autoClose={1500} closeOnClick={true} limit={4} />
      <div className="mt-20 flex justify-center space-x-3 items-center">
        {["Songs", "Artists", "Albums"].map((label) => (
          <button
            key={label}
            onClick={() => handleButtonClick(label)}
            className={`${selected === label ? "text-[#4ADA31]" : "text-white"}`}>
            {label}
          </button>
        ))}
      </div>

      <div>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={selected}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full h-full">
            {components[selected].component()}
          </motion.div>
        </AnimatePresence>
      </div>
      {currentMP3 && (
        <NowPlaying mp3={currentMP3} onClose={() => setCurrentMP3(null)} nextTrack={nextTrack} toast={toast} />
      )}
    </div>
  );
};

export default MP3Dashboard;
