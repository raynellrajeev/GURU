import { Message } from "@ai-sdk/react";

export default function Bubble({ message }: { message: Message }) {
  const { content, role } = message;
  return (
    <div
      className={`m-2 p-2 text-sm border-0 px-2.5  overflow-y-scroll rounded-xl ml-auto ${
        role === "user" &&
        "rounded-br-none text-right bg-neutral-700 text-white"
      } ${
        role === "assistant" && "text-justify"
      }`}
    >
      {content}
    </div>
  );
}
