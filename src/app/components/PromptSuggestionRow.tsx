import PromptSuggestionButton from "./PromptSuggestionButton";

export default function PromptSuggestionRow({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void;
}) {
  const prompts = [
    "Can yoga help with weight loss?",
    "How can I improve my flexibility with yoga?",
    "What are some quick yoga routines for busy people?",
    "What are the benefits of daily yoga practice?",
    "What are the best yoga poses for beginners?",
  ];
  return (
    <div className="flex flex-row">
      <div className="flex items-center justify-center flex-wrap">
        {prompts.map((prompt, index) => (
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
