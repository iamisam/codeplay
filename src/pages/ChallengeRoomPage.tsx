import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import Editor from "@monaco-editor/react";
import useAuth from "../hooks/useAuth";

// --- Type Definitions ---
interface ProblemDetails {
  title: string;
  content: string; // This will be HTML content
}

interface ChallengeDetails {
  id: number;
  problemTitleSlug: string;
  challengerId: number;
  challenger: { displayName: string | null; leetcodeUsername: string };
  recipient: { displayName: string | null; leetcodeUsername: string };
}

interface JudgeResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string };
}

interface WinnerInfo {
  displayName: string | null;
  leetcodeUsername: string;
}

const languageMap: {
  [key: string]: { id: number; name: string; defaultCode: string };
} = {
  python: { id: 71, name: "Python", defaultCode: "# Your Python code here" },
  java: {
    id: 62,
    name: "Java",
    defaultCode: "class Solution {\n    // Your Java code here\n}",
  },
  cpp: { id: 54, name: "C++", defaultCode: "// Your C++ code here" },
};

const ChallengeRoomPage = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
  const [problem, setProblem] = useState<ProblemDetails | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState<JudgeResult[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [opponentFinished, setOpponentFinished] = useState(false);
  const [winner, setWinner] = useState<WinnerInfo | null>(null);
  const pollingInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!challengeId) return;

    // Fetch initial challenge and problem details
    axiosPrivate
      .get(`/challenge/${challengeId}`)
      .then((res) => {
        setChallenge(res.data.challenge);
        setProblem(res.data.problemDetails);
        setCode(languageMap[language].defaultCode);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    // Start polling for status updates
    pollingInterval.current = setInterval(async () => {
      try {
        const res = await axiosPrivate.get(`/challenge/${challengeId}/status`);
        if (res.data.status === "completed") {
          setOpponentFinished(true);
          setWinner(res.data.winner);
          if (pollingInterval.current) clearInterval(pollingInterval.current);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup: stop polling when the component unmounts
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [challengeId, language]);

  const handleSubmit = async () => {
    if (!challengeId) return;
    setIsSubmitting(true);
    setOutput(null);
    try {
      const response = await axiosPrivate.post(
        `/challenge/${challengeId}/submit`,
        {
          languageId: languageMap[language].id,
          code,
        },
      );
      setOutput(response.data.results);
      if (response.data.allPassed) {
        // If submission is correct, the polling will pick up the win
        // Or we can update state immediately for a faster UI response
        setOpponentFinished(true);
        setWinner(user); // The current user is the winner
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="text-center text-white p-10">Loading challenge...</div>
    );
  if (!challenge || !problem)
    return (
      <div className="text-center text-red-500 p-10">
        Could not load challenge details.
      </div>
    );

  const opponent =
    challenge.challengerId === user?.userId
      ? challenge.recipient
      : challenge.challenger;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900 text-white">
      {/* Opponent Finished Modal */}
      {opponentFinished && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-3xl font-bold text-yellow-400">
            Challenge Over!
          </h2>
          <p className="mt-2 text-lg">
            {winner?.displayName || winner?.leetcodeUsername} has finished the
            problem.
          </p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/challenges")}
              className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-md transition-colors"
            >
              View Results
            </button>
            <button
              onClick={() => setOpponentFinished(false)}
              className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-md transition-colors"
            >
              Continue Solving
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 bg-slate-800 p-2 px-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">{problem.title}</h1>
          <p className="text-xs text-slate-400">
            vs. {opponent.displayName || opponent.leetcodeUsername}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-700 rounded-md p-1 text-xs"
          >
            {Object.entries(languageMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600 font-semibold py-1 px-4 rounded-md text-sm disabled:bg-slate-600"
          >
            {isSubmitting ? "Judging..." : "Submit"}
          </button>
        </div>
      </header>

      {/* Main Content (Split Screen) */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2 p-2 overflow-hidden">
        {/* Problem Description */}
        <section className="bg-slate-800 rounded-md p-4 overflow-y-auto prose prose-invert prose-sm max-w-full">
          <div dangerouslySetInnerHTML={{ __html: problem.content }} />
        </section>

        {/* Code Editor and Output */}
        <section className="flex flex-col gap-2">
          <div className="flex-grow h-1/2">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
          <div className="flex-shrink-0 h-1/2 bg-slate-800 rounded-md p-4 overflow-y-auto font-mono text-xs">
            <h3 className="font-bold mb-2 text-slate-400">Output</h3>
            {output ? (
              output.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md mb-2 ${result.status.id === 3 ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}
                >
                  <p>
                    <strong>Test Case {index + 1}:</strong>{" "}
                    {result.status.description}
                  </p>
                  {result.stderr && (
                    <pre className="whitespace-pre-wrap mt-1">
                      Error: {result.stderr}
                    </pre>
                  )}
                  {result.compile_output && (
                    <pre className="whitespace-pre-wrap mt-1">
                      Compile Error: {result.compile_output}
                    </pre>
                  )}
                  {result.stdout && (
                    <pre className="whitespace-pre-wrap mt-1">
                      Output: {result.stdout}
                    </pre>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-500">
                Submit your code to see the results.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChallengeRoomPage;
