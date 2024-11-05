import React, { useEffect, useState, useRef } from "react";
import { parseBlob } from "music-metadata";
import CircleLoader from "./LoadingAnimation";
import { FaSyncAlt } from "react-icons/fa";

const DisplayArtist = ({ loadingRefresh, refreshMP3Link, setCurrentMP3, mp3List }) => {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);
  const [failedMP3s, setFailedMP3s] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const artistsFetchedRef = useRef(new Map());

  const fetchSongData = async (mp3, artistSet, artistToMp3Map) => {
    try {
      const response = await fetch(mp3.url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

      const blob = await response.blob();
      const metadata = await parseBlob(blob);

      const artist = metadata.common.artist || "Unknown Artist";

      if (!artistToMp3Map.has(artist)) {
        artistToMp3Map.set(artist, []);
      }

      artistToMp3Map.get(artist).push(mp3);
      artistSet.add(artist);

      setArtists([...artistSet]);
      artistsFetchedRef.current = new Map(artistToMp3Map);

      setFailedMP3s((prevFailed) => {
        const updatedFailed = new Map(prevFailed);
        updatedFailed.delete(mp3.id);
        return updatedFailed;
      });
    } catch (error) {
      console.error(error);
      setFailedMP3s((prevFailed) => new Map(prevFailed).set(mp3.id, mp3));
    }
  };

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      const artistSet = new Set();
      const artistToMp3Map = new Map();

      await Promise.all(mp3List.map((mp3) => fetchSongData(mp3, artistSet, artistToMp3Map)));
      setLoading(false);
    };

    if (mp3List.length > 0) fetchArtists();
  }, [mp3List, loadingRefresh]);

  const handleRefreshSingleLink = async (mp3) => {
    try {
      await refreshMP3Link(mp3);
      while (loadingRefresh) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const artistSet = new Set(artists);
      const artistToMp3Map = new Map(artistsFetchedRef.current);
      await fetchSongData(mp3, artistSet, artistToMp3Map);
    } catch (error) {
      console.error("Error refreshing MP3 link:", error);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 mt-10 w-full  max-w-[1050px] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Artists</h2>

      <table className="min-w-full border border-[#333]">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left text-gray-300">Artist</th>
            <th className="py-2 px-4 text-left text-[#1A1A1A] bg-[#4ADA31]">Songs</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist, index) => {
            const mp3sForArtist = artistsFetchedRef.current.get(artist) || [];
            return (
              <tr key={index} className="border-b border-gray-800">
                <td className="py-4 px-4 text-[#1A1A1A] bg-[#4ADA31] font-bold">{artist}</td>
                <td className="py-4 px-4">
                  <ul>
                    {mp3sForArtist.length === 0 && <li className="text-gray-400 italic">No songs available.</li>}
                    {mp3sForArtist.map((mp3, idx) => (
                      <li key={idx} className="text-gray-300 flex items-center space-x-2">
                        <span onClick={() => setCurrentMP3(mp3)} className="underline sm:no-underline cursor-pointer">
                          {mp3.title || `Song ${mp3.id}`}
                        </span>
                        {failedMP3s.has(mp3.id) && (
                          <button
                            onClick={() => handleRefreshSingleLink(mp3)}
                            className="text-red-500 hover:text-red-700"
                            title="Refresh Link">
                            <FaSyncAlt />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Failed Links Section */}
      {failedMP3s.size > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white">Failed Links</h3>
          <table className="min-w-full border border-[#333] mt-2">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-gray-300">Song Title</th>
                <th className="py-2 px-4 text-left text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(failedMP3s.values()).map((mp3, idx) => (
                <tr key={idx} className="border-b border-gray-700">
                  <td className="py-4 px-4 text-gray-300">{mp3.title || `Song ${mp3.id}`}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleRefreshSingleLink(mp3)}
                      className="text-red-500 hover:text-red-700"
                      title="Refresh Link">
                      <FaSyncAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <CircleLoader />
        </div>
      )}
    </div>
  );
};

export default DisplayArtist;
