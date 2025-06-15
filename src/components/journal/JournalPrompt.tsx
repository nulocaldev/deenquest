"use client";

import React, { useState } from "react";
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
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface JournalPromptProps {
  prompt?: string;
  onSubmit?: (
    reflection: string,
  ) => Promise<{ feedback: string; success: boolean }>;
}

const JournalPrompt = ({
  prompt = "Reflect on how the wisdom from your recent Hikmah card about patience can be applied in your daily life.",
  onSubmit = async () => ({
    feedback:
      "Your reflection shows thoughtful consideration of how patience can transform everyday challenges into opportunities for spiritual growth.",
    success: true,
  }),
}: JournalPromptProps) => {
  const [reflection, setReflection] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

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
        <CardTitle className="text-xl font-semibold">
          Daily Reflection
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Take a moment to reflect on today's prompt and write your thoughts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          <p className="italic">{prompt}</p>
        </div>

        <Textarea
          placeholder="Write your reflection here..."
          className="min-h-[200px] resize-none"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          disabled={isSubmitting || feedback !== null}
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
