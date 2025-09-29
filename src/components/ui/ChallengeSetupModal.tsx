import { useState, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";
import axios from "axios";

interface ChallengeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    userId: number;
    displayName: string | null;
    leetcodeUsername: string;
  };
}

interface ProblemSearchResult {
  title: string;
  titleSlug: string;
}

const ChallengeSetupModal = ({
  isOpen,
  onClose,
  recipient,
}: ChallengeSetupModalProps) => {
  const [dailyProblem, setDailyProblem] = useState<ProblemSearchResult | null>(
    null,
  );
  const [customProblemQuery, setCustomProblemQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProblemSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      axiosPrivate
        .get("/challenge/daily-problem")
        .then((res) => {
          console.log(res);
          setDailyProblem({
            title: res.data.title,
            titleSlug: res.data.titleSlug,
          });
        })
        .catch(() => setError("Could not fetch daily problem."));
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (customProblemQuery) {
        // Use the new backend search route
        axiosPrivate
          .get(`/challenge/search-problems?query=${customProblemQuery}`)
          .then((res) => setSearchResults(res.data));
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [customProblemQuery]);

  const handleChallenge = async (problem?: ProblemSearchResult) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await axiosPrivate.post("/challenge/invite", {
        recipientId: recipient.userId,
        problemTitleSlug: problem?.titleSlug, // Will be undefined for daily, which is correct
        problemTitle: problem?.title,
      });
      setSuccessMessage(
        `Challenge sent to ${recipient.displayName || recipient.leetcodeUsername}!`,
      );
      setTimeout(onClose, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to send challenge.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Challenge {recipient.displayName || recipient.leetcodeUsername}
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-400 mb-4">{successMessage}</p>
        )}

        <div className="bg-slate-700 p-4 rounded-md">
          <h3 className="font-semibold text-emerald-400">
            Daily Problem Challenge
          </h3>
          <p className="text-slate-300 my-2">
            {dailyProblem?.title || "Loading..."}
          </p>
          <button
            onClick={() => handleChallenge()}
            disabled={!dailyProblem || isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold py-2 rounded-md disabled:bg-slate-600"
          >
            Send Daily Challenge
          </button>
        </div>

        <div className="my-4 text-center text-slate-500">OR</div>

        <div className="bg-slate-700 p-4 rounded-md">
          <h3 className="font-semibold text-cyan-400">
            Custom Problem Challenge
          </h3>
          <input
            type="text"
            value={customProblemQuery}
            onChange={(e) => setCustomProblemQuery(e.target.value)}
            placeholder="Search for a problem..."
            className="w-full bg-slate-800 p-2 rounded-md my-2"
          />
          <div className="max-h-40 overflow-y-auto space-y-1">
            {searchResults.map((problem) => (
              <button
                key={problem.titleSlug}
                onClick={() => handleChallenge(problem)}
                disabled={isLoading}
                className="w-full text-left p-2 bg-slate-600 hover:bg-slate-500 rounded-md text-sm"
              >
                {problem.title}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-slate-400 hover:text-white w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChallengeSetupModal;
