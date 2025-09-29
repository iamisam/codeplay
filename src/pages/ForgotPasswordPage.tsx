import React, { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await api.post("/account/forgot-password", { email });
      setMessage(response.data.message);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>
        {message ? (
          <div className="text-center bg-slate-800 p-8 rounded-lg">
            <p className="text-green-400">{message}</p>
            <Link
              to="/reset-password"
              state={{ email }}
              className="mt-4 inline-block text-emerald-400 hover:underline"
            >
              Proceed to Reset Password &rarr;
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6"
          >
            <p className="text-slate-400 text-sm">
              Enter your email address and we'll send you an OTP to reset your
              password.
            </p>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
                className="w-full bg-slate-700 p-3 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold py-3 rounded-md disabled:bg-slate-600"
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
