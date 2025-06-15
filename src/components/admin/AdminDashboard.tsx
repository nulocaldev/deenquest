"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  BookOpen,
  MessageSquare,
  Trophy,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Sparkles,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCards: number;
  totalJournalEntries: number;
  totalGamesPlayed: number;
  avgSessionTime: string;
}

interface HikmahCardData {
  id: string;
  title: string;
  content: string;
  source: string;
  rarity: string;
  points: number;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalCards: 150,
    totalJournalEntries: 3421,
    totalGamesPlayed: 8934,
    avgSessionTime: "12m 34s",
  });

  const [hikmahCards] = useState<HikmahCardData[]>([
    {
      id: "1",
      title: "Patience is a Virtue",
      content: "Indeed, Allah is with the patient.",
      source: "Quran 2:153",
      rarity: "rare",
      points: 50,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "The Value of Time",
      content:
        "Take advantage of five before five: your youth before your old age...",
      source: "Prophet Muhammad ﷺ",
      rarity: "epic",
      points: 75,
      createdAt: "2024-01-14",
    },
  ]);

  const handleExportData = React.useCallback(
    (type: string) => {
      let data;
      let filename;

      switch (type) {
        case "users":
          data = { stats, exportDate: new Date().toISOString() };
          filename = "user-analytics.json";
          break;
        case "cards":
          data = hikmahCards;
          filename = "hikmah-cards.json";
          break;
        case "all":
          data = { stats, hikmahCards, exportDate: new Date().toISOString() };
          filename = "admin-dashboard-export.json";
          break;
        default:
          return;
      }

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
    [stats, hikmahCards],
  );

  return (
    <div className="min-h-screen aurora-bg p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-aurora-purple bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your DeenQuest platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => handleExportData("all")}
              className="glass-morphism hover:bg-white/10 text-white border-white/20 rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button className="bg-aurora-purple hover:bg-aurora-purple/80 text-white rounded-2xl">
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-morphism border-white/10 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Users className="h-4 w-4 text-aurora-blue" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {stats.totalUsers.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeUsers} active this week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-white/10 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-aurora-purple" />
              Hikmah Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{stats.totalCards}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Available in collection
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-white/10 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-aurora-cyan" />
              Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {stats.totalJournalEntries.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total reflections written
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-white/10 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-aurora-yellow" />
              Games Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {stats.totalGamesPlayed.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Avg session: {stats.avgSessionTime}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="glass-morphism grid w-full grid-cols-4 p-1 rounded-2xl border-white/10 mb-6">
          <TabsTrigger
            value="cards"
            className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
          >
            Hikmah Cards
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
          >
            User Management
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
          >
            AI Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">
              Hikmah Cards Management
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExportData("cards")}
                variant="ghost"
                size="sm"
                className="glass-morphism hover:bg-white/10 text-white border-white/20 rounded-2xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Cards
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="glass-morphism hover:bg-white/10 text-white border-white/20 rounded-2xl"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Cards
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {hikmahCards.map((card) => (
              <Card
                key={card.id}
                className="glass-morphism border-white/10 rounded-2xl"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{card.title}</CardTitle>
                      <CardDescription className="text-gray-300 mt-1">
                        {card.content.substring(0, 100)}...
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`rounded-full ${
                          card.rarity === "legendary"
                            ? "bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30"
                            : card.rarity === "epic"
                              ? "bg-aurora-purple/20 text-aurora-purple border-aurora-purple/30"
                              : card.rarity === "rare"
                                ? "bg-aurora-blue/20 text-aurora-blue border-aurora-blue/30"
                                : "bg-white/20 text-white border-white/30"
                        }`}
                      >
                        {card.rarity}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 rounded-full">
                        {card.points} pts
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>Source: {card.source}</p>
                    <p>Created: {card.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-aurora-cyan hover:bg-aurora-cyan/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">User Management</h3>
            <Button
              onClick={() => handleExportData("users")}
              variant="ghost"
              size="sm"
              className="glass-morphism hover:bg-white/10 text-white border-white/20 rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export User Data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-aurora-blue" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Daily Active Users</span>
                  <span className="text-white font-semibold">456</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Weekly Active Users</span>
                  <span className="text-white font-semibold">
                    {stats.activeUsers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly Active Users</span>
                  <span className="text-white font-semibold">1,156</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-aurora-yellow" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Highest Points</span>
                  <span className="text-aurora-yellow font-semibold">
                    2,450 pts
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Longest Streak</span>
                  <span className="text-aurora-cyan font-semibold">
                    45 days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Most Cards</span>
                  <span className="text-aurora-purple font-semibold">
                    89/150
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Platform Analytics</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Avg. Session Time</span>
                  <span className="text-white">{stats.avgSessionTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cards per Session</span>
                  <span className="text-white">3.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Return Rate</span>
                  <span className="text-aurora-cyan">78%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Content Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Most Popular Rarity</span>
                  <span className="text-aurora-purple">Epic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Avg. Journal Length</span>
                  <span className="text-white">127 words</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Game Completion</span>
                  <span className="text-aurora-yellow">85%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">New Users (7d)</span>
                  <span className="text-aurora-cyan">+127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Retention (30d)</span>
                  <span className="text-white">64%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Growth Rate</span>
                  <span className="text-aurora-yellow">+12%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <h3 className="text-2xl font-bold text-white">AI Configuration</h3>

          <div className="grid gap-6">
            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-aurora-purple" />
                  Journal Prompts
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure AI-generated reflection prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Prompt Frequency</span>
                  <Badge className="bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30 rounded-full">
                    Daily
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Personalization Level</span>
                  <Badge className="bg-aurora-purple/20 text-aurora-purple border-aurora-purple/30 rounded-full">
                    High
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Response Style</span>
                  <Badge className="bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30 rounded-full">
                    Encouraging
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-aurora-purple hover:bg-aurora-purple/80 text-white rounded-2xl">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Prompts
                </Button>
              </CardFooter>
            </Card>

            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-aurora-blue" />
                  Chat Assistant
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage AI chat responses and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Response Tone</span>
                  <Badge className="bg-aurora-blue/20 text-aurora-blue border-aurora-blue/30 rounded-full">
                    Respectful
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Knowledge Base</span>
                  <Badge className="bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30 rounded-full">
                    Islamic Sources
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Safety Filter</span>
                  <Badge className="bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30 rounded-full">
                    Enabled
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-aurora-blue hover:bg-aurora-blue/80 text-white rounded-2xl">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Chat
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
