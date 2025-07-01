import Navbar from "./components/ui/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Connect from "./pages/Dashboard";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="p-0 m-0 box-border">
      <div className="min-h-screen bg-[#002844] h-full w-full">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
