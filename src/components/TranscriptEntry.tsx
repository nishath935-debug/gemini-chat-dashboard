import { Message } from "@/lib/chat";

interface TranscriptEntryProps {
  message: Message;
  isLoading?: boolean;
}

const TranscriptEntry = ({ message, isLoading }: TranscriptEntryProps) => {
  if (message.role === "user") {
    return (
      <div className="mb-6">
        <span className="font-mono text-primary mr-2 select-none">&gt;</span>
        <span className="font-serif text-foreground">{message.content}</span>
      </div>
    );
  }

  return (
    <div className="mb-6 pl-4">
      {message.content ? (
        <p className="font-serif text-foreground whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      ) : isLoading ? (
        <span className="cursor-blink font-mono text-lg select-none">█</span>
      ) : null}
    </div>
  );
};

export default TranscriptEntry;
