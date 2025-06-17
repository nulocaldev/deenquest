"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { AlertCircle, CheckCircle, Send, RefreshCw, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface JournalPromptProps {
  prompt?: string;
  onSubmit?: (
    reflection: string,
  ) => Promise<{ feedback: string; success: boolean }>;
  onPromptGenerated?: (prompt: string) => void;
}

const JournalPrompt = ({
  prompt: initialPrompt,
  onSubmit = async () => ({
    feedback:
      "Your reflection shows thoughtful consideration and spiritual growth. May Allah guide you on your journey.",
    success: true,
  }),
  onPromptGenerated,
}: JournalPromptProps) => {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [reflection, setReflection] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);

  // Fetch a new prompt if none is provided
  useEffect(() => {
    if (!initialPrompt) {
      fetchNewPrompt();
    }
  }, [initialPrompt]);

  const fetchNewPrompt = async () => {
    setIsLoadingPrompt(true);
    try {
      const response = await fetch('/api/journal/prompt', {
        method: 'GET',
      });
      const data = await response.json();
      
      if (data.prompt) {
        setPrompt(data.prompt);
        onPromptGenerated?.(data.prompt);
      }
    } catch (error) {
      console.error('Error fetching prompt:', error);
      // Use fallback prompt
      const fallbackPrompt = "Reflect on your spiritual journey today. What moments brought you closer to Allah? How can you continue to grow in your faith and practice?";
      setPrompt(fallbackPrompt);
      onPromptGenerated?.(fallbackPrompt);
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  const handleSubmit = async () => {
    if (!reflection.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmit(reflection);
      setFeedback(result.feedback);
      setIsSuccess(result.success);
    } catch (error) {
      setFeedback(
        "There was an error processing your reflection. Please try again.",
      );
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setReflection("");
    setFeedback(null);
    setIsSuccess(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-aurora-cyan" />
              Daily Reflection
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Take a moment to reflect on today's prompt and write your thoughts.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNewPrompt}
            disabled={isLoadingPrompt || isSubmitting}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingPrompt ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          {isLoadingPrompt ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Generating thoughtful prompt...</span>
            </div>
          ) : (
            <p className="italic">{prompt}</p>
          )}
        </div>

        <Textarea
          placeholder="Write your reflection here..."
          className="min-h-[200px] resize-none"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          disabled={isSubmitting || feedback !== null || isLoadingPrompt}
        />

        {feedback && (
          <Alert variant={isSuccess ? "default" : "destructive"}>
            {isSuccess ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{isSuccess ? "Feedback" : "Error"}</AlertTitle>
            <AlertDescription>{feedback}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {feedback ? (
          <Button variant="outline" onClick={handleReset}>
            New Reflection
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setReflection("")}
              disabled={isSubmitting || !reflection.trim()}
            >
              Clear
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !reflection.trim()}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default JournalPrompt;
