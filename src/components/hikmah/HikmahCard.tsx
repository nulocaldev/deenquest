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

type RarityLevel = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface HikmahCardProps {
  title?: string;
  content?: string;
  source?: string;
  rarity?: RarityLevel;
  points?: number;
  imageUrl?: string;
  onClick?: () => void;
}

const rarityColors = {
  common: "glass-morphism border-white/20",
  uncommon:
    "glass-morphism border-aurora-cyan/30 shadow-[0_0_20px_rgba(6,255,165,0.2)]",
  rare: "glass-morphism border-aurora-blue/30 shadow-[0_0_20px_rgba(58,134,255,0.3)]",
  epic: "glass-morphism border-aurora-purple/30 shadow-[0_0_20px_rgba(131,56,236,0.4)]",
  legendary:
    "glass-morphism border-aurora-yellow/30 shadow-[0_0_30px_rgba(255,190,11,0.5)]",
};

const rarityBadges = {
  common: "bg-white/20 text-white border-white/30",
  uncommon: "bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30",
  rare: "bg-aurora-blue/20 text-aurora-blue border-aurora-blue/30",
  epic: "bg-aurora-purple/20 text-aurora-purple border-aurora-purple/30",
  legendary: "bg-aurora-yellow/20 text-aurora-yellow border-aurora-yellow/30",
};

const HikmahCard: React.FC<HikmahCardProps> = ({
  title = "The Value of Time",
  content = "Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death.",
  source = "Prophet Muhammad ﷺ",
  rarity = "common",
  points = 10,
  imageUrl,
  onClick,
}) => {
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <Card
      className={cn(
        "w-[350px] h-[450px] flex flex-col cursor-pointer transition-all duration-500 hover:scale-105 hover:rotate-1 relative overflow-hidden rounded-3xl",
        rarityColors[rarity],
        "border-2",
      )}
      onClick={handleClick}
    >
      {/* Aurora background effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-purple/20 via-aurora-pink/20 to-aurora-cyan/20 animate-aurora"></div>
      </div>

      <CardHeader className="relative pb-3 z-10">
        <div className="flex justify-between items-center">
          <Badge
            className={cn(
              rarityBadges[rarity],
              "capitalize rounded-full px-3 py-1 font-semibold",
            )}
          >
            {rarity}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30 font-bold rounded-full px-3 py-1">
            {points} pts
          </Badge>
        </div>
        <h3 className="text-2xl font-bold mt-3 text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
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
                className="w-28 h-28 object-cover rounded-full border-3 border-white/30 shadow-glow"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10"></div>
            </div>
          </div>
        )}
        <p className="text-lg italic text-white/90 leading-relaxed font-medium">
          &quot;{content}&quot;
        </p>
      </CardContent>

      <CardFooter className="border-t border-white/10 pt-4 flex justify-center z-10">
        <p className="text-sm text-gray-300 font-medium">{source}</p>
      </CardFooter>

      {/* Enhanced decorative elements based on rarity */}
      {rarity === "legendary" && (
        <>
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -inset-2 opacity-30 bg-gradient-to-r from-aurora-yellow via-aurora-pink to-aurora-yellow blur-md animate-pulse-glow"></div>
          </div>
          <div className="absolute top-4 right-4 w-3 h-3 bg-aurora-yellow rounded-full animate-pulse-glow z-20"></div>
        </>
      )}
      {rarity === "epic" && (
        <>
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -inset-2 opacity-25 bg-gradient-to-r from-aurora-purple via-aurora-pink to-aurora-purple blur-md animate-pulse-glow"></div>
          </div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-aurora-purple rounded-full animate-pulse-glow z-20"></div>
        </>
      )}
      {rarity === "rare" && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-aurora-blue rounded-full animate-pulse-glow z-20"></div>
      )}
    </Card>
  );
};

export default HikmahCard;
