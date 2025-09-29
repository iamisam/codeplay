import { NavLink, Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useFriends } from "../../hooks/useFriends";

const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const { togglePanel } = useFriends();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Style for active NavLink
  const activeLinkStyle = {
    backgroundColor: "rgba(74, 222, 128, 0.1)", // A subtle emerald background
    color: "#34d399", // Brighter emerald text
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <Link
          to={accessToken ? "/dashboard" : "/"}
          className="flex items-center gap-2 text-xl font-bold text-slate-100"
        >
          <svg
            className="h-6 w-6 text-emerald-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21v-2.5M17 14l-2-1m2 1l-2 1m-2-1v2.5"
            />
          </svg>
          <span className="font-mono">
            <span className="text-slate-500">&lt;</span>
            <span className="text-slate-200">CodePlay</span>
            <span className="text-slate-500">/&gt;</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-2 md:flex">
          {accessToken && (
            <>
              <NavLink
                to="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-emerald-400"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/search"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-emerald-400"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
              >
                Search
              </NavLink>
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {accessToken ? (
            <>
              <button
                onClick={togglePanel}
                className="text-slate-400 hover:text-white"
              >
                {/* Friends Icon */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97m5.176 5.97h3.333a2 2 0 002-2v-1a2 2 0 00-2-2h-3.333a2 2 0 00-2 2v1a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="text-slate-400 transition-colors hover:text-white"
                aria-label="Settings"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
