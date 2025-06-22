"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export function QuestionForm() {
  const { token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      category: "",
    },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      category: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const handleSubmitAll = async () => {
    // Validate all questions
    const isValid = questions.every(
      (q) =>
        q.question.trim() &&
        q.optionA.trim() &&
        q.optionB.trim() &&
        q.optionC.trim() &&
        q.optionD.trim() &&
        q.correctAnswer &&
        q.category,
    );

    if (!isValid) {
      setError("Please fill in all fields for all questions");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let successCount = 0;

      for (const question of questions) {
        const categoryId = categories.find(
          (cat) => cat.name === question.category,
        )?.id;

        if (!categoryId) {
          throw new Error(`Category not found: ${question.category}`);
        }

        const response = await fetch("/api/quiz/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question_text: question.question,
            option_a: question.optionA,
            option_b: question.optionB,
            option_c: question.optionC,
            option_d: question.optionD,
            correct_answer: question.correctAnswer,
            category_id: categoryId,
            difficulty: "medium",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save question");
        }

        successCount++;
      }

      setSuccess(
        `Successfully saved ${successCount} questions to the database!`,
      );

      // Reset form
      setQuestions([
        {
          id: Date.now().toString(),
          question: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "",
          category: "",
        },
      ]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save questions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Questions</h2>
          <p className="text-gray-600">
            Create multiple questions for your quiz system
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total Questions: {questions.length}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {questions.map((question, index) => (
        <Card key={question.id} className="border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Question {index + 1}
              </CardTitle>
              {questions.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question Text */}
            <div>
              <Label
                htmlFor={`question-${question.id}`}
                className="text-sm font-medium text-gray-700"
              >
                Question Text
              </Label>
              <Textarea
                id={`question-${question.id}`}
                placeholder="Enter your question here..."
                value={question.question}
                onChange={(e) =>
                  updateQuestion(question.id, "question", e.target.value)
                }
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor={`optionA-${question.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Option A
                </Label>
                <Input
                  id={`optionA-${question.id}`}
                  placeholder="Option A"
                  value={question.optionA}
                  onChange={(e) =>
                    updateQuestion(question.id, "optionA", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor={`optionB-${question.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Option B
                </Label>
                <Input
                  id={`optionB-${question.id}`}
                  placeholder="Option B"
                  value={question.optionB}
                  onChange={(e) =>
                    updateQuestion(question.id, "optionB", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor={`optionC-${question.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Option C
                </Label>
                <Input
                  id={`optionC-${question.id}`}
                  placeholder="Option C"
                  value={question.optionC}
                  onChange={(e) =>
                    updateQuestion(question.id, "optionC", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor={`optionD-${question.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Option D
                </Label>
                <Input
                  id={`optionD-${question.id}`}
                  placeholder="Option D"
                  value={question.optionD}
                  onChange={(e) =>
                    updateQuestion(question.id, "optionD", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
            </div>

            {/* Correct Answer and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Correct Answer
                </Label>
                <Select
                  value={question.correctAnswer}
                  onValueChange={(value) =>
                    updateQuestion(question.id, "correctAnswer", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Option A</SelectItem>
                    <SelectItem value="B">Option B</SelectItem>
                    <SelectItem value="C">Option C</SelectItem>
                    <SelectItem value="D">Option D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <Select
                  value={question.category}
                  onValueChange={(value) =>
                    updateQuestion(question.id, "category", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          onClick={addQuestion}
          variant="outline"
          className="flex items-center justify-center border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add More Questions
        </Button>
        <Button
          onClick={handleSubmitAll}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Questions...
            </>
          ) : (
            `Submit All Questions (${questions.length})`
          )}
        </Button>
      </div>
    </div>
  );
}
