import React, { useState, type FormEvent } from "react";

interface myFormProps {
  onSubmit: (username: string) => void;
}

const StringInputForm: React.FC<myFormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(inputValue);
  };
  return (
    <form
      action="/user/dashboard"
      onSubmit={handleSubmit}
      className="bg-indigo-900 rounded-md text-orange-100 p-4 m-4 h-110 w-80"
    >
      <label className="text-white font-semibold m-2" htmlFor="stringInput">
        Enter username:&nbsp;&nbsp;
      </label>
      <input
        className="text-teal-100 border-white p-2 border-1 m-2"
        placeholder="Enter your Leetcode Username"
        type="text"
        id="stringInput"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="text-black p-1 border-black m-2 border-black hover:border-2 bg-yellow-400 p-2 hover:font-bold not-hover:font-normal bg-[#fff]"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default StringInputForm;
