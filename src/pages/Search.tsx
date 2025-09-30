import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { Link } from "react-router-dom";

interface SearchResult {
  displayName: string;
  leetcodeUsername: string;
  ranking: number;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Debounce effect: wait 300ms after user stops typing to search
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setIsLoading(true);
        axiosPrivate
          .get(`/user/search?query=${query}`)
          .then((response) => setResults(response.data))
          .catch(console.error)
          .finally(() => setIsLoading(false));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Find Users</h1>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by display name..."
            className="w-full bg-slate-800 border border-slate-700 text-white p-4 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg
            className="w-5 h-5 text-slate-400 absolute top-1/2 left-4 -translate-y-1/2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="mt-8 space-y-4">
          {isLoading && (
            <p className="text-center text-slate-400">Searching...</p>
          )}
          {!isLoading && results.length === 0 && query && (
            <p className="text-center text-slate-400">No users found.</p>
          )}
          {results.map((user) => (
            <Link
              // Use displayName OR leetcodeUsername as the link parameter
              to={`/user/${user.displayName || user.leetcodeUsername}`}
              key={user.leetcodeUsername} // Use a guaranteed unique key
              className="flex items-center justify-between bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div>
                {/* Display leetcodeUsername as a fallback if displayName is not set */}
                <p className="font-bold text-emerald-400">
                  {user.displayName || user.leetcodeUsername}
                </p>
                <p className="text-sm text-slate-400">
                  @{user.leetcodeUsername}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Rank</p>
                <p className="font-semibold">
                  #{user.ranking.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
