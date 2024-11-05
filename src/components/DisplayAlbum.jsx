import React, { useEffect, useState, useRef } from "react";
import { parseBlob } from "music-metadata";
import CircleLoader from "./LoadingAnimation";
import { FaSyncAlt } from "react-icons/fa";

const DisplayAlbum = ({ refreshMP3Link, loadingRefresh, loading, setCurrentMP3, mp3List }) => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [failedMP3s, setFailedMP3s] = useState(new Map());
  const albumsFetchedRef = useRef(new Map());

  const fetchSongData = async (mp3, albumSet, albumToMp3Map) => {
    try {
      const response = await fetch(mp3.url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

      const blob = await response.blob();
      const metadata = await parseBlob(blob);

      const album = metadata.common.album || "Unknown Album";

      if (!albumToMp3Map.has(album)) {
        albumToMp3Map.set(album, []);
      }

      albumToMp3Map.get(album).push(mp3);
      albumSet.add(album);

      setAlbums([...albumSet]);
      albumsFetchedRef.current = new Map(albumToMp3Map);

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
    const fetchAlbums = async () => {
      const albumSet = new Set();
      const albumToMp3Map = new Map();

      await Promise.all(mp3List.map((mp3) => fetchSongData(mp3, albumSet, albumToMp3Map)));
    };

    if (mp3List.length > 0) fetchAlbums();
  }, [mp3List, loadingRefresh]);

  const handleRefreshSingleLink = async (mp3) => {
    try {
      await refreshMP3Link(mp3); // Request to refresh the MP3 link
      // Wait until loadingRefresh is false before continuing
      while (loadingRefresh) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Fetch updated metadata after refreshing the link
      const albumSet = new Set(albums);
      const albumToMp3Map = new Map(albumsFetchedRef.current);
      await fetchSongData(mp3, albumSet, albumToMp3Map);
    } catch (error) {
      console.error("Error refreshing MP3 link:", error);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 mt-10 w-full max-w-[1050px] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Albums</h2>

      <table className="min-w-full border border-[#333] mb-6">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left text-gray-300">Album</th>
            <th className="py-2 px-4 text-left text-[#1A1A1A] bg-[#4ADA31]">Songs</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album, index) => {
            const mp3sForAlbum = albumsFetchedRef.current.get(album) || [];
            return (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-4 px-4 text-[#1A1A1A] bg-[#4ADA31] font-bold">{album}</td>
                <td className="py-4 px-4">
                  <ul>
                    {mp3sForAlbum.length === 0 && <li className="text-gray-500 italic">No songs available.</li>}
                    {mp3sForAlbum.map((mp3, idx) => (
                      <li key={idx} className="text-gray-300 flex items-center space-x-2">
                        <span className=" underline sm:no-underline cursor-pointer rounded">
                          {mp3.title || `Song ${mp3.id}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {failedMP3s.size > 0 && (
        <>
          <h3 className="text-xl font-bold mb-4 text-white text-center">Failed Links</h3>
          <table className="min-w-full border border-[#333]">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-gray-300">Song</th>
                <th className="py-2 px-4 text-left text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(failedMP3s.values()).map((mp3, index) => (
                <tr key={index} className="border-b border-gray-700">
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
        </>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <CircleLoader />
        </div>
      )}
    </div>
  );
};

export default DisplayAlbum;
