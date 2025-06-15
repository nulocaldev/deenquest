"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageCircle, Bot, User } from "lucide-react";
import HikmahChat from "@/components/chat/HikmahChat";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "As-salamu alaykum! I'm your Hikmah AI assistant. I'm here to help you with Islamic questions, provide guidance, and share wisdom from the Quran and Sunnah. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question) => {
    // Simple response generator - in real app, this would be an AI API call
    const responses = [
      "This is a thoughtful question. In Islamic tradition, we find guidance in both the Quran and the teachings of Prophet Muhammad (peace be upon him).",
      "May Allah guide us all. The beauty of Islam lies in its comprehensive guidance for all aspects of life.",
      "SubhanAllah, this reminds me of the verse: 'And whoever fears Allah - He will make for him a way out.' (Quran 65:2)",
      "In the Sunnah, we learn that seeking knowledge is obligatory upon every Muslim. This question shows your dedication to learning.",
      "Alhamdulillah for your curiosity. The Prophet (peace be upon him) said: 'The seeking of knowledge is obligatory upon every Muslim.'"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full ios-blur">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="glass-morphism hover:bg-white/10 text-white border-white/20">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Hikmah Chat
              </h1>
              <p className="text-xs text-muted-foreground">
                AI Islamic Guidance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Online</span>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 container px-6 py-4 overflow-hidden">
        <div className="h-full flex flex-col max-w-4xl mx-auto">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aurora-blue to-aurora-purple flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-4 rounded-3xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-aurora-purple to-aurora-pink text-white ml-auto'
                      : 'glass-morphism border-white/10 text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aurora-cyan to-aurora-blue flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aurora-blue to-aurora-purple flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="glass-morphism border-white/10 p-4 rounded-3xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-aurora-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-aurora-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-aurora-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <Card className="glass-morphism border-white/10 rounded-3xl">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Ask about Islam, seek guidance, or share your thoughts..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 glass-morphism border-white/10 text-white placeholder-gray-400 rounded-2xl"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-aurora-blue to-aurora-purple hover:from-aurora-blue/80 hover:to-aurora-purple/80 text-white rounded-2xl px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
