"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trophy, Play, Star, MessageCircle, Brain, Gamepad2, Target, Search, TrendingUp } from "lucide-react";
import GameSelector from "@/components/games/GameSelector";
import { NativeSponsor } from "@/components/NativeSponsor";

interface Game {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  category?: string;
  isLocked?: boolean;
  icon: string;
  color: string;
}

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userStats = {
    gamesPlayed: 42,
    highScore: 940,
    totalPoints: 2450,
    averageScore: 685,
    streak: 5
  };

  const games: Game[] = [
    {
      id: 1,
      title: "Hikmah Memory",
      description: "Match Islamic terms with their beautiful meanings and wisdom",
      difficulty: "Easy",
      points: 20,
      icon: "🧠",
      color: "emerald-500",
      category: "memory",
      isLocked: false
    },
    {
      id: 2,
      title: "Islamic Trivia Quest",
      description: "Journey through Islamic history, teachings, and beautiful stories",
      difficulty: "Medium",
      points: 35,
      icon: "📚",
      color: "blue-500",
      category: "trivia",
      isLocked: false
    },
    {
      id: 3,
      title: "Wisdom Challenges",
      description: "Apply Islamic principles to real-life scenarios with guidance",
      difficulty: "Hard",
      points: 50,
      icon: "💡",
      color: "purple-500",
      category: "wisdom",
      isLocked: false
    },
    {
      id: 4,
      title: "Quran Reflection",
      description: "Contemplate and connect verses with their deeper meanings",
      difficulty: "Medium",
      points: 30,
      icon: "📖",
      color: "teal-500",
      category: "reflection",
      isLocked: false
    }
  ];

  const recentScores = [
    { game: "Hikmah Memory", score: 850, date: "Today", improvement: "+12%" },
    { game: "Islamic Trivia Quest", score: 720, date: "Yesterday", improvement: "+8%" },
    { game: "Wisdom Challenges", score: 940, date: "2 days ago", improvement: "+25%" }
  ];

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const aiGameSuggestions = [
    "Try the Wisdom Challenges to deepen your understanding of Islamic principles",
    "Memory games can help you memorize beautiful Islamic concepts",
    "Quran Reflection games offer peaceful contemplation time"
  ];

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
              <h1 className="text-lg font-bold pastel-gradient">Hikmah Games</h1>
              <p className="text-xs text-white/60">Learn Through Play</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 space-y-12">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Gamepad2 className="h-6 w-6 mx-auto mb-2 text-pastel-purple" />
                <div className="text-xl font-bold text-white">{userStats.gamesPlayed}</div>
                <div className="text-xs text-white/60">Games Played</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-pastel-yellow" />
                <div className="text-xl font-bold text-white">{userStats.highScore}</div>
                <div className="text-xs text-white/60">High Score</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-pastel-pink" />
                <div className="text-xl font-bold text-white">{userStats.totalPoints}</div>
                <div className="text-xs text-white/60">Total Points</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-pastel-mint" />
                <div className="text-xl font-bold text-white">{userStats.averageScore}</div>
                <div className="text-xs text-white/60">Average Score</div>
              </div>
              <div className="frosted-glass p-4 rounded-2xl text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-pastel-coral" />
                <div className="text-xl font-bold text-white">{userStats.streak}</div>
                <div className="text-xs text-white/60">Day Streak</div>
              </div>
            </div>
          </section>

          {/* AI Game Coach */}
          <section className="mb-12">
            <div className="frosted-glass p-6 rounded-3xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Your AI Game Coach</h3>
                  <div className="space-y-2">
                    {aiGameSuggestions.map((suggestion, index) => (
                      <p key={index} className="text-white/80 text-sm bg-white/5 p-3 rounded-2xl">
                        {suggestion}
                      </p>
                    ))}
                  </div>
                  <Button className="mt-4 frosted-button">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Get Personalized Recommendations
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Search & Filter */}
          <section className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="frosted-glass pl-12 h-12 rounded-2xl border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </section>

          {/* Game Selection */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold pastel-gradient mb-2">Choose Your Adventure</h2>
              <p className="text-white/70">Learn Islamic wisdom through engaging games</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <Card 
                  key={game.id} 
                  className={`frosted-glass frosted-hover transition-all duration-300 cursor-pointer group border-white/10 rounded-3xl overflow-hidden ${selectedGame?.id === game.id ? 'ring-2 ring-pastel-purple' : ''}`}
                  onClick={() => setSelectedGame(game)}
                >
                  <CardHeader className="pb-3 text-center">
                    <div className="text-4xl mb-3">{game.icon}</div>
                    <CardTitle className="text-white text-xl">{game.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/70 text-center text-sm">{game.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge className={`bg-${game.color}/20 text-${game.color} border-${game.color}/30 rounded-full`}>
                        {game.difficulty}
                      </Badge>
                      <Badge className="bg-pastel-yellow/20 text-pastel-yellow border-pastel-yellow/30 rounded-full">
                        {game.points} pts
                      </Badge>
                    </div>
                    <Button className="w-full frosted-button">
                      <Play className="h-4 w-4 mr-2" />
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Performance */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold pastel-gradient mb-6 text-center">Recent Performance</h3>
            <div className="frosted-glass p-6 rounded-3xl">
              <div className="space-y-4">
                {recentScores.map((score, index) => (
                  <div key={index} className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-mint to-pastel-blue flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{score.game}</h4>
                        <p className="text-white/60 text-sm">{score.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-pastel-yellow">{score.score}</div>
                      <div className="text-xs text-pastel-mint">{score.improvement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Native Sponsor Integration */}
          <section className="mb-12">
            <NativeSponsor 
              context="games"
              integrationType="achievement"
              className="backdrop-blur-md"
            />
          </section>

          {/* Selected Game Interface */}
          {selectedGame && (
            <section className="mb-12">
              <div className="frosted-glass p-8 rounded-3xl">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedGame.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Now Playing: {selectedGame.title}</h3>
                  <p className="text-white/70">{selectedGame.description}</p>
                </div>
                <GameSelector onSelectGame={(gameId) => console.log('Playing game:', gameId)} />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
