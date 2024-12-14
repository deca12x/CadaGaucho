import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("Verify endpoint called:", await request.json());
  return NextResponse.json({ status: "ok" });
}
