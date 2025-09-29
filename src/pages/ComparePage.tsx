import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Data Structures ---
interface SubmissionStat {
  difficulty: string;
  count: number;
  submissions: number;
}

interface CompareUser {
  displayName: string | null;
  leetcodeUsername: string;
  ranking: number;
  acSubmissions: SubmissionStat[];
  totalSubmissions: SubmissionStat[];
}

interface ProcessedStats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  acceptanceRate: number;
}

// --- Helper Function to Process Stats ---
const processUserStats = (user: CompareUser): ProcessedStats => {
  const getStat = (difficulty: string) =>
    user.acSubmissions.find((s) => s.difficulty === difficulty)?.count || 0;

  const totalAc =
    user.acSubmissions.find((s) => s.difficulty === "All")?.count || 0;
  const totalAcAcceptance =
    user.acSubmissions.find((s) => s.difficulty === "All")?.submissions || 0;
  const totalSubmissions =
    user.totalSubmissions.find((s) => s.difficulty === "All")?.submissions || 0;

  const acceptanceRate =
    totalSubmissions > 0 ? (totalAcAcceptance / totalSubmissions) * 100 : 0;

  return {
    totalSolved: totalAc,
    easy: getStat("Easy"),
    medium: getStat("Medium"),
    hard: getStat("Hard"),
    acceptanceRate: parseFloat(acceptanceRate.toFixed(2)),
  };
};

const ComparePage = () => {
  const { otherUserIdentifier } = useParams<{ otherUserIdentifier: string }>();
  const [currentUser, setCurrentUser] = useState<CompareUser | null>(null);
  const [otherUser, setOtherUser] = useState<CompareUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        const response = await axiosPrivate.get(
          `/user/compare/${otherUserIdentifier}`,
        );
        setCurrentUser(response.data.currentUser);
        setOtherUser(response.data.otherUser);
      } catch (err: unknown) {
        setError("Failed to fetch comparison data." + err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComparisonData();
  }, [otherUserIdentifier]);

  if (isLoading)
    return (
      <div className="text-center text-white p-10">Loading comparison...</div>
    );
  if (error)
    return <div className="text-center text-red-500 p-10">{error}</div>;
  if (!currentUser || !otherUser)
    return (
      <div className="text-center text-white p-10">
        Could not load user data.
      </div>
    );

  const currentUserStats = processUserStats(currentUser);
  const otherUserStats = processUserStats(otherUser);

  const currentUserLabel = currentUser.leetcodeUsername;
  const otherUserLabel = otherUser.leetcodeUsername;

  const chartData = [
    {
      name: "Easy",
      [currentUserLabel]: currentUserStats.easy,
      [otherUserLabel]: otherUserStats.easy,
    },
    {
      name: "Medium",
      [currentUserLabel]: currentUserStats.medium,
      [otherUserLabel]: otherUserStats.medium,
    },
    {
      name: "Hard",
      [currentUserLabel]: currentUserStats.hard,
      [otherUserLabel]: otherUserStats.hard,
    },
  ];

  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-100">
          Profile Comparison
        </h1>

        {/* --- Player Headers --- */}
        <div className="grid grid-cols-2 gap-4 text-center mb-10">
          <PlayerHeader user={currentUser} />
          <PlayerHeader user={otherUser} />
        </div>

        {/* --- Main Stats Comparison --- */}
        <div className="space-y-6">
          <StatRow
            label="Global Rank"
            value1={currentUser.ranking}
            value2={otherUser.ranking}
            format="rank"
          />
          <StatRow
            label="Total Problems Solved"
            value1={currentUserStats.totalSolved}
            value2={otherUserStats.totalSolved}
          />
          <StatRow
            label="Acceptance Rate"
            value1={currentUserStats.acceptanceRate}
            value2={otherUserStats.acceptanceRate}
            format="percent"
          />
        </div>

        {/* --- Difficulty Breakdown Chart --- */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mt-12">
          <h2 className="text-xl font-semibold text-center mb-6">
            Difficulty Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                }}
                cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
              />
              <Bar dataKey={currentUserLabel} fill="#34d399" />
              <Bar dataKey={otherUserLabel} fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for better structure ---

const PlayerHeader = ({ user }: { user: CompareUser }) => (
  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
    <h2 className="text-xl font-bold text-emerald-400">
      {user.displayName || user.leetcodeUsername}
    </h2>
    <p className="text-sm text-slate-400">@{user.leetcodeUsername}</p>
  </div>
);

const StatRow = ({
  label,
  value1,
  value2,
  format = "number",
}: {
  label: string;
  value1: number;
  value2: number;
  format?: "number" | "rank" | "percent";
}) => {
  const isRank = format === "rank";
  const user1isWinner = isRank ? value1 < value2 : value1 > value2;
  const user2isWinner = isRank ? value2 < value1 : value2 > value1;

  const formatValue = (val: number) => {
    if (format === "rank") return `#${val.toLocaleString()}`;
    if (format === "percent") return `${val}%`;
    return val.toLocaleString();
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg">
      <p className="text-center text-slate-300 font-semibold mb-3">{label}</p>
      <div className="grid grid-cols-2 gap-4 items-center text-center">
        <p
          className={`text-2xl font-bold ${user1isWinner ? "text-green-400" : "text-slate-100"}`}
        >
          {formatValue(value1)}
        </p>
        <p
          className={`text-2xl font-bold ${user2isWinner ? "text-cyan-400" : "text-slate-100"}`}
        >
          {formatValue(value2)}
        </p>
      </div>
    </div>
  );
};

export default ComparePage;
