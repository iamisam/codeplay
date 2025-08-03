import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { axiosPrivate } from "../../api/axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosPrivate.post("/auth/login", {
        email,
        password,
        rememberMe,
      });
      setAccessToken(response.data.accessToken);
      if (response.status == 200) {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login Failed");
      } else {
        setError("An unexpected error occurred!");
        console.log(err);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6"
    >
      {error && <div className="text-red-400 text-center">{error}</div>}

      <div className="space-y-2">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-slate-300"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-slate-700 text-white p-3 rounded-md"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-slate-300"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-slate-700 text-white p-3 rounded-md"
        />
      </div>

      <div className="flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label
          htmlFor="rememberMe"
          className="ml-2 block text-sm text-slate-300"
        >
          Remember me for 7 days
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-md"
      >
        Sign In 🔑
      </button>
    </form>
  );
};

export default LoginForm;
