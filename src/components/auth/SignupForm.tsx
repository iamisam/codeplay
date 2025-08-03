import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { axiosPrivate } from "../../api/axios";

const SignupForm = () => {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { setAccessToken } = useAuth();

  // State for handling loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosPrivate.post("/auth/signup", {
        leetcodeUsername,
        email,
        password,
        rememberMe,
      });

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        navigate("/dashboard"); // Now this will work correctly
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message);
      }
      console.error("Signup failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6"
    >
      {/* Display API error message if it exists */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md text-center">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="signup-leetcode"
          className="block text-sm font-medium text-slate-300"
        >
          LeetCode Username
        </label>
        <input
          id="signup-leetcode"
          type="text"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-slate-300"
        >
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-slate-300"
        >
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center">
        <input
          id="rememberMe-signup"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label
          htmlFor="rememberMe-signup"
          className="ml-2 block text-sm text-slate-300"
        >
          Remember me for 7 days
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating Account...
          </>
        ) : (
          "Create Account ✨"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
