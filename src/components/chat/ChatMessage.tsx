import { cn } from "@/lib/utils";
import { User, Bot, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseCVFromText, downloadCV } from "@/lib/pdf-generator";
import { useMemo } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

export function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  const isUser = role === "user";

  // Check if this message contains a CV
  const cvData = useMemo(() => {
    if (role !== "assistant" || !content) return null;
    
    // Look for CV markers in the content
    const hasCV = 
      (content.includes("Professional Summary") || content.includes("PROFESSIONAL SUMMARY")) &&
      (content.includes("Skills") || content.includes("SKILLS")) &&
      (content.includes("Experience") || content.includes("EXPERIENCE"));
    
    if (!hasCV) return null;
    
    return parseCVFromText(content);
  }, [role, content]);

  const handleDownload = () => {
    if (cvData) {
      downloadCV(cvData, `${cvData.name.replace(/\s+/g, '_')}_CV.pdf`);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex flex-col gap-2 max-w-[75%]">
        <div
          className={cn(
            isUser ? "chat-bubble-user" : "chat-bubble-ai"
          )}
        >
          {isTyping ? (
            <div className="flex gap-1 py-1">
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-soft" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-soft" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-soft" style={{ animationDelay: "300ms" }} />
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert">
              {formatMarkdown(content)}
            </div>
          )}
        </div>
        
        {cvData && (
          <Button
            onClick={handleDownload}
            className="self-start gap-2 bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Download className="w-4 h-4" />
            Download CV as PDF
          </Button>
        )}
      </div>
    </div>
  );
}

// Simple markdown formatter
function formatMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  
  // Split by lines and process
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, index) => {
    let processed: React.ReactNode = line;
    
    // Headers
    if (line.startsWith('### ')) {
      processed = <h4 key={index} className="font-semibold text-foreground mt-3 mb-1">{line.slice(4)}</h4>;
    } else if (line.startsWith('## ')) {
      processed = <h3 key={index} className="font-bold text-foreground mt-4 mb-2">{line.slice(3)}</h3>;
    } else if (line.startsWith('# ')) {
      processed = <h2 key={index} className="font-bold text-lg text-foreground mt-4 mb-2">{line.slice(2)}</h2>;
    } 
    // Bold text
    else if (line.includes('**')) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      processed = (
        <p key={index} className="my-1">
          {parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          )}
        </p>
      );
    }
    // Bullet points
    else if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      processed = <li key={index} className="ml-4 my-0.5">{line.slice(2)}</li>;
    }
    // Regular text
    else if (line.trim()) {
      processed = <p key={index} className="my-1">{line}</p>;
    } else {
      processed = <br key={index} />;
    }
    
    elements.push(processed);
  });
  
  return <>{elements}</>;
}
