"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, ChatResponse } from '@/types/chat';

// Define interfaces for context state
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Suggestion {
  id: string;
  text: string;
}

export interface UnlockedContent {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  unlockedAt: Date;
}

export interface ChatContextState {
  messages: Message[];
  suggestions: Suggestion[];
  unlockedContent: UnlockedContent[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  useSuggestion: (suggestion: string) => Promise<void>;
  clearChat: () => void;
  enableUnlocking: boolean;
  setEnableUnlocking: (enable: boolean) => void;
}

// Create the context with a default value
const ChatContext = createContext<ChatContextState | undefined>(undefined);

// Chat provider props
export interface ChatProviderProps {
  children: ReactNode;
  userId?: string;
  initialMessages?: Message[];
}

// Chat Provider component
export function ChatProvider({ 
  children, 
  userId = `user_${Math.random().toString(36).substring(2, 9)}`,
  initialMessages = []
}: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0 ? initialMessages : [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'As-salamu alaykum! I\'m here to help you with Islamic questions, provide guidance, and share wisdom from the Quran and Sunnah. What would you like to explore today?',
        timestamp: new Date()
      }
    ]
  );
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: '1', text: 'Tell me about the pillars of Islam' },
    { id: '2', text: 'How can I improve my prayer?' },
    { id: '3', text: 'Share wisdom about patience' }
  ]);
  
  const [unlockedContent, setUnlockedContent] = useState<UnlockedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enableUnlocking, setEnableUnlocking] = useState(true);

  // Convert our messages to the API format
  const formatMessagesForAPI = (): ChatMessage[] => {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString()
    }));
  };

  // Send a message to the API
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Call the chat API
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: formatMessagesForAPI(),
          userId,
          enableUnlocking
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Unknown error occurred');
      }

      const chatResponse: ChatResponse = data.data;
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: chatResponse.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update suggestions
      if (chatResponse.suggestions) {
        setSuggestions(
          chatResponse.suggestions.map((text, index) => ({
            id: `suggestion_${Date.now()}_${index}`,
            text
          }))
        );
      }
      
      // Update unlocked content
      if (chatResponse.unlocks && chatResponse.unlocks.length > 0) {
        const newUnlocks = chatResponse.unlocks.map(unlock => ({
          id: unlock.id,
          type: unlock.type,
          title: unlock.title,
          description: unlock.description,
          priority: unlock.priority,
          unlockedAt: new Date(unlock.unlockedAt)
        }));
        
        setUnlockedContent(prev => [...prev, ...newUnlocks]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Add error message
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'system',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Use a suggestion
  const useSuggestion = async (suggestion: string) => {
    await sendMessage(suggestion);
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'As-salamu alaykum! I\'m here to help you with Islamic questions, provide guidance, and share wisdom from the Quran and Sunnah. What would you like to explore today?',
        timestamp: new Date()
      }
    ]);
    setSuggestions([
      { id: '1', text: 'Tell me about the pillars of Islam' },
      { id: '2', text: 'How can I improve my prayer?' },
      { id: '3', text: 'Share wisdom about patience' }
    ]);
    setUnlockedContent([]);
    setError(null);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        suggestions,
        unlockedContent,
        isLoading,
        error,
        sendMessage,
        useSuggestion,
        clearChat,
        enableUnlocking,
        setEnableUnlocking
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
}
