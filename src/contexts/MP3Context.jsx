import React, { createContext, useState, useContext, useEffect } from "react";
import { getAllMP3s } from "../database/music/getAllMP3";
import { UserContext } from "./UserContext";

export const MP3Context = createContext(null);

export const MP3Provider = ({ children }) => {
  const [mp3List, setMP3List] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authUser, loadingUser } = useContext(UserContext);

  async function renderMusic() {
    setLoading(true);
    if (!loadingUser && authUser) {
      try {
        const allMP3s = await getAllMP3s(authUser, loadingUser);
        setMP3List(allMP3s);
      } catch (error) {
        console.error("Failed to render music:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    renderMusic();
  }, [loadingUser, authUser]);

  return <MP3Context.Provider value={{ mp3List, setMP3List, loading, renderMusic }}>{children}</MP3Context.Provider>;
};

export const useMP3Context = () => useContext(MP3Context);
