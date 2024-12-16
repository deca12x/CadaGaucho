import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received callback from QuarkID:", data);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error in callback:", error);
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}
