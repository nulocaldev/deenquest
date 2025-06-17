"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Sparkles, BookOpen } from "lucide-react";
import JournalPrompt from "@/components/journal/JournalPrompt";

export default function JournalPage() {
  const [currentEntry, setCurrentEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [entries, setEntries] = useState([
    {
      id: 1,
      prompt: "Reflect on a moment when patience guided you through difficulty",
      content: "Today I reflected on waiting for my exam results...",
      date: "2024-01-15",
      aiInsight: "Your reflection shows growth in trusting Allah's timing."
    }
  ]);

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

  return (
    <div className="min-h-screen elegant-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full elegant-header">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-accent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                AI Journal
              </h1>
              <p className="text-xs text-muted-foreground">
                Reflect & Grow
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8 px-6 max-w-4xl mx-auto">
        {/* New Journal Entry */}
        <Card className="glass-morphism border-white/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-aurora-cyan" />
              Today's Reflection Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <JournalPrompt onPromptGenerated={handlePromptGenerated} />
            <div className="space-y-4">
              <Textarea
                placeholder="Write your reflection here..."
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                className="min-h-[120px] glass-morphism border-white/10 text-white placeholder-gray-400 resize-none"
              />
              <Button 
                onClick={handleSubmitEntry}
                className="bg-gradient-to-r from-aurora-cyan to-aurora-blue hover:from-aurora-cyan/80 hover:to-aurora-blue/80 text-white rounded-2xl px-6"
                disabled={!currentEntry.trim() || !currentPrompt}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Reflection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Journal History */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-aurora-purple" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-aurora-purple bg-clip-text text-transparent">
              Journal History
            </h2>
          </div>

          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="glass-morphism border-white/10 rounded-3xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{entry.prompt}</h3>
                    <span className="text-sm text-gray-400">{entry.date}</span>
                  </div>
                  <p className="text-gray-300">{entry.content}</p>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-aurora-cyan" />
                      <span className="text-sm font-medium text-aurora-cyan">AI Insight</span>
                    </div>
                    <p className="text-sm text-gray-300 italic">{entry.aiInsight}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
