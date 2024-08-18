import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { debounce } from "lodash";

import Button from "./Button";
import Select from "./SelectElement";

import ConvertedMusic from "../layouts/ConvertedMP3";
import MP3Player from "../layouts/MP3Player";
import ConvertedMP4 from "../layouts/ConvertedMP4";

import { clearMP3Store, deleteMP3, deleteMP4 } from "../utils/IndexedDB";

const Dashboard = ({
  mp4List,
  mp3List,
  setMp3List,
  setMP4List,
  toast,
  ToastContainer,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [layout, setLayout] = useState("mp3");
  const [filteredMP3s, setFilteredMP3s] = useState({});
  const dashRef = useRef();
  const menuRef = useRef();

  const handleClickOutsideMenu = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("touchstart", handleClickOutsideMenu);
    };
  }, []);

  const handleSearch = debounce((term) => {
    if (term.trim() === "") {
      setFilteredMP3s(mp3List);
    } else {
      const filtered = Object.keys(mp3List).reduce((acc, key) => {
        if (mp3List[key].title.toLowerCase().includes(term.toLowerCase())) {
          acc[key] = mp3List[key];
        }
        return acc;
      }, {});
      setFilteredMP3s(filtered);
    }
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, mp3List]);

  const handleClearList = async () => {
    if (Object.keys(mp3List).length === 0) {
      toast.info("The list is already empty.");
    } else {
      await clearMP3Store();
      setMp3List({});
      setFilteredMP3s({});
      toast.info("List cleared.");
    }
  };

  const handleDeleteItem = async (key) => {
    const updatedList = { ...mp3List };
    delete updatedList[key];
    setMp3List(updatedList);
    setFilteredMP3s(updatedList);
    await deleteMP3(key);
    toast.info("Item deleted from mp3 list.");
  };

  const handleDelete = async (title) => {
    try {
      await deleteMP4(title);
      setMP4List((prevList) => {
        const newList = { ...prevList };
        delete newList[title];
        return newList;
      });
      toast.info("Item deleted from mp4 list.");
    } catch (error) {
      toast.error("Failed to delete item from mp4 list.");
      console.error("Error deleting MP4:", error);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      ref={menuRef}
      className={`fixed top-2 left-0 h-screen overflow-hidden ${
        isMenuOpen ? "w-[290px]" : "w-0"
      } transition-all duration-300 bg-white dark:bg-[#1E1E1E]`}>
      <div className="z-50 fixed top-2 left-2">
        <Button
          onClick={handleMenuToggle}
          ariaLabel="Burger Menu"
          className="px-3 py-1 rounded bg-[#4CAF50] text-white hover:bg-[#388E3C] dark:bg-[#333] dark:text-[#4CAF50] dark:hover:bg-[#555] transition-colors duration-300">
          <FiMenu size={24} />
        </Button>
      </div>
      <div
        className={`w-full h-full overflow-y-scroll overflow-x-hidden py-10 max-w-[1000px] mx-auto mt-4 p-4 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}>
        <Select
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          className={"mb-5"}
          options={[
            { value: "mp3", label: "Converted music" },
            { value: "mp4", label: "Converted videos" },
            { value: "mp3player", label: "MP3 Player" },
          ]}
        />
        {layout === "mp3" && (
          <ConvertedMusic
            dashRef={dashRef}
            filteredMP3s={filteredMP3s}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            handleClearList={handleClearList}
            handleDeleteItem={handleDeleteItem}
          />
        )}
        {layout === "mp3player" && (
          <MP3Player
            mp3List={filteredMP3s}
            toast={toast}
            ToastContainer={ToastContainer}
          />
        )}
        {layout === "mp4" && (
          <ConvertedMP4
            handleDeleteItem={handleDelete}
            setMP4List={setMP4List}
            mp4List={mp4List}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
