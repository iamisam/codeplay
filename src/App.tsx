import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChallengeProvider } from "./context/ChallengeContext";
import Navbar from "./components/ui/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import ComparePage from "./pages/ComparePage";
import FriendsPanel from "./components/ui/FriendsPanel";
import UserProfilePage from "./pages/UserProfile";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ChallengeRoomPage from "./pages/ChallengeRoomPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { FriendsProvider } from "./context/FriendsContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <FriendsProvider>
          <ChallengeProvider>
            <Navbar />
            <FriendsPanel />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/search" element={<Search />} />
                <Route
                  path="/user/:displayName"
                  element={<UserProfilePage />}
                />
                <Route
                  path="/compare/:otherUserIdentifier"
                  element={<ComparePage />}
                />
                <Route
                  path="/change-password"
                  element={<ChangePasswordPage />}
                />
                <Route
                  path="/challenge/:challengeId"
                  element={<ChallengeRoomPage />}
                />
              </Route>
            </Routes>
          </ChallengeProvider>
        </FriendsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
