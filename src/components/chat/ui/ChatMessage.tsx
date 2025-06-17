"use client";

import React from 'react';
import { User, Bot } from 'lucide-react';
import { formatTime } from '@/hooks/useClientTime';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface ChatMessageProps {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  unlockCard?: {
    id: string;
    title: string;
    type: string;
    rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  };
}

/**
 * Formats rich text with basic markdown-like syntax
 */
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

export function ChatMessage({
  role,
  content,
  timestamp,
  isTyping = false,
  unlockCard
}: ChatMessageProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';
  
  // Generate avatar for the message
  const renderAvatar = () => {
    if (isUser) {
      return (
        <Avatar className="h-8 w-8 bg-gradient-to-r from-aurora-cyan to-aurora-blue">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
          <AvatarFallback>
            <User size={16} className="text-white" />
          </AvatarFallback>
        </Avatar>
      );
    } else if (isSystem) {
      return (
        <Avatar className="h-8 w-8 bg-gradient-to-r from-aurora-gold to-aurora-orange">
          <AvatarImage src="/system-avatar.png" />
          <AvatarFallback>
            <Bot size={16} className="text-white" />
          </AvatarFallback>
        </Avatar>
      );
    } else {
      return (
        <Avatar className="h-8 w-8 bg-gradient-to-r from-aurora-blue to-aurora-purple">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai" />
          <AvatarFallback>
            <Bot size={16} className="text-white" />
          </AvatarFallback>
        </Avatar>
      );
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {renderAvatar()}
      
      <div className="space-y-2 max-w-[80%]">
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? 'bg-gradient-to-r from-aurora-purple to-aurora-pink text-white'
              : isSystem
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'glass-morphism border-white/10 text-white'
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div 
                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce" 
                  style={{animationDelay: '0.1s'}}
                ></div>
                <div 
                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce" 
                  style={{animationDelay: '0.2s'}}
                ></div>
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          ) : (
            <div 
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={formatRichText(content)}
            />
          )}
        </div>

        {unlockCard && (
          <div className="bg-muted/50 rounded-lg p-2 border border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {unlockCard.type}:
              </span>
              <span className="text-sm">
                {unlockCard.title}
              </span>
              {unlockCard.rarity && (
                <Badge
                  variant={
                    unlockCard.rarity === "legendary"
                      ? "destructive"
                      : unlockCard.rarity === "rare"
                        ? "default"
                        : unlockCard.rarity === "uncommon"
                          ? "secondary"
                          : "outline"
                  }
                  className="text-xs"
                >
                  {unlockCard.rarity}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {formatTime(timestamp, true)}
        </div>
      </div>
    </div>
  );
}
