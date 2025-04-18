import { MouseEventHandler } from "react";

export default function PromptSuggestionButton({
  text,
  onClick,
}: {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-neutral-500 p-2 m-2 text-sm rounded-xl hover:bg-neutral-800"
      aria-label="Prompt suggestion button"
    >
      {text}
    </button>
  );
}
