import { NextRequest, NextResponse } from "next/server";
import { completeQuizSession } from "@/lib/quiz";
import { initializeDatabase } from "@/lib/database";
import { verifyToken } from "@/lib/auth";

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
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    const session = await completeQuizSession(sessionId);

    return NextResponse.json({
      message: "Quiz completed successfully",
      session,
      scorePercentage: session.score_percentage,
      correctAnswers: session.correct_answers,
      totalQuestions: session.total_questions,
    });
  } catch (error) {
    console.error("Complete quiz error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
