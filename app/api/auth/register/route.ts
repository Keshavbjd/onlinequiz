import { NextRequest, NextResponse } from "next/server";
import { createUser, generateToken } from "@/lib/auth";
import { initializeDatabase } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    // Initialize database connection
    await initializeDatabase();

    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    const user = await createUser({ username, email, password });
    const token = generateToken(user);

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
        token,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
