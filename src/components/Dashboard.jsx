import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { debounce } from "lodash";

import { clearMP3Store, deleteMP3 } from "../utils/IndexedDB";
import Button from "./Button";
import ConvertedMusic from "./ConvertedMP3";
import MP3Player from "./MP3Player";

const Dashboard = ({ mp3List, setMp3List, toast, ToastContainer }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [layout, setLayout] = useState("dashboard");
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
    toast.info("Item deleted.");
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
        <select
          onChange={(e) => setLayout(e.target.value)}
          value={layout}
          className="mt-4 mb-6 p-2 rounded outline-none bg-[#f9f9f9] text-[#333] dark:bg-[#333] dark:text-white transition-colors duration-300">
          <option value="dashboard">Converted music</option>
          <option value="mp3player">MP3 Player</option>{" "}
        </select>

        {layout === "dashboard" ? (
          <ConvertedMusic
            dashRef={dashRef}
            filteredMP3s={filteredMP3s}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            handleClearList={handleClearList}
            handleDeleteItem={handleDeleteItem}
            ToastContainer={ToastContainer}
          />
        ) : (
          layout === "mp3player" && (
            <MP3Player
              mp3List={filteredMP3s}
              toast={toast}
              ToastContainer={ToastContainer}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
