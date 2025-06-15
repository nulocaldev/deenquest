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

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);
    onSendMessage(inputValue);
    setInputValue("");

    // Simulate AI response (in a real app, this would come from your backend)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thank you for your question. In Islamic teachings, seeking knowledge is highly encouraged. The Prophet Muhammad (peace be upon him) said: 'Seeking knowledge is obligatory upon every Muslim.'",
        sender: "ai",
        timestamp: new Date(),
        attachedCard: {
          id: "card123",
          title: "Importance of Knowledge",
          rarity: "uncommon",
        },
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedTopic = (topic: string) => {
    setInputValue(topic);
  };

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
                    {message.content}
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
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
            onClick={handleSendMessage}
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
