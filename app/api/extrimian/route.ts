import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace("/api/extrimian", "");
  const apiUrl = `${process.env.NEXT_PUBLIC_EXTRIMIAN_API_URL}${path}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_EXTRIMIAN_API_KEY!,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Extrimian API" },
      { status: 500 }
    );
  }
}
