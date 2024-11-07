import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../firebaseAuth";
import Button from "../components/Button";
import Input from "../components/Inputfield";
import { getErrorMessage } from "../utils/ConvertErrorMsg";
import { UserContext } from "../contexts/UserContext";

const Signin = () => {
  const { loadingUser, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [displayName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loadingUser && !isLoggedIn) {
      navigate("/account");
    }
  }, [loadingUser, isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUpWithEmail(email, password, displayName);
      alert("Verification email sent! Please check your inbox.");
      navigate("/login");
    } catch (error) {
      const message = getErrorMessage(error.message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] transition-all duration-300 px-4">
      <div className="w-full max-w-md p-8 bg-[#2C2C2C] border border-[#4CAF50] rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-8 text-white">Sign up</h2>

        {error && <p className="mb-6 text-center text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm text-gray-400">
              Name*
            </label>
            <Input
              type="text"
              id="name"
              value={displayName}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]"
              placeholder="Enter your display name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm text-gray-400">
              Email*
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
              Password*
            </label>
            <Input
              type="password"
              id="password"
              password={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            aria_label="Sign up"
            children={loading ? "Signing up..." : "Sign up"}
            type="submit"
            className="mt-4 w-full py-3 text-white bg-[#4CAF50] hover:bg-[#388E3C] rounded-lg transition duration-300"
            disabled={loading}
          />
        </form>

        <p className="mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4CAF50] hover:text-[#388E3C] underline transition duration-200">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
