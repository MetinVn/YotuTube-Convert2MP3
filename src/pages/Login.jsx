import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmail } from "../firebaseAuth";
import Button from "../components/Button";
import Input from "../components/Inputfield";
import { getErrorMessage } from "../utils/ConvertErrorMsg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmail(email, password);
      navigate("/YotuTube-Convert2MP3/account");
    } catch (error) {
      const message = getErrorMessage(error.message);
      setError(message);
      setAttempts((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] transition-all duration-300 px-4">
      <div className="w-full max-w-md p-6 bg-[#1E1E1E] border-2 border-[#4CAF50] rounded-lg shadow-xl shadow-black/40">
        <h2 className="text-2xl text-center font-bold mb-6 text-white">Login</h2>
        {error && <p className="mb-4 text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-white">
            Email
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
            Password
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
            aria_label="Login"
            children={loading ? "Logging in..." : "Login"}
            type="submit"
            className="mt-3 px-4 py-2 bg-[#4CAF50] text-white hover:bg-[#388E3C]"
            disabled={loading}
          />
        </form>
        {attempts > 1 && (
          <p className="mt-4 text-center text-white">
            Forgot your password?{" "}
            <Link title="Reset Password" to="/YotuTube-Convert2MP3/reset-password" className="hover:underline">
              Reset it here
            </Link>
          </p>
        )}
        <p className="mt-4 text-center text-white">
          Don't have an account?
          <Link title="Sign in" to="/YotuTube-Convert2MP3/signin" className="hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
