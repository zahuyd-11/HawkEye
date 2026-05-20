// AI Service for Content Personalization
// Supports both Google Gemini and OpenAI ChatGPT
// NOTE: This service only works on the server-side (API routes)

interface AIConfig {
  provider: "gemini" | "openai";
  apiKey: string;
}

interface PersonalizationRequest {
  userId: string;
  userPreferences?: {
    riskTolerance?: "low" | "medium" | "high";
    investmentStyle?: "growth" | "value" | "balanced";
    sectors?: string[];
  };
  context: string;
  contentType: "deal-digest" | "micro-research" | "trade-plan" | "general";
}

class AIService {
  private config: AIConfig | null = null;

  constructor() {
    // Prefer Gemini if available, fallback to OpenAI
    if (process.env.GEMINI_API_KEY) {
      this.config = {
        provider: "gemini",
        apiKey: process.env.GEMINI_API_KEY,
      };
    } else if (process.env.OPENAI_API_KEY) {
      this.config = {
        provider: "openai",
        apiKey: process.env.OPENAI_API_KEY,
      };
    }
  }

  async personalizeContent(request: PersonalizationRequest): Promise<string> {
    if (!this.config) {
      console.warn("AI service not configured. Returning original content.");
      return request.context;
    }

    try {
      if (this.config.provider === "gemini") {
        return await this.personalizeWithGemini(request);
      } else {
        return await this.personalizeWithOpenAI(request);
      }
    } catch (error) {
      console.error("AI personalization error:", error);
      return request.context; // Fallback to original content
    }
  }

  private async personalizeWithGemini(request: PersonalizationRequest): Promise<string> {
    const prompt = this.buildPrompt(request);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config!.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || request.context;
  }

  private async personalizeWithOpenAI(request: PersonalizationRequest): Promise<string> {
    const prompt = this.buildPrompt(request);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config!.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a financial content personalization assistant. Personalize content based on user preferences while maintaining accuracy.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || request.context;
  }

  private buildPrompt(request: PersonalizationRequest): string {
    const preferences = request.userPreferences || {};
    
    let prompt = `Personalize the following ${request.contentType} content for a user with the following preferences:\n\n`;
    
    if (preferences.riskTolerance) {
      prompt += `Risk Tolerance: ${preferences.riskTolerance}\n`;
    }
    if (preferences.investmentStyle) {
      prompt += `Investment Style: ${preferences.investmentStyle}\n`;
    }
    if (preferences.sectors && preferences.sectors.length > 0) {
      prompt += `Interested Sectors: ${preferences.sectors.join(", ")}\n`;
    }
    
    prompt += `\nOriginal Content:\n${request.context}\n\n`;
    prompt += `Please personalize this content to match the user's preferences while maintaining factual accuracy. `;
    prompt += `Add relevant context, highlight important points based on their risk tolerance, and adjust the tone to match their investment style.`;
    
    return prompt;
  }

  async generateSummary(content: string, maxLength: number = 200): Promise<string> {
    if (!this.config) {
      return content.substring(0, maxLength) + "...";
    }

    const prompt = `Summarize the following content in ${maxLength} characters or less:\n\n${content}`;

    try {
      if (this.config.provider === "gemini") {
        return await this.personalizeWithGemini({
          userId: "system",
          context: prompt,
          contentType: "general",
        });
      } else {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: Math.floor(maxLength / 4),
          }),
        });

        const data = await response.json();
        return data.choices[0]?.message?.content || content.substring(0, maxLength) + "...";
      }
    } catch (error) {
      console.error("Summary generation error:", error);
      return content.substring(0, maxLength) + "...";
    }
  }
}

export const aiService = new AIService();

