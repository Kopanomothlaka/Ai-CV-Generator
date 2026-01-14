import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { streamChat } from "@/lib/ai-chat";
import { useToast } from "@/hooks/use-toast";
import { parseCVFromText, CVData } from "@/lib/pdf-generator";
import { parseFile, isValidCVFile } from "@/lib/file-parser";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onCVUpdate?: (data: CVData | null) => void;
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

export function ChatInterface({ onCVUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Parse CV from all assistant messages whenever they change
  const updateCVPreview = useCallback((msgs: Message[]) => {
    if (!onCVUpdate) return;
    
    // Find the latest assistant message that contains CV content
    const assistantMessages = msgs.filter(m => m.role === "assistant" && m.id !== "welcome");
    for (let i = assistantMessages.length - 1; i >= 0; i--) {
      const cvData = parseCVFromText(assistantMessages[i].content);
      if (cvData) {
        onCVUpdate(cvData);
        return;
      }
    }
    onCVUpdate(null);
  }, [onCVUpdate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    updateCVPreview(messages);
  }, [messages, updateCVPreview]);

  const handleSend = async (content: string, file?: File) => {
    let userContent = content;
    let fileDisplayName = "";
    
    // Handle file upload - parse file content
    if (file) {
      const validation = isValidCVFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      try {
        toast({
          title: "Processing file...",
          description: `Extracting content from ${file.name}`,
        });
        
        const fileContent = await parseFile(file);
        fileDisplayName = file.name;
        
        // Detect if it's a CV upload
        const isCVUpload = fileContent.toLowerCase().includes('experience') || 
                          fileContent.toLowerCase().includes('education') ||
                          fileContent.toLowerCase().includes('skills') ||
                          fileContent.toLowerCase().includes('resume') ||
                          fileContent.toLowerCase().includes('cv');
        
        if (isCVUpload && !content) {
          userContent = `I'm uploading my existing CV for you to analyze and improve. Please review it and suggest enhancements to make it more professional and ATS-optimized. Here's my CV content:\n\n${fileContent}`;
        } else if (content) {
          userContent = `${content}\n\n--- Content from ${file.name} ---\n${fileContent}`;
        } else {
          userContent = `Here's the content from my uploaded file (${file.name}):\n\n${fileContent}`;
        }
        
        toast({
          title: "File processed",
          description: `Successfully extracted content from ${file.name}`,
        });
      } catch (error) {
        console.error("File parsing error:", error);
        toast({
          title: "File Error",
          description: error instanceof Error ? error.message : "Could not read the uploaded file. Please try a different format or paste the content instead.",
          variant: "destructive",
        });
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: file && content ? `${content}\n\n📎 Attached: ${fileDisplayName}` : (file ? `📎 Uploaded: ${fileDisplayName}\n\nAnalyzing your CV...` : content),
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
