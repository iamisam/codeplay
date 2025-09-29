import React, { useState } from "react";
import { axiosPrivate } from "../api/axios";
import { Link } from "react-router-dom";
import axios from "axios";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      setIsLoading(false);
      return;
    }

    try {
      await axiosPrivate.put("/account/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to change password.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/settings"
          className="text-sm text-emerald-400 hover:text-emerald-300 mb-6 inline-block"
        >
          &larr; Back to Settings
        </Link>
        <h1 className="text-3xl font-bold mb-6">Change Password</h1>
        <form
          onSubmit={handleChangePassword}
          className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6"
        >
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-slate-700 p-3 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-slate-700 p-3 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full bg-slate-700 p-3 rounded-md"
            />
          </div>
          {message && (
            <div
              className={`p-3 rounded-md text-center ${message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
            >
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-slate-600"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
