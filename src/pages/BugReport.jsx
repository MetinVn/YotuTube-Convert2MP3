import React, { useState } from "react";

const BugReport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    const mailtoLink = `mailto:aresxant@gmail.com?subject=Bug Report from ${name}&body=Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen py-16 bg-[#1E1E1E] flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-[#333] p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-white text-lg mb-4">Bug Report</h2>

        <label className="text-gray-400 block mb-2">Name(Optional)</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-4 bg-[#444] border border-[#555] text-white"
        />

        <label className="text-gray-400 block mb-2">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 bg-[#444] border border-[#555] text-white"
          required
        />

        <label className="text-gray-400 block mb-2">Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 mb-4 bg-[#444] border border-[#555] text-white"
          rows="4"
          required
          placeholder="Try to me more explicit e.g: The converter takes too long to convert to mp3 "></textarea>

        <button type="submit" className="w-full p-2 bg-[#4CAF50] text-white hover:bg-[#45a049] transition">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BugReport;
