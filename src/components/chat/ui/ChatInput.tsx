"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip } from 'lucide-react';

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  isDisabled = false,
  placeholder = "Ask about Islam, seek guidance, or share your thoughts..."
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() && !isDisabled) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        size="icon" 
        className="shrink-0 glass-morphism border-white/10 text-white hover:bg-white/10"
        disabled={isDisabled}
      >
        <Paperclip size={18} />
      </Button>

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        disabled={isDisabled}
        className="flex-1 glass-morphism border-white/10 text-white placeholder:text-gray-400"
      />

      <Button
        onClick={handleSendMessage}
        size="icon"
        disabled={!inputValue.trim() || isDisabled}
        className="shrink-0 bg-gradient-to-r from-aurora-blue to-aurora-purple hover:from-aurora-blue/80 hover:to-aurora-purple/80 text-white"
      >
        <Send size={18} />
      </Button>
    </div>
  );
}
