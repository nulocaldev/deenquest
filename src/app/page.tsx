"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageCircle, Trophy, User } from "lucide-react";
import HikmahCard from "@/components/hikmah/HikmahCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">DeenQuest</h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className="flex gap-1 items-center px-3 py-1"
            >
              <Trophy className="h-4 w-4" />
              <span>1,250 Points</span>
            </Badge>

            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-8">
        {/* Featured Hikmah Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Hikmah of the Day</h2>
            <Button variant="outline" size="sm">
              View All Cards
            </Button>
          </div>

          <div className="flex justify-center">
            <HikmahCard
              title="Patience is a Virtue"
              content="Indeed, Allah is with the patient."
              source="Quran 2:153"
              rarity="rare"
              points={50}
              onClick={() => console.log("Hikmah card clicked")}
            />
          </div>
        </section>

        {/* Quick Access Features */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card hover:bg-accent/10 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Hikmah Cards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Collect and explore Islamic wisdom cards
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Badge variant="outline">10 New Cards</Badge>
              </CardFooter>
            </Card>

            <Card className="bg-card hover:bg-accent/10 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reflect on Islamic teachings with AI guidance
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Badge variant="outline">Daily Prompt Ready</Badge>
              </CardFooter>
            </Card>

            <Card className="bg-card hover:bg-accent/10 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Play Islamic knowledge games and earn points
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Badge variant="outline">3 Games Available</Badge>
              </CardFooter>
            </Card>

            <Card className="bg-card hover:bg-accent/10 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Hikmah Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ask questions and get Islamic guidance
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Badge variant="outline">AI Assistant</Badge>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* User Progress */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Your Progress</h2>

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Cards Collected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">24/100</p>
                    <progress
                      className="w-full h-2 mt-2"
                      value="24"
                      max="100"
                    ></progress>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Journal Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">
                      Last entry: 2 days ago
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Learning Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">7 Days</p>
                    <p className="text-xs text-muted-foreground">Keep it up!</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "First Card", completed: true },
                  { name: "5-Day Streak", completed: true },
                  { name: "Journal Master", completed: false },
                  { name: "Game Champion", completed: false },
                ].map((achievement, index) => (
                  <Card
                    key={index}
                    className={!achievement.completed ? "opacity-50" : ""}
                  >
                    <CardHeader className="pb-2 text-center">
                      <div className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <Trophy
                          className={`h-6 w-6 ${achievement.completed ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <CardTitle className="text-sm">
                        {achievement.name}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="pt-4">
              <div className="space-y-4">
                {[
                  {
                    action: "Collected a new Hikmah Card",
                    time: "Today, 10:23 AM",
                  },
                  {
                    action: "Completed a Journal Entry",
                    time: "Yesterday, 8:45 PM",
                  },
                  { action: "Won Memory Match Game", time: "2 days ago" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <p>{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
