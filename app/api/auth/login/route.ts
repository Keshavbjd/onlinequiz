import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { initializeDatabase } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    // Initialize database connection
    await initializeDatabase();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const result = await authenticateUser({ email, password });

    if (!result) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
