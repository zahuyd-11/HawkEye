"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { surveyQuestions, calculateSurveyScore, type SurveyQuestion } from "@/data/risk-survey-data";

interface RiskSurveyProps {
  onComplete: (answers: Record<string, string>, score: number) => void;
  onCancel?: () => void;
}

export function RiskSurvey({ onComplete, onCancel }: RiskSurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = surveyQuestions[currentStep];
  const progress = ((currentStep + 1) / surveyQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate score and complete
      const score = calculateSurveyScore(answers);
      onComplete(answers, score);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const isAnswered = answers[currentQuestion.id] !== undefined;
  const isLastStep = currentStep === surveyQuestions.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">Khảo sát Khẩu vị Rủi ro</CardTitle>
              <CardDescription className="mt-2">
                Câu hỏi {currentStep + 1} / {surveyQuestions.length}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tiến độ</p>
              <p className="text-lg font-semibold">{Math.round(progress)}%</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{currentQuestion.question}</h3>
            {currentQuestion.description && (
              <p className="text-sm text-muted-foreground mb-4">{currentQuestion.description}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{option.label}</p>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      {option.description && (
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 0 ? "Hủy" : "Quay lại"}
            </Button>
            <Button onClick={handleNext} disabled={!isAnswered}>
              {isLastStep ? "Hoàn tất" : "Tiếp theo"}
              {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

