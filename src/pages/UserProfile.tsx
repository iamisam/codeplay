import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useFriends } from "../hooks/useFriends";

interface SubmissionStat {
  difficulty: string;
  count: number;
  submissions: number;
}

interface UserProfileData {
  userId: number;
  displayName: string | null;
  leetcodeUsername: string;
  profileVisibility: "public" | "private";
  ranking?: number;
  acSubmissions?: SubmissionStat[];
  totalSubmissions?: SubmissionStat[];
  friendshipStatus: {
    status: "pending" | "accepted";
    requesterId: number;
  } | null;
}

const UserProfilePage = () => {
  const { displayName } = useParams<{ displayName: string }>();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const { user: currentUser } = useAuth();
  const { refreshData: refreshFriendsData } = useFriends();

  const fetchProfile = useCallback(async () => {
    if (!displayName) return;
    try {
      const response = await axiosPrivate.get(`/user/profile/${displayName}`);
      setProfile(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch profile.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [displayName]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSendRequest = async () => {
    if (!profile) return;
    setIsActionLoading(true);
    try {
      await axiosPrivate.post(`/friends/request/${profile.userId}`);
      await fetchProfile();
      refreshFriendsData();
    } catch (error) {
      console.error("Failed to send friend request", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!profile?.friendshipStatus) return;
    setIsActionLoading(true);
    try {
      await axiosPrivate.put(`/friends/accept/${profile.userId}`);
      await fetchProfile();
      refreshFriendsData();
    } catch (error) {
      console.error("Failed to accept friend request", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeclineOrCancel = async () => {
    if (!profile) return;
    setIsActionLoading(true);
    try {
      await axiosPrivate.delete(`/friends/request/${profile.userId}`);
      await fetchProfile();
      refreshFriendsData();
    } catch (error) {
      console.error("Failed to decline/cancel request", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const renderFriendshipButton = () => {
    if (!profile || !currentUser || profile.userId === currentUser.userId) {
      return null; // Don't show button on your own profile
    }

    const { friendshipStatus } = profile;

    if (!friendshipStatus) {
      return (
        <button
          onClick={handleSendRequest}
          disabled={isActionLoading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-slate-600"
        >
          {isActionLoading ? "Sending..." : "Send Friend Request"}
        </button>
      );
    }

    if (friendshipStatus.status === "pending") {
      if (friendshipStatus.requesterId === currentUser.userId) {
        return (
          <button
            onClick={handleDeclineOrCancel}
            disabled={isActionLoading}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-slate-600"
          >
            {isActionLoading ? "Canceling..." : "Cancel Request"}
          </button>
        );
      } else {
        return (
          <div className="flex items-center gap-4">
            <p className="text-slate-300 text-sm">
              Pending request from{" "}
              {profile.displayName || profile.leetcodeUsername}
            </p>
            <button
              onClick={handleAccept}
              disabled={isActionLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Accept
            </button>
            <button
              onClick={handleDeclineOrCancel}
              disabled={isActionLoading}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Decline
            </button>
          </div>
        );
      }
    }

    if (friendshipStatus.status === "accepted") {
      return (
        <button
          disabled
          className="bg-slate-700 text-emerald-400 font-bold py-2 px-6 rounded-md flex items-center gap-2 cursor-default"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          Friends
        </button>
      );
    }

    return null;
  };

  if (isLoading)
    return (
      <div className="text-center text-white p-10">Loading profile...</div>
    );
  if (error)
    return <div className="text-center text-red-500 p-10">{error}</div>;
  if (!profile)
    return (
      <div className="text-center text-white p-10">
        Profile could not be loaded.
      </div>
    );

  if (
    profile.profileVisibility === "private" &&
    profile.friendshipStatus?.status !== "accepted"
  ) {
    return (
      <div className="bg-slate-900 text-white min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="text-center bg-slate-800 p-10 rounded-xl border border-slate-700 w-full max-w-md">
          <h1 className="text-3xl font-bold text-emerald-400">
            {profile.displayName || profile.leetcodeUsername}
          </h1>
          <p className="text-slate-400 mt-2">@{profile.leetcodeUsername}</p>
          <div className="mt-6 text-lg">🔒 This profile is private.</div>
          <div className="mt-8">{renderFriendshipButton()}</div>
        </div>
      </div>
    );
  }

  const allAcStats = profile.acSubmissions?.find((s) => s.difficulty === "All");
  const allTotalStats = profile.totalSubmissions?.find(
    (s) => s.difficulty === "All",
  );
  let acceptanceRate = 0;
  if (allAcStats && allTotalStats && allTotalStats.submissions > 0) {
    acceptanceRate = (allAcStats.submissions / allTotalStats.submissions) * 100;
  }
  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-emerald-400">
              {profile.displayName || profile.leetcodeUsername}
            </h1>
            <p className="text-slate-400 mt-1">@{profile.leetcodeUsername}</p>
          </div>
          {renderFriendshipButton()}
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Global Rank"
            value={`#${profile.ranking?.toLocaleString() || "N/A"}`}
            emoji="🏆"
          />
          <StatCard
            title="Acceptance Rate"
            value={`${acceptanceRate.toFixed(2)}%`}
            emoji="🎯"
          />
          <StatCard
            title="Problems Solved"
            value={allAcStats?.count || 0}
            emoji="✅"
          />
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Submission Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.acSubmissions
              ?.filter((s) => s.difficulty !== "All")
              .map((stat) => (
                <DifficultyCard
                  key={stat.difficulty}
                  title={`Solved - ${stat.difficulty}`}
                  count={stat.count}
                  submissions={stat.submissions}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  emoji,
}: {
  title: string;
  value: string | number;
  emoji: string;
}) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
    <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
      {emoji} {title}
    </h3>
    <p className="text-3xl font-bold text-slate-100">{value}</p>
  </div>
);

const DifficultyCard = ({
  title,
  count,
  submissions,
}: {
  title: string;
  count: number;
  submissions: number;
}) => {
  const color = title.includes("Easy")
    ? "text-green-400"
    : title.includes("Medium")
      ? "text-orange-400"
      : "text-red-400";
  return (
    <div
      className={`bg-slate-700/50 p-4 rounded-lg border-l-4 ${color.replace("text", "border")}`}
    >
      <h4 className={`font-bold ${color}`}>{title}</h4>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs text-slate-400">{submissions} submissions</p>
    </div>
  );
};

export default UserProfilePage;
