import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import axios from "axios";

const SignupForm = () => {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const signupData = { leetcodeUsername, email, password, rememberMe };

      await api.post("/auth/initiate-signup", signupData);

      navigate("/verify-email", { state: { signupData } });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Signup initiation failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6"
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md text-center text-sm flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
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
          required
          className="w-full bg-slate-700 text-white p-3 rounded-md"
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
          required
          className="w-full bg-slate-700 text-white p-3 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-slate-300"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-700 text-white p-3 rounded-md pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-white"
          >
            {showPassword ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.453-5.118l8.91 8.91zM12 15a3 3 0 110-6 3 3 0 010 6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1.175 1.175l21.65 21.65m-8.91-8.91a3 3 0 00-4.242-4.242"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="signup-confirm-password"
          className="block text-sm font-medium text-slate-300"
        >
          Confirm Password
        </label>
        <input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full bg-slate-700 text-white p-3 rounded-md"
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
        disabled={isLoading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-md disabled:bg-slate-600"
      >
        {isLoading ? "Sending OTP..." : "Continue"}
      </button>
    </form>
  );
};

export default SignupForm;
