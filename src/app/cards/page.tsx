"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Filter, Search } from "lucide-react";
import HikmahCard from "@/components/hikmah/HikmahCard";

export default function CardsPage() {
  const [activeTab, setActiveTab] = useState("collection");

  const sampleCards = [
    {
      title: "Patience is a Virtue",
      content: "Indeed, Allah is with the patient.",
      source: "Quran 2:153",
      rarity: "rare",
      points: 50,
    },
    {
      title: "Seeking Knowledge",
      content: "Seek knowledge from the cradle to the grave.",
      source: "Hadith",
      rarity: "common",
      points: 20,
    },
    {
      title: "Compassion",
      content: "He is not of us who does not show mercy to our young ones.",
      source: "Hadith",
      rarity: "legendary",
      points: 100,
    },
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-aurora-purple to-aurora-pink bg-clip-text text-transparent">
                Hikmah Cards
              </h1>
              <p className="text-xs text-muted-foreground">
                Collect & Browse Wisdom
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="glass-morphism hover:bg-white/10 text-white border-white/20">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="glass-morphism hover:bg-white/10 text-white border-white/20">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-morphism grid w-full grid-cols-2 p-1 rounded-2xl border-white/10">
            <TabsTrigger
              value="collection"
              className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
            >
              My Collection
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className="rounded-xl data-[state=active]:bg-aurora-purple/30 data-[state=active]:text-white text-gray-300"
            >
              Card Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleCards.map((card, index) => (
                <div key={index} className="animate-float" style={{ animationDelay: `${index * 0.1}s` }}>
                  <HikmahCard {...card} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <Card className="glass-morphism border-white/10 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white">Available Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Complete activities to earn new Hikmah Cards!</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="glass-morphism border-white/10">
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold">Complete a Journal Entry</h3>
                      <p className="text-gray-300 text-sm mt-1">Earn: Reflection Card (Common)</p>
                      <Badge className="mt-2 bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30">20 Points</Badge>
                    </CardContent>
                  </Card>
                  <Card className="glass-morphism border-white/10">
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold">Win 3 Games</h3>
                      <p className="text-gray-300 text-sm mt-1">Earn: Champion Card (Rare)</p>
                      <Badge className="mt-2 bg-aurora-purple/20 text-aurora-purple border-aurora-purple/30">50 Points</Badge>
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
