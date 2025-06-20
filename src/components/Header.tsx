import React from "react";

export default function Header(props: { clearMemory: () => void }) {
  return (
    <header className="bg-neutral-900">
      <button
        type="button"
        className="absolute top-4 right-4 bg-neutral-700 text-white text-sm px-4 py-2 rounded-2xl hover:bg-red-800"
        onClick={props.clearMemory}
      >
        Clear Chat
      </button>
      <div className="absolute top-4 left-4 text-white text-md px-4 py-2 font-bold">
        GURU
      </div>
    </header>
  );
}