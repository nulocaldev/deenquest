"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Sparkles, BookOpen, Calendar, Heart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import JournalPrompt from "@/components/journal/JournalPrompt";
import SponsorCard from "@/components/SponsorCard";

export default function JournalPage() {
  const [currentEntry, setCurrentEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [entries, setEntries] = useState([
    {
      id: 1,
      prompt: "Reflect on a moment when patience guided you through difficulty",
      content: "Today I reflected on waiting for my exam results. It reminded me that Allah's timing is perfect, and that worrying doesn't change the outcome. Instead, I found peace in making du'a and trusting that whatever happens is for my best.",
      date: "2024-01-15",
      aiInsight: "Your reflection shows beautiful growth in trusting Allah's timing. The connection between patience and du'a demonstrates a mature understanding of Islamic principles."
    },
    {
      id: 2,
      prompt: "How did you practice gratitude today?",
      content: "I started my morning by listing three things I'm grateful for: my health, my family, and the opportunity to learn. Throughout the day, I tried to say 'Alhamdulillah' more often.",
      date: "2024-01-14",
      aiInsight: "Practicing gratitude through Alhamdulillah is a powerful way to maintain awareness of Allah's blessings. This daily practice strengthens your spiritual connection."
    }
  ]);

  const [journalStats] = useState({
    currentStreak: 12,
    totalEntries: 45,
    weeklyGoal: 7,
    weeklyProgress: 5
  });

  const handleSubmitEntry = async () => {
    if (currentEntry.trim() && currentPrompt) {
      const newEntry = {
        id: entries.length + 1,
        prompt: currentPrompt,
        content: currentEntry,
        date: new Date().toISOString().split('T')[0],
        aiInsight: "Processing your reflection..."
      };
      setEntries([newEntry, ...entries]);
      
      // Get AI feedback on the reflection
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: `Please provide brief, encouraging feedback on this Islamic reflection: "${currentEntry}". The reflection was in response to: "${currentPrompt}"`,
          }),
        });
        
        const data = await response.json();
        
        // Update the entry with AI feedback
        setEntries(prev => prev.map(entry => 
          entry.id === newEntry.id 
            ? { ...entry, aiInsight: data.response }
            : entry
        ));
      } catch (error) {
        console.error('Error getting AI feedback:', error);
        setEntries(prev => prev.map(entry => 
          entry.id === newEntry.id 
            ? { ...entry, aiInsight: "Your reflection is valuable and shows spiritual growth. May Allah guide you on your journey." }
            : entry
        ));
      }
      
      setCurrentEntry("");
    }
  };

  const handlePromptGenerated = (prompt: string) => {
    setCurrentPrompt(prompt);
  };

  const mockSponsor = {
    id: "journal-sponsor-1",
    name: "Islamic Journal Co",
    description: "Beautiful Islamic journals and reflection tools for spiritual growth",
    type: "lifestyle" as const,
    location: "Online",
    website: "https://example.com",
    specialOffer: "Free Islamic reflection cards with any journal purchase",
    contextMessage: "Enhance your reflection practice with beautiful journals"
  };

  return (
    <div className="min-h-screen pastel-bg-warm">
      {/* Header */}
      <header className="frosted-header sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="frosted-button hover:bg-white/30">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-frosted-strong">
                AI Journal
              </h1>
              <p className="text-sm text-frosted-light">
                Reflect & Grow
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-pastel-peach to-pastel-yellow text-frosted-strong border-0">
              {journalStats.currentStreak} Day Streak
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8 px-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-frosted-strong">
            Daily Reflection
          </h2>
          <p className="text-lg text-frosted max-w-2xl mx-auto">
            Take time to reflect on your spiritual journey. Let AI guide your thoughts and provide insights 
            as you grow closer to Allah through mindful journaling.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card className="frosted-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pastel-peach to-pastel-yellow flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-frosted-strong" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-frosted-strong">{journalStats.currentStreak}</p>
                  <p className="text-sm text-frosted-light">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="frosted-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pastel-mint to-pastel-blue flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-frosted-strong" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-frosted-strong">{journalStats.totalEntries}</p>
                  <p className="text-sm text-frosted-light">Total Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="frosted-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pastel-pink to-pastel-lavender flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-frosted-strong" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-frosted-strong">{journalStats.weeklyProgress}</p>
                  <p className="text-sm text-frosted-light">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="frosted-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pastel-blue to-pastel-pink flex items-center justify-center">
                  <Heart className="h-6 w-6 text-frosted-strong" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-frosted-strong">{Math.round((journalStats.weeklyProgress / journalStats.weeklyGoal) * 100)}%</p>
                  <p className="text-sm text-frosted-light">Weekly Goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Journal Entry */}
        <Card className="frosted-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-frosted-strong">
              <Sparkles className="h-5 w-5" />
              Today's Reflection Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <JournalPrompt onPromptGenerated={handlePromptGenerated} />
            
            <div className="space-y-4">
              <Textarea
                placeholder="Write your reflection here... Share your thoughts, feelings, and insights."
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                className="frosted-input min-h-[150px] resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-frosted-light">
                  {currentEntry.length} characters
                </p>
                <Button 
                  onClick={handleSubmitEntry}
                  className="frosted-button px-6"
                  disabled={!currentEntry.trim() || !currentPrompt}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Reflection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal History */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-frosted-strong" />
            <h2 className="text-2xl font-bold text-frosted-strong">
              Journal History
            </h2>
            <Badge className="bg-gradient-to-r from-pastel-mint to-pastel-blue text-frosted-strong border-0">
              {entries.length} Entries
            </Badge>
          </div>

          <div className="space-y-6">
            {entries.map((entry, index) => (
              <div key={entry.id}>
                <Card className="frosted-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-frosted-strong pr-4">{entry.prompt}</h3>
                      <Badge className="bg-gradient-to-r from-pastel-pink/30 to-pastel-lavender/30 text-frosted-strong border-0 shrink-0">
                        {entry.date}
                      </Badge>
                    </div>
                    <p className="text-frosted leading-relaxed">{entry.content}</p>
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pastel-mint to-pastel-blue flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-frosted-strong" />
                        </div>
                        <span className="text-sm font-medium text-frosted-strong">AI Insight</span>
                      </div>
                      <p className="text-sm text-frosted italic bg-gradient-to-r from-white/10 to-white/5 p-3 rounded-lg">
                        {entry.aiInsight}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Show sponsor card after second entry */}
                {index === 1 && (
                  <div className="mt-6">
                    <SponsorCard 
                      sponsor={mockSponsor} 
                      context="journey"
                      onInteraction={(id, action) => console.log(`Sponsor ${id} ${action}`)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <Card className="frosted-card">
          <CardHeader>
            <CardTitle className="text-frosted-strong flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-frosted">This Week's Goal</span>
                <span className="text-frosted-strong font-bold">{journalStats.weeklyProgress}/{journalStats.weeklyGoal} entries</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-pastel-peach to-pastel-yellow h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(journalStats.weeklyProgress / journalStats.weeklyGoal) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-frosted-light">
                Keep up the great work! You're building a beautiful habit of reflection.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
