import { useState, useRef, useEffect } from "react";

interface CommandLineProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const CommandLine = ({ onSend, disabled }: CommandLineProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-background px-6 py-4">
      <div className="flex items-start gap-3 max-w-4xl mx-auto">
        <span className="font-mono text-primary mt-2.5 select-none text-lg">&gt;</span>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Enter prompt..."
          rows={1}
          className="flex-1 bg-transparent font-serif text-foreground placeholder:text-muted-foreground resize-none outline-none border-none py-2 text-base leading-relaxed"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="font-mono text-sm px-4 py-2 border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommandLine;
