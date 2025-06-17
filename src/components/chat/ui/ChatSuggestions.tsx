"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export interface ChatSuggestionsProps {
  suggestions: Array<{ id: string; text: string }>;
  onSelect: (suggestion: string) => void;
}

export function ChatSuggestions({ suggestions, onSelect }: ChatSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 my-3">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion.text)}
          className="text-xs h-7 glass-morphism border-white/10 text-white hover:bg-white/10"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          {suggestion.text}
        </Button>
      ))}
    </div>
  );
}
