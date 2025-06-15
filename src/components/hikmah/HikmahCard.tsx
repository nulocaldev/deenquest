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
  common: "bg-slate-100 border-slate-200",
  uncommon: "bg-green-50 border-green-200",
  rare: "bg-blue-50 border-blue-200",
  epic: "bg-purple-50 border-purple-200",
  legendary: "bg-amber-50 border-amber-200",
};

const rarityBadges = {
  common: "bg-slate-200 text-slate-700",
  uncommon: "bg-green-200 text-green-700",
  rare: "bg-blue-200 text-blue-700",
  epic: "bg-purple-200 text-purple-700",
  legendary: "bg-amber-200 text-amber-700",
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
  return (
    <Card
      className={cn(
        "w-[350px] h-[450px] flex flex-col cursor-pointer transition-transform hover:scale-105",
        rarityColors[rarity],
        "border-2",
      )}
      onClick={onClick || (() => {})}
    >
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-center">
          <Badge className={cn(rarityBadges[rarity], "capitalize")}>
            {rarity}
          </Badge>
          <Badge variant="outline" className="font-semibold">
            {points} pts
          </Badge>
        </div>
        <h3 className="text-xl font-bold mt-2">{title}</h3>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-center text-center px-6">
        {imageUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={
                imageUrl ||
                "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=300&q=80"
              }
              alt="Hikmah illustration"
              className="w-24 h-24 object-cover rounded-full border-2 border-slate-200"
            />
          </div>
        )}
        <p className="text-lg italic">"{content}"</p>
      </CardContent>

      <CardFooter className="border-t pt-3 flex justify-center">
        <p className="text-sm text-muted-foreground">{source}</p>
      </CardFooter>

      {/* Decorative elements based on rarity */}
      {rarity === "legendary" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute -inset-1 opacity-20 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 blur-sm"></div>
        </div>
      )}
      {rarity === "epic" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute -inset-1 opacity-20 bg-gradient-to-r from-purple-400 via-violet-500 to-purple-400 blur-sm"></div>
        </div>
      )}
    </Card>
  );
};

export default HikmahCard;
