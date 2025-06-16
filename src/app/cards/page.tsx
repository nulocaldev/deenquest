"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Star, Filter, Search, Sparkles, Award, TrendingUp } from "lucide-react";
import HikmahCard from "@/components/hikmah/HikmahCard";
import { NativeSponsor } from "@/components/NativeSponsor";

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
    {
      title: "Gratitude",
      content: "If you are grateful, I will certainly give you more.",
      source: "Quran 14:7",
      rarity: "rare" as const,
      points: 50,
    }
  ];

  const filteredCards = sampleCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pastel-bg-secondary">
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
                Hikmah Cards
              </h1>
              <p className="text-sm text-frosted-light">
                Collect & Reflect
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-pastel-mint to-pastel-blue text-frosted-strong border-0">
              {sampleCards.length} Cards
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-frosted-strong">
            Discover Islamic Wisdom
          </h2>
          <p className="text-lg text-frosted max-w-2xl mx-auto">
            Collect beautiful cards containing verses from the Quran and sayings of Prophet Muhammad (peace be upon him). 
            Each card brings you closer to understanding and practicing Islamic teachings.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="frosted-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pastel-mint to-pastel-blue flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-frosted-strong" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-frosted-strong">{filteredCards.length}</p>
                  <p className="text-sm text-frosted-light">Cards Collected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="frosted-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pastel-peach to-pastel-yellow flex items-center justify-center">
                  <Star className="h-6 w-6 text-frosted-strong" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-frosted-strong">{filteredCards.reduce((sum, card) => sum + card.points, 0)}</p>
                  <p className="text-sm text-frosted-light">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="frosted-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pastel-pink to-pastel-lavender flex items-center justify-center">
                  <Award className="h-6 w-6 text-frosted-strong" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-frosted-strong">{filteredCards.filter(card => card.rarity === 'legendary' || card.rarity === 'epic').length}</p>
                  <p className="text-sm text-frosted-light">Rare Cards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="frosted-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-frosted-light" />
                <Input
                  placeholder="Search for wisdom, sources, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="frosted-input pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button className="frosted-button">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="frosted-button">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Daily Draw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="frosted-card p-1">
              <TabsTrigger 
                value="collection" 
                className="frosted-nav-item data-[state=active]:bg-gradient-to-r data-[state=active]:from-pastel-mint data-[state=active]:to-pastel-blue"
              >
                My Collection
              </TabsTrigger>
              <TabsTrigger 
                value="discover" 
                className="frosted-nav-item data-[state=active]:bg-gradient-to-r data-[state=active]:from-pastel-pink data-[state=active]:to-pastel-lavender"
              >
                Discover New
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="frosted-nav-item data-[state=active]:bg-gradient-to-r data-[state=active]:from-pastel-peach data-[state=active]:to-pastel-yellow"
              >
                Favorites
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="collection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card, index) => (
                <div key={index}>
                  <HikmahCard {...card} />
                  {/* Show native sponsor occasionally - naturally integrated */}
                  {index === 2 && (
                    <div className="mt-4">
                      <NativeSponsor 
                        context="cards"
                        integrationType="educational"
                        className="backdrop-blur-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <Card className="frosted-card">
              <CardHeader>
                <CardTitle className="text-frosted-strong flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-frosted mb-6">
                  Based on your collection and interests, here are some cards that might inspire you:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleCards.slice(0, 3).map((card, index) => (
                    <HikmahCard key={index} {...card} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card className="frosted-card">
              <CardHeader>
                <CardTitle className="text-frosted-strong flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Your Favorite Wisdom
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-frosted mb-6">
                  Cards you've marked as favorites for quick inspiration:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleCards.filter(card => card.rarity === 'legendary' || card.rarity === 'epic').map((card, index) => (
                    <HikmahCard key={index} {...card} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievement Progress */}
        <Card className="frosted-card">
          <CardHeader>
            <CardTitle className="text-frosted-strong flex items-center gap-2">
              <Award className="h-5 w-5" />
              Collection Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pastel-mint/30 to-pastel-blue/30 rounded-lg">
              <div>
                <h4 className="font-semibold text-frosted-strong">Wisdom Seeker</h4>
                <p className="text-sm text-frosted-light">Collect 10 cards</p>
              </div>
              <Badge className="bg-gradient-to-r from-pastel-mint to-pastel-blue text-frosted-strong border-0">
                Completed
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pastel-pink/30 to-pastel-lavender/30 rounded-lg">
              <div>
                <h4 className="font-semibold text-frosted-strong">Knowledge Guardian</h4>
                <p className="text-sm text-frosted-light">Collect 25 cards</p>
              </div>
              <Badge className="bg-gradient-to-r from-pastel-pink to-pastel-lavender text-frosted-strong border-0">
                In Progress
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
