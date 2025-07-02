// Connect.tsx
import React from 'react';
import Navbar from '../components/ui/Navbar';

const you = { username: 'you', easy: 120, medium: 80, hard: 20 };
const friend = { username: 'priya', easy: 100, medium: 90, hard: 30 };

const Connect = () => {
  return (
    <div className="p-4 bg-[#fef9f2] min-h-screen">
      <Navbar />
      <h2 className="text-xl font-bold mb-4 text-orange-600">👥 Compare With Priya</h2>
      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow">
        <div>
          <h3 className="font-bold text-green-600">{you.username} (You)</h3>
          <p>Easy: {you.easy}</p>
          <p>Medium: {you.medium}</p>
          <p>Hard: {you.hard}</p>
        </div>
        <div>
          <h3 className="font-bold text-blue-600">{friend.username}</h3>
          <p>Easy: {friend.easy}</p>
          <p>Medium: {friend.medium}</p>
          <p>Hard: {friend.hard}</p>
        </div>
      </div>
    </div>
  );
};

export default Connect;
