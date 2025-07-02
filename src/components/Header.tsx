import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Header({ clearMemory }: { clearMemory: () => void }) {
  return (
    <header className="fixed w-full p-4 flex justify-between bg-neutral-900/95 backdrop-blur-4xl shadow-2xl z-10">
      <div className=" text-white text-md px-4 py-2 font-bold">GURU</div>
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
