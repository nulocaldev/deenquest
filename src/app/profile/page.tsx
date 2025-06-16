"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Trophy, Star, Calendar, TrendingUp, MessageCircle, Brain, Settings, Target, Zap, Award } from "lucide-react";
import { NativeSponsor } from "@/components/NativeSponsor";
import { useClientTime } from "@/hooks/useClientTime";

export default function ProfilePage() {
  const { formatDate } = useClientTime();
  
  const [userStats] = useState({
    points: 1250,
    cardsCollected: 24,
    totalCards: 100,
    journalEntries: 12,
    streak: 7,
    level: 5,
    joinDate: "January 2024",
    gamesPlayed: 42,
    chatSessions: 89,
    dailyGoal: 50,
    dailyProgress: 35
  });

  const achievements = [
    { name: "First Steps", description: "Complete your first journal entry", completed: true, date: "2024-01-15", icon: "✨", rarity: "common" },
    { name: "Card Collector", description: "Collect 10 Hikmah Cards", completed: true, date: "2024-01-20", icon: "🎴", rarity: "common" },
    { name: "Streak Master", description: "Maintain a 7-day streak", completed: true, date: "2024-01-25", icon: "🔥", rarity: "rare" },
    { name: "Wisdom Seeker", description: "Complete 20 journal entries", completed: false, progress: 12, total: 20, icon: "📖", rarity: "uncommon" },
    { name: "Chat Master", description: "Have 50 AI conversations", completed: false, progress: 23, total: 50, icon: "💬", rarity: "rare" },
    { name: "Game Champion", description: "Win 10 games", completed: false, progress: 6, total: 10, icon: "🏆", rarity: "epic" }
  ];

  const pointHistory = [
    { date: "Today", action: "Journal Entry", points: 25, icon: "📝" },
    { date: "Yesterday", action: "Card Collection", points: 50, icon: "🎴" },
    { date: "2 days ago", action: "Game Victory", points: 35, icon: "🏆" },
    { date: "3 days ago", action: "Chat Interaction", points: 10, icon: "💬" },
    { date: "4 days ago", action: "Daily Login", points: 5, icon: "✨" }
  ];

  const aiInsights = [
    "You're most active in the evenings - consider setting reminders for consistent practice",
    "Your journal entries show deep reflection - you're developing excellent self-awareness",
    "Games are your favorite feature - try mixing in more chat sessions for balanced growth"
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/30';
      case 'uncommon': return 'text-pastel-mint border-pastel-mint/30';
      case 'rare': return 'text-pastel-purple border-pastel-purple/30';
      case 'epic': return 'text-pastel-yellow border-pastel-yellow/30';
      default: return 'text-white border-white/30';
    }
  };

  return (
    <div className="min-h-screen pastel-bg-primary">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="frosted-card px-6 py-3 rounded-full border border-white/10">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-bold pastel-gradient">Your Profile</h1>
              <p className="text-xs text-frosted-light">Track Your Journey</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-6 space-y-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Overview - Compact & Aligned */}
          <section className="mb-6">
            <div className="frosted-card p-5 rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="relative flex-shrink-0 self-center md:self-start">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-pastel-yellow to-pastel-coral rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {userStats.level}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  {/* User Info & Edit Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-frosted-strong mb-1">DeenQuest Explorer</h2>
                      <p className="text-frosted text-sm">Growing in wisdom since {userStats.joinDate}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="rounded-full text-sm mt-2 sm:mt-0">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  
                  {/* Stats Grid - More Prominent */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-pastel-yellow">{userStats.points}</div>
                      <div className="text-xs text-frosted-light">Points</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-pastel-purple">{userStats.cardsCollected}</div>
                      <div className="text-xs text-frosted-light">Cards</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-pastel-mint">{userStats.journalEntries}</div>
                      <div className="text-xs text-frosted-light">Journals</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-pastel-pink">{userStats.streak}</div>
                      <div className="text-xs text-frosted-light">Streak</div>
                    </div>
                  </div>
                  
                  {/* Integrated Sponsor Badge */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="text-xs text-frosted-light">Member since {userStats.joinDate}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-frosted-light">Supported by</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-400/30">
                        <Award className="w-3 h-3 mr-1" />
                        Platinum Partner
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Daily Progress */}
          <section className="mb-6">
            <div className="frosted-card p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-pastel-mint" />
                  <h3 className="text-lg font-bold text-frosted-strong">Today's Progress</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-pastel-mint">{userStats.dailyProgress}/{userStats.dailyGoal}</div>
                  <div className="text-xs text-frosted-light">Daily Goal</div>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-pastel-mint to-pastel-blue h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(userStats.dailyProgress / userStats.dailyGoal) * 100}%` }}
                ></div>
              </div>
              <p className="text-frosted text-sm">
                {userStats.dailyGoal - userStats.dailyProgress} points to reach your daily goal
              </p>
            </div>
          </section>

          {/* AI Personal Coach */}
          <section className="mb-8">
            <div className="frosted-card p-5 rounded-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-frosted-strong mb-3">Your AI Growth Coach</h3>
                  <div className="space-y-2">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pastel-yellow to-pastel-coral flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="h-3 w-3 text-white" />
                        </div>
                        <p className="text-frosted text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-3 frosted-button text-sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Get Personalized Advice
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="mb-8">
            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className="frosted-card grid w-full grid-cols-3 p-1 rounded-2xl border-white/10 mb-6">
                <TabsTrigger
                  value="achievements"
                  className="rounded-xl data-[state=active]:bg-pastel-purple/40 data-[state=active]:text-frosted-strong text-frosted transition-all font-medium"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger
                  value="progress"
                  className="rounded-xl data-[state=active]:bg-pastel-purple/40 data-[state=active]:text-frosted-strong text-frosted transition-all font-medium"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-xl data-[state=active]:bg-pastel-purple/40 data-[state=active]:text-frosted-strong text-frosted transition-all font-medium"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold pastel-gradient mb-2">Your Achievements</h3>
                  <p className="text-frosted text-sm">Celebrate your Islamic learning journey milestones</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card key={index} className={`frosted-card border-white/10 rounded-2xl transition-all duration-300 ${achievement.completed ? 'ring-2 ring-pastel-yellow/50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-frosted-strong font-medium text-sm truncate">{achievement.name}</h3>
                              <Badge className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(achievement.rarity)} flex-shrink-0`}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-frosted text-xs mb-2 line-clamp-2">{achievement.description}</p>
                            {achievement.completed ? (
                              <Badge className="bg-pastel-yellow/20 text-pastel-yellow border-pastel-yellow/30 rounded-full text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-frosted-light">Progress</span>
                                  <span className="text-pastel-mint">{achievement.progress}/{achievement.total}</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                  <div 
                                    className="bg-gradient-to-r from-pastel-mint to-pastel-blue h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
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

              <TabsContent value="progress" className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold pastel-gradient mb-2">Growth Analytics</h3>
                  <p className="text-frosted text-sm">Track your Islamic learning progress over time</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="frosted-card border-white/10 rounded-2xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-frosted-strong flex items-center gap-2 text-lg">
                        <Award className="h-4 w-4 text-pastel-yellow" />
                        Level Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-frosted text-sm">Current Level</span>
                          <span className="text-pastel-mint font-bold">Level {userStats.level}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-pastel-purple to-pastel-pink h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-frosted-light">
                          <span>1,250 / 2,000 points</span>
                          <span>Next: Level 6</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="frosted-card border-white/10 rounded-2xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-frosted-strong flex items-center gap-2 text-lg">
                        <Trophy className="h-4 w-4 text-pastel-purple" />
                        Collection Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-frosted text-sm">Hikmah Cards</span>
                          <span className="text-pastel-purple font-bold">{userStats.cardsCollected}/{userStats.totalCards}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-pastel-purple to-pastel-pink h-2 rounded-full" style={{ width: `${(userStats.cardsCollected / userStats.totalCards) * 100}%` }}></div>
                        </div>
                        <div className="text-xs text-frosted-light">
                          {userStats.totalCards - userStats.cardsCollected} cards remaining
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold pastel-gradient mb-2">Recent Activity</h3>
                  <p className="text-frosted text-sm">Your latest Islamic learning activities and points earned</p>
                </div>
                <Card className="frosted-card border-white/10 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {pointHistory.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-white/5 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pastel-mint to-pastel-blue flex items-center justify-center">
                              <span className="text-xs">{entry.icon}</span>
                            </div>
                            <div>
                              <h4 className="text-frosted-strong font-medium text-sm">{entry.action}</h4>
                              <p className="text-frosted-light text-xs">{entry.date}</p>
                            </div>
                          </div>
                          <Badge className="bg-pastel-yellow/20 text-pastel-yellow border-pastel-yellow/30 rounded-full text-xs">
                            +{entry.points} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
}
