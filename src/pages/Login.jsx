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
      navigate("/account");
    } catch (error) {
      const message = getErrorMessage(error.message);
      console.log(error.message);
      setError(message);
      setAttempts((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] transition-all duration-300 px-4">
      <div className="w-full max-w-md p-8 bg-[#2C2C2C] border border-[#4CAF50] rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-8 text-white">Login</h2>

        {error && <p className="mb-6 text-center text-red-400">{error}</p>}
        {attempts > 0 && (
          <>
            <p className="mt-4 text-center text-yellow-400">
              Note: After 3 failed attempts, you'll need to reset your password to access your account.
            </p>
            <p className="mt-4 text-center text-yellow-400">Current attempts: {attempts}</p>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm text-gray-400">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm text-gray-400">
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              password={true}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            aria_label="Login"
            children={loading ? "Logging in..." : "Login"}
            type="submit"
            className="mt-4 w-full py-3 text-white bg-[#4CAF50] hover:bg-[#388E3C] rounded-lg transition duration-300"
            disabled={loading}
          />
        </form>

        <p className="mt-6 text-center text-gray-300">
          Forgot your password?{" "}
          <Link to="/reset-password" className="text-[#4CAF50] hover:text-[#388E3C] underline transition duration-200">
            Reset it here
          </Link>
        </p>

        <p className="mt-6 text-center text-gray-300">
          Don't have an account?{" "}
          <Link to="/signin" className="text-[#4CAF50] hover:text-[#388E3C] underline transition duration-200">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
