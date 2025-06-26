import React from "react";

export default function Header({ clearMemory }: { clearMemory: () => void }) {
  return (
    <header className="relative w-full p-4 flex justify-between">
      <div className=" text-white text-md px-4 py-2 font-bold">
        GURU
      </div>
      <button
        type="button"
        className=" bg-neutral-700 text-white text-sm px-4 py-2 rounded-3xl hover:bg-red-800"
        onClick={clearMemory}
      >
        Clear Chat
      </button>
    </header>
  );
}
