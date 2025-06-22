import { NextRequest, NextResponse } from "next/server";
import { createQuizSession } from "@/lib/quiz";
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
    const { categoryId } = body;

    const sessionId = await createQuizSession(decoded.userId, categoryId);

    return NextResponse.json(
      {
        message: "Quiz session created successfully",
        sessionId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
