import React, { useEffect, useState, useRef } from "react";
import { parseBlob } from "music-metadata";
import CircleLoader from "./LoadingAnimation";

const DisplayArtist = ({ loadingRefresh, mp3List, refreshMP3Link, loading }) => {
  const [artists, setArtists] = useState(new Map());
  const [failedMP3s, setFailedMP3s] = useState([]);
  const fetchAttemptedRef = useRef(new Set());

  const fetchSongData = async (mp3) => {
    if (fetchAttemptedRef.current.has(mp3.id)) return;

    if (!loadingRefresh) {
      try {
        fetchAttemptedRef.current.add(mp3.id);

        const response = await fetch(mp3.url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const blob = await response.blob();
        const metadata = await parseBlob(blob);

        // Ensure the artist is known, or fallback to "Unknown Artist"
        const artist = metadata.common.artist || "Unknown Artist";
        const songTitle = mp3.title;

        setArtists((prevArtists) => {
          const updatedArtists = new Map(prevArtists);

          // Check if artist already exists in the Map
          if (updatedArtists.has(artist)) {
            // If artist exists, add the song if it's not already there
            const existingSongs = updatedArtists.get(artist);
            if (!existingSongs.includes(songTitle)) {
              existingSongs.push(songTitle); // Add the song title if it's not a duplicate
            }
          } else {
            // Otherwise, create a new entry for the artist with the song
            updatedArtists.set(artist, [songTitle]);
          }
          return updatedArtists;
        });
      } catch (error) {
        console.error(`Error with "${mp3.title}": ${error.message}`);
        setFailedMP3s((prevFailed) => {
          if (!prevFailed.some((failed) => failed.id === mp3.id)) {
            return [...prevFailed, mp3];
          }
          return prevFailed;
        });
      }
    }
  };

  useEffect(() => {
    mp3List.forEach((mp3) => fetchSongData(mp3));
  }, [mp3List]);

  const handleSingleRefresh = async (mp3) => {
    setFailedMP3s((prev) => prev.filter((item) => item.id !== mp3.id));
    try {
      const resp = await refreshMP3Link(mp3);
      if (resp) {
        await fetchSongData(mp3);
      }
    } catch (error) {
      console.error("Error refreshing MP3 link:", error);
      setFailedMP3s((prev) => [...prev, mp3]);
    }
  };

  if (loading) return <CircleLoader />;

  return (
    <div className="p-6 mt-10 w-full max-w-[1050px] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Artists</h2>
      <table className="min-w-full border border-[#333]">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left text-gray-300">Artist</th>
            <th className="py-2 px-4 text-left text-[#1A1A1A] bg-[#4ADA31]">Song Title</th>
          </tr>
        </thead>
        <tbody>
          {[...artists].map(([artistName, songs]) => (
            <tr key={artistName} className="border-b border-gray-800">
              <td className="py-4 px-4 text-[#1A1A1A] bg-[#4ADA31] font-bold">{artistName}</td>
              <td className="py-4 px-4 text-gray-300">
                {songs.map((song, index) => (
                  <React.Fragment key={index}>
                    {song}
                    {index < songs.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {failedMP3s.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white">Failed to load</h3>
          <table className="min-w-full border border-[#333] mt-2">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-gray-300">Song Title</th>
                <th className="py-2 px-4 text-left text-gray-300">Status</th>
                <th className="py-2 px-4 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {failedMP3s.map((mp3) => (
                <tr key={mp3.id} className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">{mp3.title}</td>
                  <td className="py-4 px-4 text-red-500">Failed to fetch</td>
                  <td
                    onClick={() => handleSingleRefresh(mp3)}
                    className="py-4 px-4 cursor-pointer text-red-500 hover:opacity-70">
                    Refresh
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayArtist;
