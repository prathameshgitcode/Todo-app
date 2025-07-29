import { useState } from "react";
import { useTodoContext } from "../contexts";
import { FiPlus } from "react-icons/fi";

const TodoHeader = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");

  const { addTodo } = useTodoContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    const letterCount = inputValue?.replace(/[^a-zA-Z]/g, "")?.length;

    if (inputValue?.trim() === "") {
      setInputErrorMessage("Todo message cannot be empty!");
      return;
    }

    if (letterCount < 3) {
      setInputErrorMessage("Please enter at least 3 letters");
      return;
    }

    addTodo({
      id: Date?.now(),
      todo: inputValue,
      completed: false,
      createdAt: new Date()?.toISOString(),
    });

    setInputValue("");
    setInputErrorMessage("");
  };

  const letterCount = inputValue?.replace(/[^a-zA-Z]/g, "")?.length;
  const isButtonDisabled = letterCount < 3 || inputValue?.trim() === "";

  return (
    <header className="mb-10">
      <h1 className="text-white font-bold text-center text-3xl md:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Task Maintainer (SILKS)
      </h1>
      <p className="text-center text-blue-200 mb-8">
        Organize your tasks efficiently
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col items-center w-full max-w-2xl mx-auto px-4"
      >
        <div className="relative w-full flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputErrorMessage("");
            }}
            onFocus={() => setInputErrorMessage("")}
            placeholder="Write your task (minimum 3 letters)..."
            className={`w-full p-4 ps-6 bg-white/10 rounded-s-lg outline-none transition-all duration-200 text-white placeholder-white/50 focus:ring-2 ${
              inputErrorMessage === ""
                ? "focus:ring-blue-500/50 border-white/20"
                : "focus:ring-red-500/50 border-red-400"
            } border`}
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`flex items-center justify-center gap-2 py-4 px-6 rounded-e-lg outline-none transition-all duration-200 ${
              isButtonDisabled
                ? "bg-gray-500/30 cursor-not-allowed text-gray-400"
                : "bg-green-600 hover:bg-green-700 text-white shadow-lg"
            }`}
          >
            <FiPlus className="text-2xl !font-bold" />
            <span className="font-bold text-lg">ADD TASK</span>
          </button>
        </div>

        <div className="flex justify-between w-full mt-2 px-2">
          {inputErrorMessage ? (
            <p className="text-red-400 text-sm">{inputErrorMessage}</p>
          ) : (
            <div className="h-5"></div>
          )}
          <p
            className={`text-xs ${
              letterCount < 3 ? "text-yellow-400" : "text-green-400"
            }`}
          >
            Letters: {letterCount}/3
          </p>
        </div>
      </form>
    </header>
  );
};

export default TodoHeader;
