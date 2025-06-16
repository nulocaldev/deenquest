"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  MessageCircle,
  Trophy,
  User,
  Send,
  Sparkles,
  Star,
  Zap,
  Heart,
  Calendar,
  Target,
  Users,
  Gift,
} from "lucide-react";
import HikmahCard from "@/components/hikmah/HikmahCard";
import { useClientTime, formatTime } from "@/hooks/useClientTime";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "welcome" | "achievement" | "reminder" | "wisdom";
  actionCard?: {
    type: "journal" | "game" | "card" | "community";
    title: string;
    description: string;
    action: string;
    link: string;
  };
}

export default function Home() {
  const isClient = useClientTime();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // User stats - this would come from user context/API
  const [userStats] = useState({
    points: 1250,
    cardsCollected: 24,
    totalCards: 100,
    journalEntries: 12,
    streak: 7,
    level: 5,
    name: "Ahmad", // This would be from user profile
  });

  // Initialize with welcome message and daily suggestions
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: `As-salamu alaykum, ${userStats.name}! 🌟 You're on a ${userStats.streak}-day streak - Masha'Allah! I'm here to be your daily companion for wisdom, growth, and reflection. What would you like to explore today?`,
      sender: "ai",
      timestamp: new Date(Date.now() - 30000),
      type: "welcome",
      actionCard: {
        type: "journal",
        title: "Start Today's Reflection",
        description: "I've prepared a special prompt for your spiritual growth",
        action: "Begin Journaling",
        link: "/journal"
      }
    },
    {
      id: "2", 
      content: "I notice you've collected 24 Hikmah cards! Would you like me to suggest some wisdom games to help you earn more, or shall we focus on deepening your understanding of the cards you already have?",
      sender: "ai",
      timestamp: new Date(Date.now() - 15000),
      type: "wisdom",
      actionCard: {
        type: "game",
        title: "Wisdom Challenge",
        description: "Test your knowledge and earn new Hikmah cards",
        action: "Play Games",
        link: "/games"
      }
    }
  ]);

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
    if (inputValue.trim() === "") return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    const currentMessage = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentMessage,
          context: `User stats: ${userStats.points} points, ${userStats.streak} day streak, level ${userStats.level}. Recent activity context.`,
          userProfile: {
            name: userStats.name,
            level: userStats.level,
            streak: userStats.streak,
            points: userStats.points
          }
        }),
      });

      const data = await response.json();
      
      // Create AI response with potential action card
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        // Add action cards based on AI response context
        actionCard: shouldAddActionCard(currentMessage, data.response) ? generateActionCard(currentMessage) : undefined,
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. Remember, I'm always here to support your spiritual journey, even when there are technical difficulties. 🤲",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const shouldAddActionCard = (userMessage: string, aiResponse: string): boolean => {
    const triggers = ['journal', 'reflect', 'write', 'game', 'play', 'card', 'learn', 'community', 'group'];
    return triggers.some(trigger => 
      userMessage.toLowerCase().includes(trigger) || aiResponse.toLowerCase().includes(trigger)
    );
  };

  const generateActionCard = (userMessage: string): ChatMessage['actionCard'] => {
    if (userMessage.toLowerCase().includes('journal') || userMessage.toLowerCase().includes('reflect')) {
      return {
        type: "journal",
        title: "Begin Reflection",
        description: "I'll guide you through a meaningful spiritual reflection",
        action: "Start Journaling",
        link: "/journal"
      };
    }
    if (userMessage.toLowerCase().includes('game') || userMessage.toLowerCase().includes('play')) {
      return {
        type: "game",
        title: "Wisdom Games",
        description: "Challenge yourself and earn Hikmah points",
        action: "Play Games",
        link: "/games"
      };
    }
    if (userMessage.toLowerCase().includes('card')) {
      return {
        type: "card",
        title: "Hikmah Cards",
        description: "Explore your collection and discover new wisdom",
        action: "View Cards",
        link: "/cards"
      };
    }
    return {
      type: "community",
      title: "Connect & Grow",
      description: "Join group challenges and share your journey",
      action: "Explore Community",
      link: "/profile"
    };
  };

  return (
    <div className="min-h-screen elegant-bg">
      {/* Header with user stats */}
      <header className="sticky top-0 z-50 w-full elegant-header">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-aurora-cyan" />
              <h1 className="text-xl font-bold text-gradient">DeenQuest</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <Zap className="h-4 w-4 text-aurora-yellow" />
              <span className="font-semibold">{userStats.points.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white">
              <Star className="h-4 w-4 text-aurora-purple" />
              <span>{userStats.streak} day streak</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback>{userStats.name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="container max-w-4xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          
          {/* Central Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col glass-morphism border-white/10 rounded-3xl">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Heart className="h-5 w-5 text-aurora-pink" />
                  Your AI Companion
                  {isTyping && (
                    <Badge variant="secondary" className="ml-auto animate-pulse">
                      Hikmah AI is typing...
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              {/* Messages Area */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "ai" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai" />
                          <AvatarFallback className="bg-gradient-to-r from-aurora-cyan to-aurora-blue text-white">
                            🤖
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`max-w-[80%] space-y-2 ${message.sender === "user" ? "items-end" : "items-start"}`}>
                        <div
                          className={`rounded-2xl p-4 ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-aurora-purple to-aurora-pink text-white ml-auto"
                              : "glass-morphism border-white/10 text-white"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>

                        {/* Action Card */}
                        {message.actionCard && (
                          <Card className="glass-morphism border-white/10 max-w-sm">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                  message.actionCard.type === 'journal' ? 'bg-aurora-cyan/20' :
                                  message.actionCard.type === 'game' ? 'bg-aurora-purple/20' :
                                  message.actionCard.type === 'card' ? 'bg-aurora-yellow/20' :
                                  'bg-aurora-pink/20'
                                }`}>
                                  {message.actionCard.type === 'journal' && <BookOpen className="h-4 w-4 text-aurora-cyan" />}
                                  {message.actionCard.type === 'game' && <Trophy className="h-4 w-4 text-aurora-purple" />}
                                  {message.actionCard.type === 'card' && <Sparkles className="h-4 w-4 text-aurora-yellow" />}
                                  {message.actionCard.type === 'community' && <Users className="h-4 w-4 text-aurora-pink" />}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white text-sm">{message.actionCard.title}</h4>
                                  <p className="text-xs text-gray-300 mt-1">{message.actionCard.description}</p>
                                  <Link href={message.actionCard.link}>
                                    <Button size="sm" className="mt-2 bg-gradient-to-r from-aurora-cyan to-aurora-blue hover:from-aurora-cyan/80 hover:to-aurora-blue/80">
                                      {message.actionCard.action}
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <div className="text-xs text-gray-400">
                          {formatTime(message.timestamp, isClient)}
                        </div>
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                          <AvatarFallback className="bg-gradient-to-r from-aurora-purple to-aurora-pink text-white">
                            {userStats.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-white/10 p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about Islam, request a reflection prompt, or just say hello..."
                    className="flex-1 glass-morphism border-white/10 text-white placeholder-gray-400"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={inputValue.trim() === "" || isTyping}
                    className="bg-gradient-to-r from-aurora-cyan to-aurora-blue hover:from-aurora-cyan/80 hover:to-aurora-blue/80"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Stats & Actions Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Progress Card */}
            <Card className="glass-morphism border-white/10 rounded-2xl">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="text-2xl font-bold text-aurora-cyan">{userStats.level}</div>
                  <div className="text-xs text-gray-300">Current Level</div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-aurora-cyan to-aurora-blue h-2 rounded-full"
                      style={{ width: `${(userStats.points % 1000) / 10}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-300">
                    {userStats.points % 1000}/1000 to next level
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-morphism border-white/10 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <Link href="/journal">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-aurora-cyan/20">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Daily Reflection
                  </Button>
                </Link>
                <Link href="/games">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-aurora-purple/20">
                    <Trophy className="h-4 w-4 mr-2" />
                    Wisdom Games
                  </Button>
                </Link>
                <Link href="/cards">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-aurora-yellow/20">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Hikmah Cards
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-aurora-pink/20">
                    <Users className="h-4 w-4 mr-2" />
                    Community
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Daily Challenge */}
            <Card className="glass-morphism border-white/10 rounded-2xl">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Target className="h-6 w-6 text-aurora-green mx-auto" />
                  <div className="text-sm font-semibold text-white">Today's Challenge</div>
                  <div className="text-xs text-gray-300">Complete 3 reflections</div>
                  <div className="text-xs text-aurora-green">2/3 complete</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
