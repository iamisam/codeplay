// LeetCodeStats.tsx
import React from 'react';

const LeetCodeStats = ({ user }: { user: any }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-green-700">{user.username}'s Stats</h2>
      <ul className="mt-2">
        <li>🟢 Easy: {user.easy}</li>
        <li>🟠 Medium: {user.medium}</li>
        <li>🔴 Hard: {user.hard}</li>
        <li>📊 Total Solved: {user.total}</li>
      </ul>
    </div>
  );
};

export default LeetCodeStats;
