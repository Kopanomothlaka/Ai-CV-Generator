import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Type your message..." }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || file) {
      onSend(message.trim(), file || undefined);
      setMessage("");
      setFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {file && (
        <div className="mb-2 flex items-center gap-2 p-2 bg-accent rounded-lg animate-fade-in">
          <FileText className="w-4 h-4 text-accent-foreground" />
          <span className="text-sm text-accent-foreground truncate flex-1">{file.name}</span>
          <button
            type="button"
            onClick={removeFile}
            className="p-1 hover:bg-background rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2 p-2 bg-card border border-border rounded-2xl shadow-soft">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[120px] resize-none border-0 focus-visible:ring-0 bg-transparent text-sm"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          className={cn(
            "flex-shrink-0 h-9 w-9 rounded-xl transition-all",
            (message.trim() || file) && !disabled
              ? "bg-primary hover:bg-primary/90"
              : "bg-muted text-muted-foreground"
          )}
          disabled={disabled || (!message.trim() && !file)}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
