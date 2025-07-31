import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Header({ clearMemory }: { clearMemory: () => void }) {
  return (
    <header className="fixed w-full p-2 sm:p-3 md:p-4 flex justify-between items-center bg-neutral-900/90 backdrop-blur-sm shadow-2xl z-10">
      <a
        href="https://amzn.in/d/h5P2Sak"
        type="button"
        className="bg-neutral-700 text-white text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-3xl hover:bg-neutral-600 transition-colors duration-250 flex items-center"
      >
        <ShoppingCartIcon
          sx={{
            fontSize: 14,
            marginRight: 0.5,
            "@media (min-width: 640px)": {
              fontSize: 16,
              marginRight: 1,
            },
          }}
        />
        <span className="hidden sm:inline">Get eBook</span>
        <span className="sm:hidden">eBook</span>
      </a>
      <div className="text-white text-sm sm:text-base md:text-lg px-2 sm:px-3 md:px-4 py-1 sm:py-2 font-bold">
        GURU
      </div>
      <button
        type="button"
        className="bg-neutral-700 text-white text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-3xl hover:bg-red-800 transition-colors duration-250 flex items-center"
        onClick={clearMemory}
      >
        <DeleteIcon
          sx={{
            fontSize: 14,
            marginRight: 0.5,
            "@media (min-width: 640px)": {
              fontSize: 16,
              marginRight: 1,
            },
          }}
        />
        <span className="hidden sm:inline">Clear Chat</span>
        <span className="sm:hidden">Clear</span>
      </button>
    </header>
  );
}
