import { Link } from "react-router-dom";
import Button from "./Button";

const ResultLink = ({ href, url, title, button = true, target = "_blank", className = "" }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this MP3: ${title}`,
          url: url,
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
    <div className={`flex ${button ? "justify-between gap-1" : "justify-center text-center"} items-center`}>
      <Link
        to={href}
        download
        className={`underline text-justify sm:no-underline text-white hover:underline transition duration-300 ${className}`}
        target={target}
        rel="noopener noreferrer">
        {title}
      </Link>
      {button ? (
        <Button
          children="Share"
          type="button"
          aria_label="Share"
          onClick={handleShare}
          className="border border-[#696969] text-green-500 px-4 py-1 rounded hover:bg-[#696969]"
        />
      ) : null}
    </div>
  );
};

export default ResultLink;
