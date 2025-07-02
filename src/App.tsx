import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Connect from "./pages/Connect"; // You may rename this to Dashboard later
import NoPage from "./pages/NoPage"; // Or NoPage if you're keeping your version
import Navbar from "./components/ui/Navbar";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;
