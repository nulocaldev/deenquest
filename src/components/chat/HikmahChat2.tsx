"use client";

import React, { useRef, useEffect } from 'react';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

// Import our context and components
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { ChatMessage } from './ui/ChatMessage';
import { ChatSuggestions } from './ui/ChatSuggestions';
import { ChatInput } from './ui/ChatInput';
import { UnlockedContentNotification } from './ui/UnlockedContentNotification';

// Internal component that uses the ChatContext
function ChatInterface() {
  const { 
    messages, 
    suggestions, 
    unlockedContent,
    isLoading, 
    error, 
    sendMessage, 
    useSuggestion,
    enableUnlocking,
    setEnableUnlocking
  } = useChat();

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
  }, [messages, isLoading]);

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
                Islamic Guidance AI Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Content Unlocking</label>
              <button
                onClick={() => setEnableUnlocking(!enableUnlocking)}
                className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                  enableUnlocking ? 'bg-aurora-blue' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    enableUnlocking ? 'translate-x-5' : 'translate-x-1'
                  } mt-1`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 container px-6 py-4 overflow-hidden">
        <div className="h-full flex flex-col max-w-4xl mx-auto">
          <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-y-auto pr-4">
            <div className="space-y-6 pb-4">
              {/* Messages */}
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <ChatMessage
                    id={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                  
                  {/* Display suggestions after assistant messages */}
                  {message.role === 'assistant' && suggestions.length > 0 && (
                    <div className="ml-11">
                      <ChatSuggestions
                        suggestions={suggestions}
                        onSelect={useSuggestion}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <ChatMessage
                  id="loading"
                  role="assistant"
                  content=""
                  timestamp={new Date()}
                  isTyping={true}
                />
              )}
              
              {/* Unlocked content notifications */}
              {unlockedContent.length > 0 && (
                <UnlockedContentNotification unlockedContent={unlockedContent} />
              )}
              
              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
                  Error: {error}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input area */}
          <Card className="glass-morphism border-white/10 rounded-3xl mt-4">
            <CardContent className="p-4">
              <ChatInput
                onSendMessage={sendMessage}
                isDisabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Exported component with ChatProvider included
export interface HikmahChat2Props {
  userId?: string;
}

export default function HikmahChat2({ userId }: HikmahChat2Props) {
  return (
    <ChatProvider userId={userId}>
      <ChatInterface />
    </ChatProvider>
  );
}
