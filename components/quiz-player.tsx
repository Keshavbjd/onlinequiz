"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, XCircle, Play } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  category_id: number;
  difficulty: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<number, "A" | "B" | "C" | "D">;
  sessionId: number | null;
  isCompleted: boolean;
  score: number | null;
}

export function QuizPlayer() {
  const { user, token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    sessionId: null,
    isCompleted: false,
    score: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/quiz/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const startQuiz = async () => {
    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Fetch questions
      const questionsResponse = await fetch(
        `/api/quiz/questions?category=${selectedCategory}&limit=10`,
      );
      if (!questionsResponse.ok) {
        throw new Error("Failed to fetch questions");
      }
      const questions = await questionsResponse.json();

      if (questions.length === 0) {
        throw new Error("No questions available for this category");
      }

      // Create quiz session
      const sessionResponse = await fetch("/api/quiz/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: parseInt(selectedCategory),
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error("Failed to create quiz session");
      }

      const sessionData = await sessionResponse.json();

      setQuizState({
        questions,
        currentQuestionIndex: 0,
        userAnswers: {},
        sessionId: sessionData.sessionId,
        isCompleted: false,
        score: null,
      });
      setIsStarted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to start quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const selectAnswer = (answer: "A" | "B" | "C" | "D") => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    setQuizState((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQuestion.id]: answer,
      },
    }));
  };

  const nextQuestion = async () => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const userAnswer = quizState.userAnswers[currentQuestion.id];

    if (!userAnswer) {
      setError("Please select an answer");
      return;
    }

    setError("");

    try {
      // Submit answer to backend
      await fetch("/api/quiz/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: quizState.sessionId,
          questionId: currentQuestion.id,
          userAnswer,
        }),
      });

      if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        // Move to next question
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        }));
      } else {
        // Complete quiz
        await completeQuiz();
      }
    } catch (error) {
      setError("Failed to submit answer");
    }
  };

  const completeQuiz = async () => {
    try {
      const response = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: quizState.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete quiz");
      }

      const result = await response.json();
      setQuizState((prev) => ({
        ...prev,
        isCompleted: true,
        score: result.scorePercentage,
      }));
    } catch (error) {
      setError("Failed to complete quiz");
    }
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      sessionId: null,
      isCompleted: false,
      score: null,
    });
    setIsStarted(false);
    setSelectedCategory("");
    setError("");
  };

  if (!isStarted) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Take a Quiz</h2>
          <p className="text-gray-600">
            Test your knowledge in various categories
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Select Quiz Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={startQuiz}
              disabled={isLoading || !selectedCategory}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Quiz...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Quiz (10 Questions)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState.isCompleted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Quiz Completed!</h2>
          <p className="text-gray-600">Great job finishing the quiz</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {Math.round(quizState.score || 0)}%
            </div>
            <p className="text-gray-600 mb-4">
              You got{" "}
              {Math.round(
                ((quizState.score || 0) / 100) * quizState.questions.length,
              )}{" "}
              out of {quizState.questions.length} questions correct
            </p>
            <Button onClick={resetQuiz} className="w-full">
              Take Another Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progress =
    ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Quiz in Progress</h2>
          <span className="text-sm text-gray-500">
            Question {quizState.currentQuestionIndex + 1} of{" "}
            {quizState.questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "A", text: currentQuestion.option_a },
            { key: "B", text: currentQuestion.option_b },
            { key: "C", text: currentQuestion.option_c },
            { key: "D", text: currentQuestion.option_d },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => selectAnswer(option.key as "A" | "B" | "C" | "D")}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                quizState.userAnswers[currentQuestion.id] === option.key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="font-medium mr-3">{option.key}.</span>
              {option.text}
            </button>
          ))}

          <div className="pt-4">
            <Button
              onClick={nextQuestion}
              disabled={!quizState.userAnswers[currentQuestion.id]}
              className="w-full"
            >
              {quizState.currentQuestionIndex === quizState.questions.length - 1
                ? "Complete Quiz"
                : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
