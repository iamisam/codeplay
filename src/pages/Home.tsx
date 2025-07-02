// Home.tsx
import React from "react";
import Navbar from "../components/ui/Navbar";
import LeetCodeStats from "../components/ui/LeetCodeStats";
import Cardshadow from "../components/ui/Cardshadow";

const userData = {
  username: "kriti_chandra",
  easy: 120,
  medium: 80,
  hard: 20,
  total: 220,
};

const Home = () => {
  return (
    <div className="p-4 space-y-6 bg-[#f5fefc] min-h-screen">
      <h1 className="text-2xl font-bold text-center text-green-600">
        🏆 Welcome Back, {userData.username}!
      </h1>
      <LeetCodeStats user={userData} />
      <Cardshadow />
    </div>
  );
};

export default Home;
