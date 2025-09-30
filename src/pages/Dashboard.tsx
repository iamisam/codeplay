import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { Link } from "react-router-dom";
import axios from "axios";
import StatusIndicator from "../components/ui/StatusIndicator";

// Define interfaces for the data structure
interface SubmissionStat {
  difficulty: string;
  count: number;
  submissions: number;
}

interface UserProfile {
  userId: number;
  displayName: string | null;
  leetcodeUsername: string;
  realName: string;
  ranking: number;
  profileVisibility: "public" | "private";
  status: "online" | "away" | "offline";
  acSubmissions: SubmissionStat[];
  totalSubmissions: SubmissionStat[];
}

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUserProfile = async () => {
      try {
        const response = await axiosPrivate.get("/user/me", {
          signal: controller.signal,
        });
        setUser(response.data);
        setError(null);
        setIsLoading(false);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          setError("Failed to fetch user profile.");
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="text-center text-white p-10">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-white p-10">
        Could not load user data.
      </div>
    );
  }

  const handleStatusChange = async (newStatus: "online" | "away") => {
    if (!user) return;

    const oldStatus = user.status;
    setUser({ ...user, status: newStatus });

    try {
      await axiosPrivate.put("/user/me/status", { status: newStatus });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data?.message);
      }
      setUser({ ...user, status: oldStatus });
      console.error("Failed to update status");
    }
  };

  // Find the 'All' difficulty stats for calculations
  const allAcStats = user.acSubmissions.find((s) => s.difficulty === "All");
  const allTotalStats = user.totalSubmissions.find(
    (s) => s.difficulty === "All",
  );

  let acceptanceRate = 0;
  if (allAcStats && allTotalStats && allTotalStats.submissions > 0) {
    // LeetCode formula is (total accepted submissions / total submissions)
    // From the API, acSubmissionNum.count seems to be total accepted submissions.
    acceptanceRate = (allAcStats.submissions / allTotalStats.submissions) * 100;
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100">
                Welcome,{" "}
                <span className="text-emerald-400">
                  {user.displayName || user.leetcodeUsername}
                </span>
                !
              </h1>
              <p className="text-slate-400 mt-2">
                Here's your LeetCode performance snapshot.
              </p>
            </div>
            <Link
              to="/settings"
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Settings
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
            <StatusIndicator status={user.status} />
            <div className="border-l border-slate-700 pl-4 flex items-center gap-2">
              <button
                onClick={() => handleStatusChange("online")}
                disabled={user.status === "online"}
                className="px-3 py-1 text-xs rounded-md bg-green-500/20 text-green-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500/40"
              >
                Set Online
              </button>
              <button
                onClick={() => handleStatusChange("away")}
                disabled={user.status === "away"}
                className="px-3 py-1 text-xs rounded-md bg-yellow-500/20 text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-500/40"
              >
                Set Away
              </button>
            </div>
          </div>
          {!user.displayName && (
            <div className="mt-4 bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-3 rounded-md">
              Welcome! Why not{" "}
              <Link
                to="/settings"
                className="font-bold underline hover:text-yellow-200"
              >
                set a display name
              </Link>{" "}
              to make your profile unique?
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Global Rank"
            value={`#${user.ranking.toLocaleString()}`}
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
            {user.acSubmissions
              .filter((s) => s.difficulty !== "All")
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

export default Dashboard;
