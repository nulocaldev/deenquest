"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, MessageCircle, Bot, User, Sparkles, BookOpen, Heart, Star } from "lucide-react";
import HikmahChat from "@/components/chat/HikmahChat";
import { useClientTime, formatTime } from "@/hooks/useClientTime";

// Static suggestions that always show
const ALWAYS_SHOW_SUGGESTIONS = [
  "Tell me about the pillars of Islam",
  "How can I improve my prayer?",
  "Share wisdom about patience",
  "What does the Quran say about gratitude?"
];

export default function ChatPage() {
  const isClient = useClientTime();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
    setInputMessage(suggestion);
    // Auto-send the suggestion
    handleSendMessage(suggestion);
  };

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage;
    if (!message.trim()) return;

    console.log('Sending message:', message);
    // For now, just show what would be sent
    alert(`Would send: ${message}`);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen elegant-bg flex flex-col">
      {/* Obvious Test Banner */}
      <div style={{
        backgroundColor: '#ff0000',
        color: '#ffffff',
        padding: '20px',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        border: '5px solid #ffff00'
      }}>
        🚨 SIMPLIFIED CHAT PAGE - SUGGESTIONS SHOULD BE VISIBLE BELOW 🚨
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full elegant-header">
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
                AI Islamic Guidance (Simplified Version)
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
            
            {/* Static AI Message */}
            <div className="space-y-3">
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aurora-blue to-aurora-purple flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="max-w-[70%] p-4 rounded-3xl glass-morphism border-white/10 text-white">
                  <div className="text-sm leading-relaxed">
                    As-salamu alaykum! I'm your Hikmah AI assistant. I'm here to help you with Islamic questions, provide guidance, and share wisdom from the Quran and Sunnah. How can I assist you today?
                  </div>
                  <span className="text-xs opacity-70 mt-2 block">
                    {formatTime(new Date(), isClient)}
                  </span>
                </div>
              </div>
              
              {/* ALWAYS VISIBLE SUGGESTIONS */}
              <div 
                style={{
                  marginLeft: '44px',
                  marginTop: '12px',
                  border: '5px solid #ff0000',
                  padding: '20px',
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                  borderRadius: '10px'
                }}
              >
                <div style={{
                  color: '#ffff00',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  🎯 STATIC SUGGESTIONS (Always Visible - {ALWAYS_SHOW_SUGGESTIONS.length} buttons):
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {ALWAYS_SHOW_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '12px 18px',
                        backgroundColor: 'rgba(59, 130, 246, 0.9)',
                        color: '#ffffff',
                        border: '3px solid #ffff00',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: '40px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 1)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                      }}
                    >
                      <Sparkles style={{ width: '16px', height: '16px' }} />
                      {suggestion}
                    </button>
                  ))}
                </div>
                
                <div style={{
                  marginTop: '15px',
                  color: '#ffffff',
                  fontSize: '12px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '8px',
                  borderRadius: '5px'
                }}>
                  ⚡ These buttons should be clearly visible with yellow borders and blue backgrounds
                </div>
              </div>
            </div>
            
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
