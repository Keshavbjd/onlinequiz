import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/quiz";
import { initializeDatabase } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
