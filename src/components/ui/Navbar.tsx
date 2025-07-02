// Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white p-4 shadow-md flex justify-between items-center">
      <Link to="/" className="font-bold text-xl text-green-600">
        CodePlay
      </Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-green-500">
          🏠 Home
        </Link>
        <Link to="/connect" className="hover:text-green-500">
          👥 Friends
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
