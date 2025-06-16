"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Trophy, Star, Calendar, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const [userStats] = useState({
    points: 1250,
    cardsCollected: 24,
    totalCards: 100,
    journalEntries: 12,
    streak: 7,
    level: 5,
    joinDate: "January 2024"
  });

  const achievements = [
    { name: "First Steps", description: "Complete your first journal entry", completed: true, date: "2024-01-15", icon: "✨" },
    { name: "Card Collector", description: "Collect 10 Hikmah Cards", completed: true, date: "2024-01-20", icon: "🎴" },
    { name: "Streak Master", description: "Maintain a 7-day streak", completed: true, date: "2024-01-25", icon: "🔥" },
    { name: "Wisdom Seeker", description: "Complete 20 journal entries", completed: false, progress: 12, total: 20, icon: "📖" },
    { name: "Game Champion", description: "Win 10 games", completed: false, progress: 6, total: 10, icon: "🏆" },
    { name: "Chat Master", description: "Have 50 AI conversations", completed: false, progress: 23, total: 50, icon: "💬" }
  ];

  const pointHistory = [
    { date: "Today", action: "Journal Entry", points: 25 },
    { date: "Yesterday", action: "Card Collection", points: 50 },
    { date: "2 days ago", action: "Game Victory", points: 35 },
    { date: "3 days ago", action: "Chat Interaction", points: 10 },
    { date: "4 days ago", action: "Daily Login", points: 5 }
  ];

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
                User Profile
              </h1>
              <p className="text-xs text-muted-foreground">
                Track Your Journey
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8 px-6 max-w-6xl mx-auto">
        {/* Profile Overview */}
        <Card className="elegant-card">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-aurora-cyan rounded-full flex items-center justify-center text-sm font-bold text-black">
                  {userStats.level}
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">DeenQuest Explorer</h2>
                <p className="text-gray-300 mb-4">Member since {userStats.joinDate}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-aurora-yellow">{userStats.points}</div>
                    <div className="text-sm text-gray-400">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-aurora-purple">{userStats.cardsCollected}</div>
                    <div className="text-sm text-gray-400">Cards Collected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-aurora-cyan">{userStats.journalEntries}</div>
                    <div className="text-sm text-gray-400">Journal Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-aurora-pink">{userStats.streak}</div>
                    <div className="text-sm text-gray-400">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="glass-morphism grid w-full grid-cols-3 p-1 rounded-2xl border-white/10">
            <TabsTrigger
              value="achievements"
              className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Point History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`glass-morphism border-white/10 rounded-3xl ${achievement.completed ? 'ring-2 ring-aurora-yellow/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{achievement.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
                        {achievement.completed ? (
                          <Badge className="bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30">
                            <Star className="h-3 w-3 mr-1" />
                            Completed {achievement.date}
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-aurora-cyan">{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-aurora-cyan to-aurora-blue h-2 rounded-full"
                                style={{ width: achievement.progress !== undefined && achievement.total ? `${(achievement.progress / achievement.total) * 100}%` : "0%" }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-morphism border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-white">Level Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Level</span>
                      <span className="text-aurora-cyan font-bold">Level {userStats.level}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-aurora-purple to-aurora-pink h-3 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>1,250 / 2,000 points</span>
                      <span>Next: Level 6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-white/10 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-white">Collection Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Hikmah Cards</span>
                      <span className="text-aurora-purple font-bold">{userStats.cardsCollected}/{userStats.totalCards}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-aurora-purple to-aurora-pink h-3 rounded-full" style={{ width: `${(userStats.cardsCollected / userStats.totalCards) * 100}%` }}></div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {userStats.totalCards - userStats.cardsCollected} cards remaining
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white">Recent Point Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pointHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                      <div>
                        <h3 className="text-white font-medium">{entry.action}</h3>
                        <p className="text-gray-400 text-sm">{entry.date}</p>
                      </div>
                      <Badge className="bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30">
                        +{entry.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
