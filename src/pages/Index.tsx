import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Message, streamChat } from "@/lib/chat";
import TranscriptEntry from "@/components/TranscriptEntry";
import CommandLine from "@/components/CommandLine";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages([...allMessages, { role: "assistant", content: "" }]);
    setIsLoading(true);

    let assistantContent = "";

    try {
      await streamChat({
        messages: allMessages,
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: assistantContent };
            return updated;
          });
        },
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast.error(error);
          setIsLoading(false);
          setMessages((prev) => prev.slice(0, -1));
        },
      });
    } catch {
      toast.error("Failed to connect to AI service");
      setIsLoading(false);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Transcript area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-muted-foreground font-mono text-sm">
              <p className="mb-2">GEMINI AI DASHBOARD v1.0</p>
              <p className="mb-2">—————————————————————</p>
              <p className="mb-4">Ready. Enter a prompt below.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <TranscriptEntry
              key={i}
              message={msg}
              isLoading={isLoading && i === messages.length - 1 && msg.role === "assistant"}
            />
          ))}
        </div>
      </div>

      {/* Command line */}
      <CommandLine onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default Index;
