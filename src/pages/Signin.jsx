import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../firebaseAuth";
import Button from "../components/Button";
import Input from "../components/Inputfield";
import { getErrorMessage } from "../utils/ConvertErrorMsg";

const Signin = () => {
  const navigate = useNavigate();
  const [displayName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUpWithEmail(email, password, displayName);
      alert("Verification email sent! Please check your inbox.");
      navigate("/YotuTube-Convert2MP3/login");
    } catch (error) {
      const message = getErrorMessage(error.message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] transition-all duration-300 px-4">
      <div className="w-full max-w-md p-6 bg-[#1E1E1E] border-2 border-[#4CAF50] rounded-lg shadow-xl shadow-black/40">
        <h2 className="text-2xl text-center font-bold mb-6 text-white">Sign in</h2>
        {error && <p className="mb-4 text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="name" className="mb-2 text-white">
            Name*
          </label>
          <Input
            type="name"
            id="name"
            value={displayName}
            onChange={(e) => setName(e.target.value)}
            className="border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]"
            placeholder="Enter your display name"
            required
          />
          <label htmlFor="email" className="mb-2 text-[#333333] dark:text-white">
            Email*
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]"
            placeholder="Enter your email"
            required
          />
          <label htmlFor="password" className="mb-2 text-white">
            Password*
          </label>
          <Input
            type="password"
            id="password"
            password={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]"
            placeholder="Enter your password"
            required
          />
          <Button
            aria_label="Sign in"
            children={loading ? "Signing in..." : "Sign in"}
            type="submit"
            className="mt-3 px-3 py-2 text-white bg-[#4CAF50] hover:bg-[#388E3C]"
            disabled={loading}
          />
        </form>
        <p className="mt-4 text-center text-white">
          Already have an account?
          <Link title="Sign in" to="/YotuTube-Convert2MP3/login" className="hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
