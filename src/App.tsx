import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/ui/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import FriendsPanel from "./components/ui/FriendsPanel";
import UserProfilePage from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { FriendsProvider } from "./context/FriendsContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <FriendsProvider>
          <Navbar />
          <FriendsPanel />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<Search />} />
              <Route path="/user/:displayName" element={<UserProfilePage />} />
              {/* Add other protected routes here */}
            </Route>
          </Routes>
        </FriendsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
