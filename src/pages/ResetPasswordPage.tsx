import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post("/account/reset-password", {
        email,
        otp,
        password,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/auth"), 3000); // Redirect to login after 3s
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Password reset failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Your Password
        </h1>
        {message ? (
          <div className="text-center bg-slate-800 p-8 rounded-lg">
            <p className="text-green-400">{message}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6"
          >
            {error && <div className="text-red-400">{error}</div>}
            <p className="text-slate-400 text-sm">
              An OTP has been sent to {email}. Please enter it below along with
              your new password.
            </p>
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="6-digit OTP"
                maxLength={6}
                className="w-full bg-slate-700 p-3 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="New Password"
                className="w-full bg-slate-700 p-3 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold py-3 rounded-md disabled:bg-slate-600"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
