// hooks/useSessionMemory.ts
import { useEffect } from "react";
import type { Message } from "@ai-sdk/react";

const STORAGE_KEY = "guru_temp_chat";

export function useSessionMemory(messages: Message[], setMessages: (messages: Message[]) => void) {

  // Load from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    setMessages(stored ? JSON.parse(stored) : []);
  }, []);

  // Save to sessionStorage whenever messages update
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const clearMemory = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  };

  return { messages, setMessages, clearMemory };
}
