"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { useChat, Message } from "@ai-sdk/react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Bubble from "../components/Bubble";
import PromptSuggestionRow from "../components/PromptSuggestionRow";
import LoadingBubble from "../components/LoadingBubble";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function Home() {
  const [error, setError] = useState<Error | null>(null);

  const {
    append,
    status,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    data,
  } = useChat({
    api: "/api/chat",
    onError: (err) => {
      console.error("Frontend error:", err);
      setError(err);
    },
  });

  const noMessages = !messages || messages.length === 0;

  const handlePromptClick = (promptText: string) => {
    const msg: Message = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2),
      content: promptText,
      role: "user",
    };
    append(msg);
  };

  return (
    <main className="flex flex-row font-[family-name:var(--font-geist-mono)] m-0 p-0 bg-neutral-900 h-screen items-center justify-center w-full text-white">
      <section
        className={`flex flex-col justify-center gap-6 overflow-y-scroll h-full py-8 px-2 w-3/5 ${
          noMessages ? "" : "justify-end"
        }`}
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong>Error:</strong> {error.message}
            <button
              type="button"
              onClick={() => setError(null)}
              className="absolute top-0 right-0 px-2 py-1"
            >
              ×
            </button>
          </div>
        )}

        {noMessages ? (
          <>
            <div className="flex items-center justify-center">
              <h1 className="text-4xl">GURU</h1>
            </div>
            <PromptSuggestionRow onPromptClick={handlePromptClick} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={`message-${index}`} className="flex flex-col gap-2">
                {message.role === "user" ? (
                  <Bubble message={message} />
                ) : (
                  <div className="p-4 rounded-xl text-white">
                    <MarkdownRenderer content={message.content} />
                  </div>
                )}
              </div>
            ))}
            {(status === "submitted" || status === "streaming") && (
              <LoadingBubble />
            )}
          </>
        )}
        
        {/* input section */}
        <form onSubmit={handleSubmit} className="w-full flex gap-1.5 mt-4">
          <input
            type="text"
            className="flex-1 bg-neutral-700 text-white text-lg px-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-neutral-300 h-auto"
            placeholder="Ask GURU..."
            onChange={handleInputChange}
            value={input}
            disabled={status === "submitted" || status === "streaming"}
          />
          <button
            type="submit"
            aria-label={
              status === "submitted" || status === "streaming" ? "Stop" : "Send"
            }
            className={`rounded-full p-2 ${
              status === "submitted" || status === "streaming"
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-neutral-300 hover:bg-white"
            }`}
            disabled={status === "submitted" || status === "streaming"}
          >
            <SendRoundedIcon style={{ color: "black" }} />
          </button>
        </form>
      </section>
    </main>
  );
}
