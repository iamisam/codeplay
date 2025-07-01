// Cardshadow.tsx
import React, { useState } from 'react';

const Cardshadow = () => {
  const [started, setStarted] = useState(false);

  return (
    <div className="bg-yellow-100 p-4 rounded-xl shadow text-center">
      <h2 className="text-lg font-bold">🔥 Daily Challenge</h2>
      <p>Solve "Valid Anagram" in 20 minutes!</p>
      {!started ? (
        <button
          className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => setStarted(true)}
        >
          Start
        </button>
      ) : (
        <p className="text-red-500 mt-2">⏳ Timer started...</p>
      )}
    </div>
  );
};

export default Cardshadow;
