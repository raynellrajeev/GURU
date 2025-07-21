import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Header({ clearMemory }: { clearMemory: () => void }) {
  return (
    <header className="fixed w-full p-4 flex justify-between bg-neutral-900/90 backdrop-blur-sm shadow-2xl z-10">
      <a
        href="https://amzn.in/d/h5P2Sak"
        type="button"
        className=" bg-neutral-700 text-white text-sm px-4 py-2 rounded-3xl hover:bg-neutral-600 mt-1"
      >
        <ShoppingCartIcon
          sx={{
            fontSize: 16,
            marginRight: 1,
          }}
        />
        Get eBook
      </a>
      <div className=" text-white text-md px-4 py-2 font-bold">GURU</div>
      <button
        type="button"
        className=" bg-neutral-700 text-white text-sm px-4 py-2 rounded-3xl hover:bg-red-800"
        onClick={clearMemory}
      >
        <DeleteIcon
          sx={{
            fontSize: 16,
            marginRight: 1,
          }}
        />
        Clear Chat
      </button>
    </header>
  );
}
