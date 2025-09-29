import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken } = useAuth();

  const signupData = location.state?.signupData;

  if (!signupData) {
    navigate("/auth");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/complete-signup", {
        email: signupData.email,
        otp,
        rememberMe: signupData.rememberMe,
      });

      setAccessToken(response.data.accessToken);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Verification failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">Check your email</h1>
        <p className="text-slate-400 mb-8">
          We've sent a 6-digit code to {signupData.email}.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6"
        >
          {error && <div className="text-red-400">{error}</div>}
          <div>
            <label htmlFor="otp" className="sr-only">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="------"
              maxLength={6}
              required
              className="w-full bg-slate-700 text-white text-center text-2xl tracking-[1em] p-3 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-md disabled:bg-slate-600"
          >
            {isLoading ? "Verifying..." : "Verify & Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
