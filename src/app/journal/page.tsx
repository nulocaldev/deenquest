"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, BookOpen, Calendar, Search, Brain, Heart, Star, Sparkles, MessageCircle, Filter } from "lucide-react";
import JournalPrompt from "@/components/journal/JournalPrompt";
import { NativeSponsor } from "@/components/NativeSponsor";
import { useClientTime } from "@/hooks/useClientTime";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  tags: string[];
  isPrivate: boolean;
  aiInsights?: string;
}

export default function JournalPage() {
  const { formatDate } = useClientTime();
  const [newEntry, setNewEntry] = useState({ title: "", content: "", mood: "peaceful" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const journalStats = {
    totalEntries: 12,
    currentStreak: 5,
    longestStreak: 14,
    totalWords: 3420,
    averageWordsPerEntry: 285,
    topMood: "grateful"
  };

  const journalEntries: JournalEntry[] = [
    {
      id: "1",
      title: "Gratitude in Small Moments",
      content: "Today I reflected on the beauty of Allah's creation during my morning walk. The gentle breeze and chirping birds reminded me of His endless mercy...",
      date: "2024-01-15",
      mood: "grateful",
      tags: ["gratitude", "nature", "morning"],
      isPrivate: false,
      aiInsights: "Your reflection shows deep appreciation for Allah's creation. Consider exploring verses about nature in the Quran."
    },
    {
      id: "2", 
      title: "Patience During Challenges",
      content: "Faced some difficulties at work today, but remembered the verse about Allah not burdening a soul beyond what it can bear. This brought me peace...",
      date: "2024-01-14",
      mood: "contemplative",
      tags: ["patience", "challenges", "quran"],
      isPrivate: true,
      aiInsights: "Your application of Quranic wisdom to daily challenges shows spiritual growth. Patience is a beautiful virtue to cultivate."
    },
    {
      id: "3",
      title: "Community and Brotherhood",
      content: "Attended Jummah prayer today and felt the strong bonds of our community. The imam's khutbah about helping others resonated deeply...",
      date: "2024-01-13",
      mood: "connected",
      tags: ["community", "prayer", "brotherhood"],
      isPrivate: false,
      aiInsights: "Your connection to the community reflects the Islamic value of ummah. Beautiful reminder of our collective journey."
    }
  ];

  const aiPrompts = [
    "Reflect on a moment today when you felt Allah's guidance",
    "What Islamic teaching has most influenced your recent decisions?",
    "Describe how you've grown spiritually this week",
    "What duas have brought you comfort recently?"
  ];

  const moodColors = {
    grateful: "text-pastel-yellow border-pastel-yellow/30",
    peaceful: "text-pastel-mint border-pastel-mint/30", 
    contemplative: "text-pastel-purple border-pastel-purple/30",
    connected: "text-pastel-blue border-pastel-blue/30",
    hopeful: "text-pastel-pink border-pastel-pink/30"
  };

  const allTags = ["all", "gratitude", "nature", "patience", "challenges", "community", "prayer", "reflection"];

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "all" || entry.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen frosted-bg">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="frosted-glass px-6 py-3 rounded-full border border-white/10">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="frosted-hover rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-bold pastel-gradient">Spiritual Journal</h1>
              <p className="text-xs text-white/60">Reflect & Grow</p>
            </div>
            <Button className="frosted-button-sm rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 space-y-12">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-pastel-blue" />
                <div className="text-xl font-bold text-white">{journalStats.totalEntries}</div>
                <div className="text-xs text-white/60">Total Entries</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-pastel-mint" />
                <div className="text-xl font-bold text-white">{journalStats.currentStreak}</div>
                <div className="text-xs text-white/60">Day Streak</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-pastel-yellow" />
                <div className="text-xl font-bold text-white">{journalStats.longestStreak}</div>
                <div className="text-xs text-white/60">Best Streak</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-pastel-purple" />
                <div className="text-xl font-bold text-white">{journalStats.totalWords}</div>
                <div className="text-xs text-white/60">Total Words</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Brain className="h-6 w-6 mx-auto mb-2 text-pastel-pink" />
                <div className="text-xl font-bold text-white">{journalStats.averageWordsPerEntry}</div>
                <div className="text-xs text-white/60">Avg Words</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-pastel-coral" />
                <div className="text-xl font-bold text-white">{journalStats.topMood}</div>
                <div className="text-xs text-white/60">Top Mood</div>
              </div>
            </div>
          </section>

          {/* AI-Powered Prompt */}
          <section className="mb-12">
            <JournalPrompt prompts={aiPrompts} />
          </section>

          {/* Quick Write */}
          <section className="mb-12">
            <div className="frosted-glass p-6 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-pastel-mint" />
                Quick Journal Entry
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  className="frosted-glass border-white/10 text-white placeholder:text-white/40 h-12 rounded-2xl"
                />
                <Textarea
                  placeholder="What's on your heart today? Reflect on your spiritual journey, gratitude, or lessons learned..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  className="frosted-glass border-white/10 text-white placeholder:text-white/40 min-h-32 rounded-2xl resize-none"
                />
                <div className="flex items-center justify-between">
                  <select 
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
                    className="frosted-glass border-white/10 text-white bg-transparent rounded-xl px-4 py-2"
                  >
                    <option value="grateful" className="bg-gray-800">Grateful 🙏</option>
                    <option value="peaceful" className="bg-gray-800">Peaceful ☮️</option>
                    <option value="contemplative" className="bg-gray-800">Contemplative 🤔</option>
                    <option value="connected" className="bg-gray-800">Connected 🤝</option>
                    <option value="hopeful" className="bg-gray-800">Hopeful 🌟</option>
                  </select>
                  <Button className="frosted-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Save Entry
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Search and Filter */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search your journal entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="frosted-glass pl-12 h-12 rounded-2xl border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-full whitespace-nowrap ${
                      selectedTag === tag 
                        ? "bg-pastel-purple/30 text-white border-pastel-purple/50" 
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Journal Entries */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold pastel-gradient mb-2">Your Spiritual Journey</h3>
              <p className="text-white/70">Reflect on your thoughts, prayers, and Islamic learning experiences</p>
            </div>

            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="frosted-glass frosted-hover border-white/10 rounded-3xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                          <Badge className={`rounded-full ${moodColors[entry.mood as keyof typeof moodColors]}`}>
                            {entry.mood}
                          </Badge>
                          {entry.isPrivate && (
                            <Badge className="bg-white/10 text-white/70 border-white/20 rounded-full text-xs">
                              Private
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/70 text-sm mb-4">{entry.content}</p>
                        {entry.aiInsights && (
                          <div className="bg-white/5 p-4 rounded-2xl mb-4">
                            <div className="flex items-start gap-3">
                              <Brain className="h-4 w-4 text-pastel-purple mt-0.5" />
                              <div>
                                <p className="text-xs text-pastel-purple font-medium mb-1">AI Insight</p>
                                <p className="text-white/80 text-sm">{entry.aiInsights}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {entry.tags.map((tag) => (
                              <Badge key={tag} className="bg-white/10 text-white/70 border-white/20 rounded-full text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-white/50 text-sm">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Native Sponsor Integration */}
          <section className="mb-12">
            <NativeSponsor 
              context="journal"
              integrationType="resource"
              className="backdrop-blur-md"
            />
          </section>

          {/* AI Reflection Coach */}
          <section className="mb-12">
            <div className="frosted-glass p-6 rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Your AI Reflection Coach</h3>
                  <p className="text-white/70 mb-4">
                    Get personalized insights about your spiritual journey based on your journal entries and Islamic teachings.
                  </p>
                  <Button className="frosted-button">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Reflection Session
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
