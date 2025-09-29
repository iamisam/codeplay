import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const [displayName, setDisplayName] = useState("");
  const [profileVisibility, setProfileVisibility] = useState<
    "public" | "private"
  >("public");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    errmsg: string;
  } | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch current settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosPrivate.get("/user/me");
        setDisplayName(response.data.displayName || "");
        setProfileVisibility(response.data.profileVisibility);
      } catch (error: unknown) {
        if (error instanceof Error)
          setMessage({
            type: "error",
            text: "Failed to load settings.",
            errmsg: error.message,
          });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axiosPrivate.put("/user/me", { displayName, profileVisibility });
      setMessage({
        type: "success",
        text: "Settings updated successfully!",
        errmsg: "No Error",
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to update settings.",
          errmsg: err.response?.data?.message,
        });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to homepage after logout
  };

  if (isLoading) {
    return (
      <div className="text-center text-white p-10">Loading settings...</div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8">
      <div className="max-w-2xl space-y-12 mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
          <form
            onSubmit={handleSaveChanges}
            className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6"
          >
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Choose a unique display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Profile Visibility
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={profileVisibility === "public"}
                    onChange={() => setProfileVisibility("public")}
                    className="h-4 w-4 text-emerald-600 bg-slate-700 border-slate-600 focus:ring-emerald-500"
                  />
                  Public
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={profileVisibility === "private"}
                    onChange={() => setProfileVisibility("private")}
                    className="h-4 w-4 text-emerald-600 bg-slate-700 border-slate-600 focus:ring-emerald-500"
                  />
                  Private (Friends Only)
                </label>
              </div>
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
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Account Actions</h2>
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-4">
            <button
              onClick={() => navigate("/change-password")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-md transition-colors"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-800/80 hover:bg-red-700/80 text-white font-semibold py-3 px-4 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
