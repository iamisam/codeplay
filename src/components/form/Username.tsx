import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Username = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) navigate(`/home?user=${username}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-violet-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-6">LeetCode Gamifier</h1>
      <form onSubmit={handleSubmit} className="flex gap-4 bg-white p-4 rounded shadow text-black">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter LeetCode username"
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default Username;
