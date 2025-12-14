"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Chào bạn! Tôi có thể giúp gì về danh mục HPG hoặc tình hình vĩ mô hôm nay?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const quickSuggestions = [
    "Phân tích HPG",
    "Xu hướng Vĩ mô",
    "Chiến lược của tôi",
  ];

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Add a placeholder message for streaming effect
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        // Simulate streaming effect
        const fullResponse = data.response;
        let currentIndex = 0;
        
        const streamInterval = setInterval(() => {
          if (currentIndex < fullResponse.length) {
            const chunk = fullResponse.slice(0, currentIndex + 1);
            setMessages((prev) => {
              const newMessages = [...prev];
              // Update the last message (which is the assistant's placeholder)
              newMessages[newMessages.length - 1] = { role: "assistant", content: chunk };
              return newMessages;
            });
            currentIndex += 2; // Adjust speed: higher = faster
          } else {
            clearInterval(streamInterval);
            setIsLoading(false);
          }
        }, 20); // Adjust delay: lower = faster
      } else {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: data.error || "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.",
          };
          return newMessages;
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: "Xin lỗi, không thể kết nối. Vui lòng thử lại sau.",
        };
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = async (suggestion: string) => {
    // Auto-send the suggestion
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: suggestion }]);
    setIsLoading(true);

    // Add a placeholder message for streaming effect
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: suggestion }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        // Simulate streaming effect
        const fullResponse = data.response;
        let currentIndex = 0;
        
        const streamInterval = setInterval(() => {
          if (currentIndex < fullResponse.length) {
            const chunk = fullResponse.slice(0, currentIndex + 1);
            setMessages((prev) => {
              const newMessages = [...prev];
              // Update the last message (which is the assistant's placeholder)
              newMessages[newMessages.length - 1] = { role: "assistant", content: chunk };
              return newMessages;
            });
            currentIndex += 2; // Adjust speed: higher = faster
          } else {
            clearInterval(streamInterval);
            setIsLoading(false);
          }
        }, 20); // Adjust delay: lower = faster
      } else {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: data.error || "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.",
          };
          return newMessages;
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: "Xin lỗi, không thể kết nối. Vui lòng thử lại sau.",
        };
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-xl z-50 flex flex-col border">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-2 w-2 bg-emerald-500 rounded-full absolute -top-0.5 -right-0.5 border-2 border-background"></div>
                <CardTitle className="text-lg">HawkEye Assistant</CardTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 gap-3">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg rounded-bl-none max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Đang suy nghĩ...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleQuickSuggestion(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Nhập câu hỏi của bạn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                disabled={isLoading || !message.trim()}
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

