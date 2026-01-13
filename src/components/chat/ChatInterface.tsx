import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string, file?: File) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: file ? `${content}\n\n📎 Attached: ${file.name}` : content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response - this will be replaced with actual AI integration
    setTimeout(() => {
      const aiResponse = generateMockResponse(content, file);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse,
        },
      ]);
      setIsTyping(false);
    }, 1500);
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
          {isTyping && (
            <ChatMessage role="assistant" content="" isTyping />
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50">
        <ChatInput
          onSend={handleSend}
          disabled={isTyping}
          placeholder="Paste job description or type a message..."
        />
      </div>
    </div>
  );
}

function generateMockResponse(content: string, file?: File): string {
  const lowerContent = content.toLowerCase();

  if (file) {
    return `I've received your file: **${file.name}**

I'm analyzing the document now. This will help me understand the job requirements better.

While I process this, could you tell me:
1. How many years of experience do you have in this field?
2. What's your current job title?`;
  }

  if (lowerContent.includes("software") || lowerContent.includes("developer") || lowerContent.includes("engineer")) {
    return `I can see you're targeting a **technical role**. That's great!

I've identified some key requirements from what you've shared. To create a CV that stands out, I need to know more about you:

**Let's start with the basics:**
What's your full name?`;
  }

  if (lowerContent.includes("manager") || lowerContent.includes("lead") || lowerContent.includes("director")) {
    return `This looks like a **leadership position**. I'll make sure to highlight your management experience and achievements.

To tailor your CV perfectly, I'll need some information:

**First question:**
What's your full name?`;
  }

  // Default response for job descriptions
  if (content.length > 100) {
    return `I've analyzed the job description you provided. Here's what I found:

**Key Requirements Identified:**
• Technical skills and qualifications
• Experience level expectations
• Core responsibilities

Now, let me gather your information to create a tailored CV.

**What's your full name?**`;
  }

  return `Thanks for that information!

To create the best CV for you, I have a few more questions.

Could you share the **job description** you're targeting? You can:
• Paste it directly here
• Upload a file using the 📎 button

This helps me optimize your CV with the right keywords and focus.`;
}
