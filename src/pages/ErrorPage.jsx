import React from "react";
import { Link } from "react-router-dom";
const ErrorPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center"
      style={{
        background: "linear-gradient(135deg, #333 40%, #4CAF50)",
        transition: "background-color 0.3s ease",
      }}>
      <h1 className="text-5xl font-bold text-white mb-4">Oops!</h1>
      <p className="text-lg text-gray-200 mb-6">This is not the page you're looking for.</p>
      <Link
        aria_label="Go Home"
        to="/YotuTube-Convert2MP3/"
        className="rounded-lg bg-[#4CAF50] text-white px-6 py-2 hover:bg-[#388E3C] transition-colors">
        Go to Homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
