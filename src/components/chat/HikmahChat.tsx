"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useClientTime, formatTime } from "@/hooks/useClientTime";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  attachedCard?: HikmahCardReference;
}

interface HikmahCardReference {
  id: string;
  title: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
}

interface SuggestedTopic {
  id: string;
  title: string;
}

interface HikmahChatProps {
  messages?: Message[];
  suggestedTopics?: SuggestedTopic[];
  onSendMessage?: (message: string) => void;
}

export default function HikmahChat({
  messages: initialMessages = [
    {
      id: "1",
      content:
        "Assalamu alaikum! How can I assist you with Islamic knowledge today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
  ],
  suggestedTopics = [
    { id: "1", title: "Prayer times" },
    { id: "2", title: "Quranic verses about patience" },
    { id: "3", title: "Hadith on kindness" },
    { id: "4", title: "Islamic history" },
  ],
  onSendMessage = () => {},
}: HikmahChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isClient = useClientTime();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = React.useCallback(async () => {
    if (inputValue.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    onSendMessage(inputValue);
    const currentMessage = inputValue;
    setInputValue("");

    // Add typing indicator
    const typingMessage: Message = {
      id: "typing",
      content: "Hikmah AI is thinking...",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentMessage,
          context: messages.slice(-3).map(m => `${m.sender}: ${m.content}`).join('\n')
        }),
      });

      const data = await response.json();
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== "typing");
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: "ai",
          timestamp: new Date(),
          // Add card attachment occasionally for engaging experience
          attachedCard: Math.random() > 0.7 ? {
            id: `card${Date.now()}`,
            title: "Wisdom Gained",
            rarity: ["common", "uncommon", "rare"][Math.floor(Math.random() * 3)] as "common" | "uncommon" | "rare",
          } : undefined,
        };
        return [...withoutTyping, aiResponse];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove typing indicator and add error message
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== "typing");
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. May Allah guide you in your quest for knowledge.",
          sender: "ai",
          timestamp: new Date(),
        };
        return [...withoutTyping, errorResponse];
      });
    }
  }, [inputValue, messages, onSendMessage]);

  const handleKeyPress = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleSuggestedTopic = React.useCallback((topic: string) => {
    setInputValue(topic);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col bg-background">
      <CardHeader className="border-b">
        <CardTitle className="text-center">Hikmah Chat</CardTitle>
      </CardHeader>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  {message.sender === "user" ? (
                    <>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                      <AvatarFallback>
                        <User size={16} />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai" />
                      <AvatarFallback>
                        <Bot size={16} />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div className="space-y-2">
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.id === "typing" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm">{message.content}</span>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>

                  {message.attachedCard && (
                    <div className="bg-muted/50 rounded-lg p-2 border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Hikmah Card:
                        </span>
                        <span className="text-sm">
                          {message.attachedCard.title}
                        </span>
                        <Badge
                          variant={
                            message.attachedCard.rarity === "legendary"
                              ? "destructive"
                              : message.attachedCard.rarity === "rare"
                                ? "default"
                                : message.attachedCard.rarity === "uncommon"
                                  ? "secondary"
                                  : "outline"
                          }
                          className="text-xs"
                        >
                          {message.attachedCard.rarity}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp, isClient)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 bg-muted/30">
        <div className="flex flex-wrap gap-2 mb-2">
          {suggestedTopics.map((topic) => (
            <Button
              key={topic.id}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedTopic(topic.title)}
              className="text-xs h-7"
            >
              {topic.title}
            </Button>
          ))}
        </div>
      </div>

      <CardFooter className="border-t p-2">
        <div className="flex w-full items-center gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip size={18} />
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your question about Islam..."
            className="flex-1"
          />

          <Button
            onClick={() => handleSendMessage()}
            size="icon"
            disabled={inputValue.trim() === ""}
            className="shrink-0"
          >
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
