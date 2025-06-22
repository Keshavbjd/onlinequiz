import { NextRequest, NextResponse } from "next/server";
import { submitAnswer } from "@/lib/quiz";
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
    const { sessionId, questionId, userAnswer } = body;

    if (!sessionId || !questionId || !userAnswer) {
      return NextResponse.json(
        { error: "Session ID, question ID, and user answer are required" },
        { status: 400 },
      );
    }

    if (!["A", "B", "C", "D"].includes(userAnswer)) {
      return NextResponse.json(
        { error: "User answer must be A, B, C, or D" },
        { status: 400 },
      );
    }

    const isCorrect = await submitAnswer(sessionId, questionId, userAnswer);

    return NextResponse.json({
      message: "Answer submitted successfully",
      isCorrect,
    });
  } catch (error) {
    console.error("Submit answer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
