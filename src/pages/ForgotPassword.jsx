import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Input from "../components/Inputfield";
import Button from "../components/Button";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email).then(() => {
        console.log("Sent");
        setMessage("Password reset email sent successfully! Check your inbox.");
      });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] transition-all duration-300 px-4">
      <div className="w-full max-w-md p-6 bg-[#1E1E1E] border-2 border-[#4CAF50] rounded-lg shadow-xl shadow-black/40">
        <h2 className="text-2xl text-center font-bold mb-6 text-white">Reset Password</h2>
        <form onSubmit={handlePasswordReset} className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-white">
            Email
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50] border rounded p-2 mb-4"
          />
          <Button
            aria_label="Send Password Reset Email"
            type="submit"
            children="Send Password Reset Email"
            className="mt-3 bg-[#4CAF50] text-white hover:bg-[#388E3C] py-2 rounded"
          />
        </form>
        {message && <p className="mt-4 text-center text-[#4CAF50]">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;
