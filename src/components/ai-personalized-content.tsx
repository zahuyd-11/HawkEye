"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PersonalizedContentProps {
  originalContent: string;
  contentType: "deal-digest" | "micro-research" | "trade-plan" | "general";
  userId?: string;
}

export function AIPersonalizedContent({
  originalContent,
  contentType,
  userId,
}: PersonalizedContentProps) {
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePersonalize = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/personalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: originalContent,
          contentType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to personalize content");
      }

      const data = await response.json();
      setPersonalizedContent(data.personalizedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Personalized Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Original Content:</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {originalContent}
          </p>
        </div>

        <Button
          onClick={handlePersonalize}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Personalizing...
            </>
          ) : (
            "Personalize with AI"
          )}
        </Button>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
            {error}
          </div>
        )}

        {personalizedContent && (
          <div>
            <h3 className="text-sm font-medium mb-2">Personalized Content:</h3>
            <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded">
              {personalizedContent}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

