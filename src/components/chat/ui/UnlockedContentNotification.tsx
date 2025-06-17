"use client";

import React from 'react';
import { Star, BookOpen } from 'lucide-react';
import { UnlockedContent } from '@/contexts/ChatContext';

export interface UnlockedContentNotificationProps {
  unlockedContent: UnlockedContent[];
  maxShown?: number;
}

export function UnlockedContentNotification({ 
  unlockedContent, 
  maxShown = 3 
}: UnlockedContentNotificationProps) {
  if (!unlockedContent || unlockedContent.length === 0) {
    return null;
  }

  // Show only the most recent unlocks
  const recentUnlocks = unlockedContent.slice(-maxShown);

  return (
    <div className="flex justify-center my-4">
      <div className="glass-morphism border-aurora-gold/30 p-4 rounded-2xl max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-aurora-gold" />
          <span className="font-medium text-aurora-gold">Content Unlocked!</span>
        </div>
        <div className="space-y-1">
          {recentUnlocks.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-sm text-white/80">
              <BookOpen className="h-4 w-4 text-aurora-cyan" />
              <span>{item.type}: {item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
