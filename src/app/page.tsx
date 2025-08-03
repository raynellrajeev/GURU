"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useSessionMemory } from "../hooks/useSessionMemory";
import { useChat, Message } from "@ai-sdk/react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Bubble from "../components/Bubble";
import PromptSuggestionRow from "../components/PromptSuggestionRow";
import LoadingBubble from "../components/LoadingBubble";
import MarkdownRenderer from "../components/MarkdownRenderer";
import Header from "../components/Header";
import Divider from "@mui/material/Divider";

export default function Home() {
  const {
    append,
    status,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
  } = useChat({ api: "/api/chat" });

  const { clearMemory } = useSessionMemory(messages, setMessages);
  const noMessages = !messages || messages.length === 0;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    <main className="flex flex-col h-screen w-full bg-neutral-800 text-white font-[family-name:var(--font-geist-mono)]">
      {!noMessages && <Header clearMemory={clearMemory} />}

      {noMessages ? (
        // Centered layout for initial screen
        <div className="flex flex-col justify-center items-center grow w-full px-4 py-6">
          <div className="text-4xl font-semibold mb-6">GURU</div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <PromptSuggestionRow onPromptClick={handlePromptClick} />
          </motion.div>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl flex gap-1.5 mt-10"
          >
            <input
              type="text"
              className="flex-1 bg-neutral-700 text-white text-lg px-4 py-2 rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-800"
              placeholder="Ask GURU..."
              onChange={handleInputChange}
              value={input}
              disabled={status === "submitted" || status === "streaming"}
            />
            <button
              title="Send"
              type="submit"
              className={`rounded-full p-2 ${
                status === "submitted" || status === "streaming"
                  ? "bg-neutral-500 cursor-not-allowed"
                  : "bg-purple-900 hover:bg-purple-800"
              } transition-colors duration-250`}
              disabled={status === "submitted" || status === "streaming"}
            >
              <SendRoundedIcon style={{ color: "white" }} />
            </button>
          </form>
        </div>
      ) : (
        // Chat layout with scrollable messages and input at bottom
        <>
          <div
            ref={scrollRef}
            className="flex flex-col grow overflow-y-auto px-4 py-6 w-full max-w-5xl mx-auto pt-20"
          >
            {messages.map((message, index) => (
              <div key={`message-${index}`} className="flex flex-col gap-2">
                {message.role === "user" ? (
                  <Bubble message={message} />
                ) : (
                  <div className="p-4 rounded-xl text-white">
                    <MarkdownRenderer content={message.content} />
                    <Divider
                      variant="middle"
                      sx={{
                        margin: "40px",
                        backgroundColor: "#404040",
                        height: "2px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
            {(status === "submitted" || status === "streaming") && (
              <LoadingBubble />
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl mx-auto px-4 py-3 flex gap-1.5"
          >
            <input
              type="text"
              className="flex-1 bg-neutral-700 text-white text-lg px-4 py-2 rounded-3xl shadow-2xl focus:outline-none focus:ring-1 focus:ring-purple-800"
              placeholder="Ask GURU..."
              onChange={handleInputChange}
              value={input}
              disabled={status === "submitted" || status === "streaming"}
            />
            <button
              title="Send"
              type="submit"
              className={`rounded-full p-2 ${
                status === "submitted" || status === "streaming"
                  ? "bg-neutral-500 cursor-not-allowed"
                  : "bg-purple-900 hover:bg-purple-800"
              }`}
              disabled={status === "submitted" || status === "streaming"}
            >
              <SendRoundedIcon style={{ color: "white" }} />
            </button>
          </form>
        </>
      )}
    </main>
  );
}
