import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Star, Award, Brain, Trophy } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  rewards: {
    points: number;
    cards?: number;
  };
  icon: React.ReactNode;
  imageUrl: string;
}

interface GameSelectorProps {
  games?: Game[];
  onSelectGame?: (gameId: string) => void;
}

const GameSelector = ({
  games = defaultGames,
  onSelectGame = () => {},
}: GameSelectorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-background p-6 rounded-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Hikmah Games</h2>
        <p className="text-muted-foreground">
          Select a game to play and earn Hikmah points and cards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge
                  variant={
                    game.difficulty === "easy"
                      ? "default"
                      : game.difficulty === "medium"
                        ? "secondary"
                        : "destructive"
                  }
                  className="font-medium"
                >
                  {game.difficulty.charAt(0).toUpperCase() +
                    game.difficulty.slice(1)}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-primary/10 rounded-full">
                  {game.icon}
                </span>
                <CardTitle>{game.title}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">
                {game.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>
                  <strong>{game.rewards.points}</strong> Hikmah Points
                </span>
                {game.rewards.cards && (
                  <>
                    <span>•</span>
                    <span>
                      <strong>{game.rewards.cards}</strong> Hikmah Card
                      {game.rewards.cards > 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full" onClick={() => onSelectGame(game.id)}>
                Play Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const defaultGames: Game[] = [
  {
    id: "memory-match",
    title: "Memory Match",
    description:
      "Test your memory by matching pairs of Hikmah cards. The faster you match, the more points you earn!",
    difficulty: "easy",
    rewards: {
      points: 50,
      cards: 1,
    },
    icon: <Brain className="h-5 w-5 text-primary" />,
    imageUrl:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80",
  },
  {
    id: "islamic-trivia",
    title: "Islamic Trivia",
    description:
      "Challenge your knowledge with questions about Islamic history, Quran, and Sunnah.",
    difficulty: "medium",
    rewards: {
      points: 75,
      cards: 2,
    },
    icon: <Award className="h-5 w-5 text-primary" />,
    imageUrl:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&q=80",
  },
  {
    id: "wisdom-challenge",
    title: "Wisdom Challenge",
    description:
      "Apply Islamic wisdom to solve real-world scenarios and ethical dilemmas.",
    difficulty: "hard",
    rewards: {
      points: 100,
      cards: 3,
    },
    icon: <Trophy className="h-5 w-5 text-primary" />,
    imageUrl:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80",
  },
];

export default GameSelector;
