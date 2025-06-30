import React, { useState, type FormEvent } from "react";

const StringInputForm: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch(`https://alfa-leetcode-api.onrender.com/${inputValue}`)
      .then((response) => response)
      .then((e) => e.json())
      .then((e) => console.log(e))
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="text-white font-semibold" htmlFor="stringInput">
        Enter a string:&nbsp;&nbsp;
      </label>
      <input
        className="text-teal-100 border-white p-2 border-1"
        placeholder="Enter your Leetcode Username"
        type="text"
        id="stringInput"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="text-black p-1 border-black ml-2 border-black hover:border-2 bg-yellow-400 p-2 hover:font-bold not-hover:font-normal bg-[#fff]"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default StringInputForm;
