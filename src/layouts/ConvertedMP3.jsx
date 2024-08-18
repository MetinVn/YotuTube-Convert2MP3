import Input from "../components/Inputfield";
import Button from "../components/Button";
import ResultLink from "../components/ResultLink";

import { formatFileSize } from "../utils/FormatFileSize";
const ConvertedMusic = ({
  dashRef,
  filteredMP3s,
  searchTerm,
  onSearchTermChange,
  handleClearList,
  handleDeleteItem,
}) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-[#333] dark:text-white mb-4">
        Converted music
      </h1>
      <Input
        ref={dashRef}
        placeholder="Search converted music"
        className="text-[#333] my-3 dark:text-white dark:bg-[#333] dark:border-[#444]"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
      {Object.keys(filteredMP3s).length === 0 ? (
        <p className="text-lg text-[#666] dark:text-[#ccc]">
          {searchTerm.trim() === ""
            ? "The list is empty. Convert a URL to add it here automatically."
            : "No results found. Try a different search term."}
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {Object.keys(filteredMP3s).map((key) => (
            <li
              key={key}
              className="p-2 border rounded bg-[#f9f9f9] dark:bg-[#333] dark:border-[#444]">
              <ResultLink href={key} title={filteredMP3s[key].title} />
              <div className="flex justify-between items-center">
                <Button
                  ariaLabel="Delete Item"
                  onClick={() => handleDeleteItem(key)}
                  className="mt-2 py-[4px] bg-[#FF5252] text-white hover:bg-[#E63946] dark:bg-[#555] dark:text-[#FF5252] dark:hover:bg-[#777]">
                  Delete
                </Button>
                <p className="text-gray-400">
                  {formatFileSize(filteredMP3s[key].fileSize)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {Object.keys(filteredMP3s).length > 2 && (
        <div className="mt-4">
          <Button
            ariaLabel="Clear List"
            onClick={handleClearList}
            className="py-[4px] bg-[#FF5252] text-white hover:bg-[#E63946] dark:bg-[#555] dark:text-[#FF5252] dark:hover:bg-[#777]">
            Delete All
          </Button>
        </div>
      )}
    </>
  );
};

export default ConvertedMusic;
