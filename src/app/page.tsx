"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  Target, 
  Users, 
  Star,
  Calendar,
  TrendingUp,
  Award,
  MessageCircle,
  PenTool,
  Gamepad2,
  UserCircle
} from "lucide-react";
import { useClientTime, formatTime } from "@/hooks/useClientTime";
import { NativeSponsor } from "@/components/NativeSponsor";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "welcome" | "wisdom" | "achievement" | "native_sponsor";
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

interface UserStats {
  hikmahPoints: number;
  cardsCollected: number;
  journalStreak: number;
  communityRank: string;
}

export default function ChatFirstHomepage() {
  const isClient = useClientTime();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "As-salamu alaykum! Welcome to DeenQuest, your AI-powered Islamic companion. I'm here to help you grow in wisdom, track your spiritual journey, and connect with the community. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
      type: "welcome"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [userStats] = useState<UserStats>({
    hikmahPoints: 1247,
    cardsCollected: 89,
    journalStreak: 12,
    communityRank: "Seeker"
  });

  const quickActions: QuickAction[] = [
    {
      id: "cards",
      label: "Hikmah Cards",
      icon: <BookOpen className="h-4 w-4" />,
      path: "/cards",
      description: "Collect wisdom cards"
    },
    {
      id: "journal",
      label: "Journal",
      icon: <PenTool className="h-4 w-4" />,
      path: "/journal",
      description: "Reflect and grow"
    },
    {
      id: "games",
      label: "Games",
      icon: <Gamepad2 className="h-4 w-4" />,
      path: "/games",
      description: "Learn through play"
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserCircle className="h-4 w-4" />,
      path: "/profile",
      description: "Track your progress"
    }
  ];

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

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    const currentMessage = inputValue;
    setInputValue("");
    setIsLoading(true);

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
          type: "wisdom"
        };
        return [...withoutTyping, aiResponse];
      });

      // Occasionally show native sponsor after AI response
      if (Math.random() > 0.7) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `native_sponsor-${Date.now()}`,
            content: "native_sponsor",
            sender: "ai",
            timestamp: new Date(),
            type: "native_sponsor"
          }]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    const quickMessage: Message = {
      id: Date.now().toString(),
      content: `Show me ${action.label.toLowerCase()}`,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, quickMessage]);
    
    // Simulate AI response suggesting navigation
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Great choice! ${action.description}. You can explore ${action.label} to continue your journey. Would you like me to guide you there?`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
  };

  return (
    <div className="min-h-screen pastel-bg-primary">
      {/* Header */}
      <header className="frosted-header sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-frosted-strong">
              DeenQuest
            </h1>
            <Badge className="bg-gradient-to-r from-pastel-mint to-pastel-blue text-frosted-strong border-0">
              {userStats.communityRank}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm text-frosted">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>{userStats.hikmahPoints}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{userStats.cardsCollected}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{userStats.journalStreak} days</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chat Interface - Primary Column */}
          <div className="lg:col-span-2">
            <Card className="frosted-card h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-frosted-strong text-xl flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat with Hikmah AI
                </CardTitle>
              </CardHeader>

              <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.type === "native_sponsor" ? (
                        <NativeSponsor 
                          context="chat"
                          integrationType="suggestion"
                          className="my-4"
                        />
                      ) : (
                        <div
                          className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.sender === "ai" && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-pastel-mint to-pastel-blue">
                                <Bot size={16} className="text-frosted-strong" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className={`space-y-2 max-w-[80%] ${message.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                            <div
                              className={`rounded-lg p-3 ${
                                message.sender === "user"
                                  ? "chat-message-user"
                                  : "chat-message-ai"
                              }`}
                            >
                              {message.content}
                            </div>

                            <div className="text-xs text-frosted-light">
                              {formatTime(message.timestamp, isClient)}
                            </div>
                          </div>

                          {message.sender === "user" && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-pastel-pink to-pastel-lavender">
                                <User size={16} className="text-frosted-strong" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 pt-4 border-t border-white/20">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about Islam, set goals, or explore DeenQuest..."
                    className="frosted-input flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === "" || isLoading}
                    className="frosted-button px-4"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card className="frosted-card">
              <CardHeader>
                <CardTitle className="text-frosted-strong text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <div key={action.id} className="flex gap-3">
                    <Button
                      onClick={() => handleQuickAction(action)}
                      className="frosted-button flex-1 justify-start gap-3 h-auto py-3"
                      asChild
                    >
                      <Link href={action.path}>
                        {action.icon}
                        <div className="text-left">
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-frosted-light">{action.description}</div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card className="frosted-card">
              <CardHeader>
                <CardTitle className="text-frosted-strong text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-frosted">Hikmah Points</span>
                  <span className="text-frosted-strong font-bold">{userStats.hikmahPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-frosted">Cards Collected</span>
                  <span className="text-frosted-strong font-bold">{userStats.cardsCollected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-frosted">Journal Streak</span>
                  <span className="text-frosted-strong font-bold">{userStats.journalStreak} days</span>
                </div>
                <div className="pt-2 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-frosted">Community Rank</span>
                    <Badge className="bg-gradient-to-r from-pastel-peach to-pastel-yellow text-frosted-strong border-0">
                      <Award className="h-3 w-3 mr-1" />
                      {userStats.communityRank}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Goals */}
            <Card className="frosted-card">
              <CardHeader>
                <CardTitle className="text-frosted-strong text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Today's Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pastel-mint to-pastel-blue"></div>
                  <span className="text-frosted text-sm">Complete daily reflection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pastel-pink to-pastel-lavender"></div>
                  <span className="text-frosted text-sm">Collect 3 Hikmah cards</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pastel-peach to-pastel-yellow"></div>
                  <span className="text-frosted text-sm">Connect with community</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
