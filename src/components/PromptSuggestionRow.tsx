"use client";

import { useState, useEffect } from "react";
import PromptSuggestionButton from "./PromptSuggestionButton";

export default function PromptSuggestionRow({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void;
}) {
  const allPrompts = [
    "Which mudras help reduce stress and improve mental clarity?",
    "Explain the link between mudras and the five elements in the body.",
    "How does the Prana Mudra affect energy flow and vitality?",
    "Describe the proper posture and breathing techniques for mudra practice.",
    "What is the role of Gyan Mudra in enhancing concentration and memory?",
    "How can Varuna Mudra contribute to skin hydration and health?",
    "Which mudras are effective for managing joint pain and inflammation?",
    "What are the potential benefits of Bhairava Mudra on anxiety and kundalini energy?",
    "How do mudras influence the nervous system and emotional states?",
    "What are the scientific perspectives on the effectiveness of yoga mudras?",
  ];

  function getRandomElements<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const [randomPrompts, setRandomPrompts] = useState<string[]>([]);

  useEffect(() => {
    setRandomPrompts(getRandomElements(allPrompts, 3));
  }, []);

  return (
    <div className="flex flex-row">
      <div className="flex items-center justify-center flex-wrap">
        {randomPrompts.map((prompt, index) => (
          <PromptSuggestionButton
            key={`suggestion-${index}`}
            text={prompt}
            onClick={() => onPromptClick(prompt)}
          />
        ))}
      </div>
    </div>
  );
}
