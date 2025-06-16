"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Star, Filter, Search, Sparkles } from "lucide-react";
import HikmahCard from "@/components/hikmah/HikmahCard";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function CardsPage() {
  const [activeTab, setActiveTab] = useState("collection");
  const [searchQuery, setSearchQuery] = useState("");

  const sampleCards = [
    {
      title: "Patience is a Virtue",
      content: "Indeed, Allah is with the patient.",
      source: "Quran 2:153",
      rarity: "rare" as const,
      points: 50,
    },
    {
      title: "Seeking Knowledge",
      content: "Seek knowledge from the cradle to the grave.",
      source: "Hadith",
      rarity: "common" as const,
      points: 20,
    },
    {
      title: "Compassion",
      content: "He is not of us who does not show mercy to our young ones.",
      source: "Hadith",
      rarity: "legendary" as const,
      points: 100,
    },
    {
      title: "Trust in Allah",
      content: "And whoever relies upon Allah - then He is sufficient for him.",
      source: "Quran 65:3",
      rarity: "epic" as const,
      points: 75,
    },
    {
      title: "The Best of People",
      content: "The best of people are those who benefit others.",
      source: "Hadith",
      rarity: "uncommon" as const,
      points: 35,
    },
  ];

  const filteredCards = sampleCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen elegant-bg aurora-bg-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full elegant-glass">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-accent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                Hikmah Cards
              </h1>
              <p className="text-xs text-muted-foreground">
                Collect & Browse Wisdom
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-accent">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8 px-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="elegant-glass aurora-glow-green">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/30">
                  <Sparkles className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredCards.length}</p>
                  <p className="text-sm text-muted-foreground">Cards Collected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="elegant-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredCards.reduce((sum, card) => sum + card.points, 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="elegant-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredCards.filter(card => card.rarity === 'legendary' || card.rarity === 'epic').length}</p>
                  <p className="text-sm text-muted-foreground">Rare Cards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="elegant-card grid w-full grid-cols-2 p-1">
            <TabsTrigger
              value="collection"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              My Collection
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Card Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collection" className="space-y-6">
            {searchQuery && (
              <div className="text-sm text-muted-foreground">
                {filteredCards.length} cards found for "{searchQuery}"
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card, index) => (
                <div key={index} className="transform transition-all duration-300 hover:scale-105">
                  <HikmahCard {...card} />
                </div>
              ))}
              {filteredCards.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No cards found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or complete more activities to earn cards.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <Card className="elegant-card">
              <CardHeader>
                <CardTitle>Available Card Packs</CardTitle>
                <p className="text-muted-foreground">Complete activities to earn new Hikmah Cards!</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="elegant-card elegant-hover border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-green-500/20">
                          <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Complete a Journal Entry</h3>
                          <p className="text-sm text-muted-foreground">Earn: Reflection Card (Common)</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">20 Points</Badge>
                    </CardContent>
                  </Card>
                  <Card className="elegant-card elegant-hover border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Win 3 Games</h3>
                          <p className="text-sm text-muted-foreground">Earn: Champion Card (Rare)</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">50 Points</Badge>
                    </CardContent>
                  </Card>
                  <Card className="elegant-card elegant-hover border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Chat with Hikmah AI</h3>
                          <p className="text-sm text-muted-foreground">Earn: Wisdom Card (Uncommon)</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">35 Points</Badge>
                    </CardContent>
                  </Card>
                  <Card className="elegant-card elegant-hover border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-yellow-500/20">
                          <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Complete Daily Streak</h3>
                          <p className="text-sm text-muted-foreground">Earn: Dedication Card (Epic)</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">75 Points</Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
