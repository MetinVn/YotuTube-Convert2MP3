import React from "react";

import Button from "./Button";

const ResultLink = ({ href, title, button = true }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this MP3: ${title}`,
          url: href,
        });
      } catch (error) {
        console.error("Error sharing the link:", error);
      }
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  if (!href || !title) {
    return null;
  }

  return (
    <div
      className={`flex ${
        button ? "justify-between" : "justify-center text-center"
      } items-center`}>
      <a
        href={href}
        download
        className="underline sm:no-underline text-[#4CAF50] hover:text-[#388E3C] hover:underline transition duration-300 ease-in-out"
        target="_blank"
        rel="noopener noreferrer">
        {title}
      </a>
      {button ? (
        <Button
          ariaLabel="Share"
          onClick={handleShare}
          className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
          Share
        </Button>
      ) : null}
    </div>
  );
};

export default ResultLink;
