import { Message } from "@ai-sdk/react";

export default function Bubble({ message }: { message: Message }) {
  const { content, role } = message;
  return (
    <div
      className={`m-2 p-2 text-sm border-0 px-2.5 overflow-x-hidden overflow-y-scroll ${
        role === "user" &&
        "rounded-xl rounded-br-none ml-auto text-right bg-neutral-700 text-white"
      } ${
        role === "assistant" && "rounded-xl text-justify rounded-bl-none ml-auto"
      }`}
    >
      {content}
    </div>
  );
}
