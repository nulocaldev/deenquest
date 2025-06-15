"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Play, Star } from "lucide-react";
import GameSelector from "@/components/games/GameSelector";

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 1,
      title: "Memory Matching",
      description: "Match Islamic terms with their meanings",
      difficulty: "Easy",
      points: 20,
      icon: "🧠",
      color: "aurora-cyan"
    },
    {
      id: 2,
      title: "Islamic Trivia",
      description: "Test your knowledge of Islamic history and teachings",
      difficulty: "Medium",
      points: 35,
      icon: "📚",
      color: "aurora-purple"
    },
    {
      id: 3,
      title: "Wisdom Challenges",
      description: "Apply Islamic principles to real-life scenarios",
      difficulty: "Hard",
      points: 50,
      icon: "💡",
      color: "aurora-yellow"
    }
  ];

  const recentScores = [
    { game: "Memory Matching", score: 850, date: "Today" },
    { game: "Islamic Trivia", score: 720, date: "Yesterday" },
    { game: "Wisdom Challenges", score: 940, date: "2 days ago" }
  ];

  return (
    <div className="min-h-screen aurora-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full ios-blur">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="glass-morphism hover:bg-white/10 text-white border-white/20">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-aurora-yellow to-aurora-orange bg-clip-text text-transparent">
                Hikmah Games
              </h1>
              <p className="text-xs text-muted-foreground">
                Play & Earn Points
              </p>
            </div>
          </div>
          <Badge className="glass-morphism flex gap-2 items-center px-4 py-2 text-white border-aurora-yellow/30 bg-aurora-yellow/20">
            <Trophy className="h-4 w-4 text-aurora-yellow" />
            <span className="font-semibold">High Score: 940</span>
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8 px-6">
        {/* Game Selection */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-aurora-yellow bg-clip-text text-transparent">
              Choose Your Game
            </h2>
            <p className="text-muted-foreground mt-1">
              Test your Islamic knowledge and earn rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className={`glass-morphism hover:shadow-aurora transition-all duration-300 cursor-pointer group border-white/10 rounded-3xl overflow-hidden ${selectedGame?.id === game.id ? 'ring-2 ring-aurora-yellow' : ''}`}
                onClick={() => setSelectedGame(game)}
              >
                <CardHeader className="pb-3 text-center">
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <CardTitle className="text-white text-xl">{game.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-center">{game.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge className={`bg-${game.color}/20 text-${game.color} border-${game.color}/30`}>
                      {game.difficulty}
                    </Badge>
                    <Badge className="bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30">
                      {game.points} pts
                    </Badge>
                  </div>
                  <Button 
                    className={`w-full bg-gradient-to-r from-${game.color} to-${game.color}/80 hover:from-${game.color}/80 hover:to-${game.color}/60 text-white rounded-2xl`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Scores */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-aurora-yellow" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-aurora-yellow bg-clip-text text-transparent">
              Recent Scores
            </h2>
          </div>

          <Card className="glass-morphism border-white/10 rounded-3xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentScores.map((score, index) => (
                  <div key={index} className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                    <div>
                      <h3 className="text-white font-semibold">{score.game}</h3>
                      <p className="text-gray-400 text-sm">{score.date}</p>
                    </div>
                    <Badge className="bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30 text-lg px-3 py-1">
                      {score.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Game Component */}
        {selectedGame && (
          <section className="space-y-6">
            <GameSelector selectedGame={selectedGame} />
          </section>
        )}
      </main>
    </div>
  );
}
