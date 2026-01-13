import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { streamChat } from "@/lib/ai-chat";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `Welcome to CV Craft! 👋

I'm here to help you create a tailored, professional CV optimized for your target job.

**To get started, you can:**
• Paste a job description below
• Upload a job description file (PDF, DOC, DOCX)
• Upload your existing CV for me to enhance

What position are you applying for?`,
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = async (content: string, file?: File) => {
    let userContent = content;
    
    // Handle file upload - read file content
    if (file) {
      try {
        const fileContent = await readFileContent(file);
        userContent = content 
          ? `${content}\n\n--- Uploaded File: ${file.name} ---\n${fileContent}`
          : `Here's the content from my uploaded file (${file.name}):\n\n${fileContent}`;
      } catch (error) {
        toast({
          title: "File Error",
          description: "Could not read the uploaded file. Please try pasting the content instead.",
          variant: "destructive",
        });
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: file && content ? `${content}\n\n📎 Attached: ${file.name}` : (file ? `📎 Uploaded: ${file.name}` : content),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    // Prepare messages for API (excluding the welcome message, using actual content)
    const apiMessages = [
      ...messages.filter(m => m.id !== "welcome").map(m => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: userContent }
    ];

    let assistantContent = "";

    await streamChat({
      messages: apiMessages,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.id.startsWith("streaming-")) {
            return prev.map((m, i) => 
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { 
            id: `streaming-${Date.now()}`, 
            role: "assistant", 
            content: assistantContent 
          }];
        });
      },
      onDone: () => {
        setIsStreaming(false);
        // Finalize the message ID
        setMessages((prev) => 
          prev.map((m, i) => 
            i === prev.length - 1 && m.role === "assistant" 
              ? { ...m, id: `final-${Date.now()}` } 
              : m
          )
        );
      },
      onError: (error) => {
        setIsStreaming(false);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[70vh] glass-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">CV Builder Assistant</h3>
        <p className="text-xs text-muted-foreground">Powered by AI</p>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <ChatMessage role="assistant" content="" isTyping />
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50">
        <ChatInput
          onSend={handleSend}
          disabled={isStreaming}
          placeholder="Paste job description or type a message..."
        />
      </div>
    </div>
  );
}

async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        resolve(content);
      } else {
        reject(new Error("Could not read file"));
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file);
  });
}
