"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, Sparkles, Crown, Gem, Award } from "lucide-react";

type RarityLevel = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface HikmahCardProps {
  title?: string;
  content?: string;
  source?: string;
  rarity?: RarityLevel;
  points?: number;
  imageUrl?: string;
  cardId?: string;
}

const rarityColors = {
  common: "elegant-card border border-border/40",
  uncommon: "elegant-card border border-green-300 dark:border-green-700",
  rare: "elegant-card border border-blue-300 dark:border-blue-700",
  epic: "elegant-card border border-purple-300 dark:border-purple-700",
  legendary: "elegant-card border border-yellow-300 dark:border-yellow-700",
};

const rarityBadges = {
  common: "bg-accent text-foreground border-border/40",
  uncommon: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
  rare: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  epic: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
  legendary: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
};

const HikmahCard: React.FC<HikmahCardProps> = ({
  title = "The Value of Time",
  content = "Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death.",
  source = "Prophet Muhammad ﷺ",
  rarity = "common",
  points = 10,
  imageUrl,
  cardId = "default-card",
}) => {
  const handleClick = () => {
    console.log(`Clicked on card: ${title} (ID: ${cardId})`);
  };

  return (
    <Card
      className={cn(
        "w-[320px] h-[420px] flex flex-col cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden rounded-2xl shadow-lg",
        rarityColors[rarity],
      )}
      onClick={handleClick}
    >
      {/* Decorative background fade */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/40 to-background opacity-60 pointer-events-none" />

      <CardHeader className="relative pb-3 z-10">
        <div className="flex justify-between items-center">
          <Badge
            className={cn(
              rarityBadges[rarity],
              "capitalize rounded-full px-3 py-1 font-semibold border"
            )}
          >
            {rarity}
          </Badge>
          <Badge className="bg-accent text-foreground border border-border/40 font-bold rounded-full px-3 py-1">
            {points} pts
          </Badge>
        </div>
        <h3 className="text-xl font-bold mt-3 text-gradient">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-center text-center px-6 z-10">
        {imageUrl && (
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <img
                src={
                  imageUrl ||
                  "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=300&q=80"
                }
                alt="Hikmah illustration"
                className="w-24 h-24 object-cover rounded-full border-2 border-border/40 shadow"
              />
            </div>
          </div>
        )}
        <p className="text-base italic text-muted-foreground leading-relaxed font-medium">
          &quot;{content}&quot;
        </p>
      </CardContent>

      <CardFooter className="border-t border-border/40 pt-4 flex justify-center z-10">
        <p className="text-sm text-muted-foreground font-medium">{source}</p>
      </CardFooter>

      {/* Subtle decorative accent for legendary cards */}
      {rarity === "legendary" && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      )}
    </Card>
  );
};

export default HikmahCard;
