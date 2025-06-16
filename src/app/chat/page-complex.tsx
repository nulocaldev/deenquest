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

export default function ChatPage() {
  const isClient = useClientTime();
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      type: "ai",
      content: "As-salamu alaykum! I'm your Hikmah AI assistant. I'm here to help you with Islamic questions, provide guidance, and share wisdom from the Quran and Sunnah. How can I assist you today?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Tell me about the pillars of Islam",
        "How can I improve my prayer?",
        "Share wisdom about patience",
        "What does the Quran say about gratitude?"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unlockedContent, setUnlockedContent] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
    
    // Debug logging for browser console
    console.log('🔍 Chat page mounted, checking messages:', messages);
    console.log('🔍 First message suggestions:', messages[0]?.suggestions);
    
    // Log to page as well
    if (typeof window !== 'undefined') {
      const debugDiv = document.createElement('div');
      debugDiv.style.cssText = 'position: fixed; top: 100px; left: 20px; background: yellow; color: black; padding: 10px; z-index: 9999; border: 2px solid red;';
      debugDiv.innerHTML = `
        <strong>DEBUG INFO:</strong><br>
        Messages: ${messages.length}<br>
        First message has suggestions: ${!!messages[0]?.suggestions}<br>
        Suggestion count: ${messages[0]?.suggestions?.length || 0}<br>
        Time: ${new Date().toLocaleTimeString()}
      `;
      document.body.appendChild(debugDiv);
      
      // Remove after 10 seconds
      setTimeout(() => {
        if (debugDiv.parentNode) debugDiv.parentNode.removeChild(debugDiv);
      }, 10000);
    }
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage(suggestion);
  };

  const formatRichText = (text: string) => {
    // Convert markdown-like formatting to JSX
    let formattedText = text;
    
    // Bold text **text**
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-aurora-cyan">$1</strong>');
    
    // Italic text *text*
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em class="italic text-aurora-blue">$1</em>');
    
    // Quran verses [Quran X:Y]
    formattedText = formattedText.replace(/\[Quran (\d+:\d+)\]/g, '<span class="inline-flex items-center px-2 py-1 bg-aurora-blue/20 text-aurora-cyan text-xs font-medium rounded-full border border-aurora-blue/30">[Quran $1]</span>');
    
    // Hadith references [Hadith - Source]
    formattedText = formattedText.replace(/\[Hadith - (.*?)\]/g, '<span class="inline-flex items-center px-2 py-1 bg-aurora-purple/20 text-aurora-purple text-xs font-medium rounded-full border border-aurora-purple/30">[Hadith - $1]</span>');
    
    // Arabic text (enhanced styling)
    formattedText = formattedText.replace(/\{ar\}(.*?)\{\/ar\}/g, '<span class="text-lg font-arabic text-aurora-gold bg-aurora-gold/10 px-2 py-1 rounded border border-aurora-gold/30" dir="rtl">$1</span>');
    
    return { __html: formattedText };
  };

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage;
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Call Dynamic Chat API
      const response = await fetch('/api/chat/dynamic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: 'user123', // In real app, get from auth
          conversationHistory: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      const data = await response.json();
      
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: data.response,
        timestamp: new Date().toISOString(),
        suggestions: data.suggestions || [],
        spiritualGuidance: data.spiritualGuidance
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Handle unlocked content
      if (data.unlockedContent && data.unlockedContent.length > 0) {
        setUnlockedContent(prev => [...prev, ...data.unlockedContent]);
        // Show notification for unlocked content
        data.unlockedContent.forEach((item: any) => {
          console.log(`🎉 Unlocked: ${item.type} - ${item.title}`);
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to basic chat API
      try {
        const fallbackResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            context: "Islamic guidance and wisdom chat"
          }),
        });

        const fallbackData = await fallbackResponse.json();
        
        const aiResponse = {
          id: messages.length + 2,
          type: "ai",
          content: fallbackData.response,
          timestamp: new Date().toISOString(),
          suggestions: [
            "Tell me more about this topic",
            "Can you provide a Quranic perspective?",
            "What would the Prophet (PBUH) say about this?"
          ]
        };

        setMessages(prev => [...prev, aiResponse]);
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        
        const errorResponse = {
          id: messages.length + 2,
          type: "ai",
          content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. May Allah guide and bless you.",
          timestamp: new Date().toISOString(),
          suggestions: [
            "Try asking again",
            "Check your connection",
            "Ask a different question"
          ]
        };
        
        setMessages(prev => [...prev, errorResponse]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (question: string): string => {
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen elegant-bg flex flex-col">
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
                AI Islamic Guidance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Online</span>
          </div>
        </div>
        {/* DEBUG BANNER */}
        <div style={{backgroundColor: 'red', color: 'white', padding: '10px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold'}}>
          🔥 DEBUG: PAGE UPDATED - SUGGESTIONS SHOULD BE VISIBLE BELOW 🔥
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 container px-6 py-4 overflow-hidden">
        <div className="h-full flex flex-col max-w-4xl mx-auto">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => {
              return (
                <div key={message.id} className="space-y-3">
                  <div
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
                      <div 
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={formatRichText(message.content)}
                      />
                      {message.spiritualGuidance && (
                        <div className="mt-3 p-3 bg-aurora-gold/10 border border-aurora-gold/30 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-aurora-gold" />
                            <span className="text-xs font-medium text-aurora-gold">Spiritual Guidance</span>
                          </div>
                          <p className="text-xs text-aurora-gold/90">{message.spiritualGuidance}</p>
                        </div>
                      )}
                      <span className="text-xs opacity-70 mt-2 block">
                        {formatTime(new Date(message.timestamp), isClient)}
                      </span>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aurora-cyan to-aurora-blue flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}                </div>
                
                {/* Clickable AI Suggestions */}
                {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="ml-11 mt-3" style={{border: '3px solid red', padding: '15px', backgroundColor: 'rgba(255,0,0,0.1)'}}>
                    <div style={{color: 'yellow', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px'}}>
                      🎯 CLICKABLE SUGGESTIONS ({message.suggestions.length} found):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            console.log('Suggestion clicked:', suggestion);
                            handleSuggestionClick(suggestion);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md"
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            color: 'white',
                            border: '2px solid yellow',
                            fontWeight: 'bold',
                            minHeight: '32px',
                            fontSize: '12px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 1)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.8)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <Sparkles className="h-3 w-3" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
            
            {/* Unlocked Content Notifications */}
            {unlockedContent.length > 0 && (
              <div className="flex justify-center">
                <div className="glass-morphism border-aurora-gold/30 p-4 rounded-2xl max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-aurora-gold" />
                    <span className="font-medium text-aurora-gold">Content Unlocked!</span>
                  </div>
                  <div className="space-y-1">
                    {unlockedContent.slice(-3).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                        <BookOpen className="h-4 w-4 text-aurora-cyan" />
                        <span>{item.type}: {item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
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
