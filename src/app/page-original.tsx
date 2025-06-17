"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  MessageCircle,
  Trophy,
  User,
  Download,
  Share2,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import HikmahCard from "@/components/hikmah/HikmahCard";

export default function Home() {
  const [userStats] = useState({
    points: 1250,
    cardsCollected: 24,
    totalCards: 100,
    journalEntries: 12,
    streak: 7,
    level: 5,
  });

  const downloadProgress = React.useCallback(() => {
    const progressData = {
      user: "DeenQuest User",
      stats: userStats,
      achievements: [
        { name: "First Card", completed: true, date: "2024-01-15" },
        { name: "5-Day Streak", completed: true, date: "2024-01-20" },
        { name: "Journal Master", completed: false },
        { name: "Game Champion", completed: false },
      ],
      recentActivity: [
        { action: "Collected a new Hikmah Card", time: "Today, 10:23 AM" },
        { action: "Completed a Journal Entry", time: "Yesterday, 8:45 PM" },
        { action: "Won Memory Match Game", time: "2 days ago" },
      ],
    };

    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "deenquest-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [userStats]);

  const shareProgress = React.useCallback(async () => {
    const shareText = `🌟 My DeenQuest Progress 🌟\n\n📊 Level ${userStats.level}\n🏆 ${userStats.points} Points\n📚 ${userStats.cardsCollected}/${userStats.totalCards} Hikmah Cards\n✍️ ${userStats.journalEntries} Journal Entries\n🔥 ${userStats.streak} Day Streak\n\nJoin me on this spiritual journey! #DeenQuest #IslamicWisdom`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My DeenQuest Progress",
          text: shareText,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Progress copied to clipboard!");
    }
  }, [userStats]);

  return (
    <div className="min-h-screen aurora-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full ios-blur">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-aurora-purple" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-aurora-pink rounded-full animate-pulse-glow"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-aurora-purple to-aurora-pink bg-clip-text text-transparent">
                DeenQuest
              </h1>
              <p className="text-xs text-muted-foreground">
                Level {userStats.level} Explorer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadProgress}
                className="glass-morphism hover:bg-white/10 text-white border-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={shareProgress}
                className="glass-morphism hover:bg-white/10 text-white border-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Badge className="glass-morphism flex gap-2 items-center px-4 py-2 text-white border-aurora-purple/30 bg-aurora-purple/20">
              <Trophy className="h-4 w-4 text-aurora-yellow" />
              <span className="font-semibold">
                {userStats.points.toLocaleString()}
              </span>
              <Sparkles className="h-3 w-3 text-aurora-cyan" />
            </Badge>

            <Link href="/profile">
              <div className="relative cursor-pointer">
                <Avatar className="h-12 w-12 ring-2 ring-aurora-purple/50 ring-offset-2 ring-offset-background hover:ring-aurora-purple/70 transition-all">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                    alt="User"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-aurora-purple to-aurora-pink text-white font-bold">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-aurora-cyan rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {userStats.level}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-12 px-6">
        {/* Featured Hikmah Card */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-aurora-cyan bg-clip-text text-transparent">
                Hikmah of the Day
              </h2>
              <p className="text-muted-foreground mt-1">
                Discover divine wisdom
              </p>
            </div>
            <Link href="/cards">
              <Button
                className="glass-morphism hover:bg-white/10 text-white border-white/20 rounded-2xl px-6"
                size="sm"
              >
                <Star className="h-4 w-4 mr-2" />
                View All Cards
              </Button>
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="animate-float">
              <HikmahCard
                title="Patience is a Virtue"
                content="Indeed, Allah is with the patient."
                source="Quran 2:153"
                rarity="rare"
                points={50}
              />
            </div>
          </div>
        </section>

        {/* Quick Access Features */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-aurora-purple bg-clip-text text-transparent">
              Explore Features
            </h2>
            <p className="text-muted-foreground mt-1">
              Your spiritual journey awaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/cards">
              <Card className="glass-morphism hover:shadow-aurora transition-all duration-300 cursor-pointer group border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="pb-3 relative">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-aurora-pink rounded-full animate-pulse-glow"></div>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="p-2 rounded-2xl bg-aurora-purple/20 group-hover:bg-aurora-purple/30 transition-colors">
                      <BookOpen className="h-6 w-6 text-aurora-purple" />
                    </div>
                    <div>
                      <span className="text-lg">Hikmah Cards</span>
                      <p className="text-xs text-muted-foreground font-normal">
                        Collect & Learn
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <CardDescription className="text-gray-300">
                    Collect and explore Islamic wisdom cards with beautiful
                    designs
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Badge className="bg-aurora-pink/20 text-aurora-pink border-aurora-pink/30 rounded-full">
                    <Sparkles className="h-3 w-3 mr-1" />
                    10 New Cards
                  </Badge>
                </CardFooter>
              </Card>
            </Link>

            <Link href="/journal">
              <Card className="glass-morphism hover:shadow-aurora transition-all duration-300 cursor-pointer group border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="pb-3 relative">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-aurora-cyan rounded-full animate-pulse-glow"></div>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="p-2 rounded-2xl bg-aurora-cyan/20 group-hover:bg-aurora-cyan/30 transition-colors">
                      <BookOpen className="h-6 w-6 text-aurora-cyan" />
                    </div>
                    <div>
                      <span className="text-lg">AI Journal</span>
                      <p className="text-xs text-muted-foreground font-normal">
                        Reflect & Grow
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <CardDescription className="text-gray-300">
                    Reflect on Islamic teachings with personalized AI guidance
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Badge className="bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30 rounded-full">
                    <Zap className="h-3 w-3 mr-1" />
                    Daily Prompt Ready
                  </Badge>
                </CardFooter>
              </Card>
            </Link>

            <Link href="/games">
              <Card className="glass-morphism hover:shadow-aurora transition-all duration-300 cursor-pointer group border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="pb-3 relative">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-aurora-yellow rounded-full animate-pulse-glow"></div>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="p-2 rounded-2xl bg-aurora-yellow/20 group-hover:bg-aurora-yellow/30 transition-colors">
                      <Trophy className="h-6 w-6 text-aurora-yellow" />
                    </div>
                    <div>
                      <span className="text-lg">Games</span>
                      <p className="text-xs text-muted-foreground font-normal">
                        Play & Earn
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <CardDescription className="text-gray-300">
                    Play Islamic knowledge games and earn points & rewards
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Badge className="bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30 rounded-full">
                    <Trophy className="h-3 w-3 mr-1" />3 Games Available
                  </Badge>
                </CardFooter>
              </Card>
            </Link>

            <Link href="/chat">
              <Card className="glass-morphism hover:shadow-aurora transition-all duration-300 cursor-pointer group border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="pb-3 relative">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-aurora-blue rounded-full animate-pulse-glow"></div>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="p-2 rounded-2xl bg-aurora-blue/20 group-hover:bg-aurora-blue/30 transition-colors">
                      <MessageCircle className="h-6 w-6 text-aurora-blue" />
                    </div>
                    <div>
                      <span className="text-lg">Hikmah Chat</span>
                      <p className="text-xs text-muted-foreground font-normal">
                        Ask & Learn
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <CardDescription className="text-gray-300">
                    Ask questions and receive Islamic guidance from AI
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Badge className="bg-aurora-blue/20 text-aurora-blue border-aurora-blue/30 rounded-full">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Assistant
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </section>

        {/* User Progress */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-aurora-yellow bg-clip-text text-transparent">
                Your Progress
              </h2>
              <p className="text-muted-foreground mt-1">
                Track your spiritual journey
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadProgress}
                className="glass-morphism hover:bg-white/10 text-white border-white/20 rounded-2xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={shareProgress}
                className="glass-morphism hover:bg-white/10 text-white border-white/20 rounded-2xl"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="glass-morphism grid w-full grid-cols-3 p-1 rounded-2xl border-white/10">
              <TabsTrigger
                value="stats"
                className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
              >
                Stats
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
              >
                Recent Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-morphism border-white/10 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-aurora-purple" />
                      Cards Collected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white mb-3">
                      {userStats.cardsCollected}/{userStats.totalCards}
                    </p>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-aurora-purple to-aurora-pink rounded-full transition-all duration-500"
                        style={{
                          width: `${(userStats.cardsCollected / userStats.totalCards) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.round(
                        (userStats.cardsCollected / userStats.totalCards) * 100,
                      )}
                      % Complete
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-morphism border-white/10 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-aurora-cyan" />
                      Journal Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white mb-2">
                      {userStats.journalEntries}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last entry: 2 days ago
                    </p>
                    <div className="mt-3 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-aurora-cyan" />
                      <span className="text-xs text-aurora-cyan">
                        Keep writing!
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism border-white/10 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-aurora-yellow" />
                      Learning Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white mb-2">
                      {userStats.streak} Days
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Keep it up!
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < userStats.streak
                              ? "bg-aurora-yellow"
                              : "bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "First Card", completed: true, color: "aurora-pink" },
                  {
                    name: "5-Day Streak",
                    completed: true,
                    color: "aurora-yellow",
                  },
                  {
                    name: "Journal Master",
                    completed: false,
                    color: "aurora-cyan",
                  },
                  {
                    name: "Game Champion",
                    completed: false,
                    color: "aurora-purple",
                  },
                ].map((achievement, index) => (
                  <Card
                    key={index}
                    className={`glass-morphism border-white/10 rounded-3xl transition-all duration-300 ${
                      achievement.completed
                        ? "shadow-aurora hover:scale-105"
                        : "opacity-50 hover:opacity-70"
                    }`}
                  >
                    <CardHeader className="pb-4 text-center">
                      <div
                        className={`mx-auto p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-3 ${
                          achievement.completed
                            ? `bg-${achievement.color}/20 shadow-glow`
                            : "bg-white/10"
                        }`}
                      >
                        <Trophy
                          className={`h-8 w-8 ${
                            achievement.completed
                              ? `text-${achievement.color}`
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <CardTitle
                        className={`text-sm ${
                          achievement.completed
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      >
                        {achievement.name}
                      </CardTitle>
                      {achievement.completed && (
                        <div className="flex justify-center mt-2">
                          <Badge className="bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30 text-xs rounded-full">
                            <Star className="h-3 w-3 mr-1" />
                            Unlocked
                          </Badge>
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    action: "Collected a new Hikmah Card",
                    time: "Today, 10:23 AM",
                    icon: BookOpen,
                    color: "aurora-purple",
                    points: "+50 pts",
                  },
                  {
                    action: "Completed a Journal Entry",
                    time: "Yesterday, 8:45 PM",
                    icon: BookOpen,
                    color: "aurora-cyan",
                    points: "+25 pts",
                  },
                  {
                    action: "Won Memory Match Game",
                    time: "2 days ago",
                    icon: Trophy,
                    color: "aurora-yellow",
                    points: "+100 pts",
                  },
                ].map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={index}
                      className="glass-morphism p-4 rounded-2xl border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-xl bg-${activity.color}/20`}
                        >
                          <IconComponent
                            className={`h-5 w-5 text-${activity.color}`}
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {activity.action}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`bg-${activity.color}/20 text-${activity.color} border-${activity.color}/30 rounded-full`}
                      >
                        {activity.points}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
