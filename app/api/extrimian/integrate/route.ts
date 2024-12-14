import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("Integration endpoint called:", await request.json());
  return NextResponse.json({ status: "ok" });
}
