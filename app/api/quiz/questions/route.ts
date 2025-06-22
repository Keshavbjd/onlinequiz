import { NextRequest, NextResponse } from "next/server";
import { createQuestion, getQuestionsByCategory } from "@/lib/quiz";
import { initializeDatabase } from "@/lib/database";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");

    const questions = await getQuestionsByCategory(
      categoryId ? parseInt(categoryId) : undefined,
      limit,
    );

    // Remove correct answers from response for security
    const questionsWithoutAnswers = questions.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      category_id: q.category_id,
      difficulty: q.difficulty,
    }));

    return NextResponse.json(questionsWithoutAnswers);
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const {
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      category_id,
      difficulty,
    } = body;

    // Validate required fields
    if (
      !question_text ||
      !option_a ||
      !option_b ||
      !option_c ||
      !option_d ||
      !correct_answer ||
      !category_id
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate correct_answer
    if (!["A", "B", "C", "D"].includes(correct_answer)) {
      return NextResponse.json(
        { error: "Correct answer must be A, B, C, or D" },
        { status: 400 },
      );
    }

    const question = await createQuestion({
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      category_id: parseInt(category_id),
      difficulty: difficulty || "medium",
    });

    return NextResponse.json(
      {
        message: "Question created successfully",
        question,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
