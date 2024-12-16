import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    // Log the request for debugging
    console.log("Creating DID with Extrimian...");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_EXTRIMIAN_API_URL}/v1/dids/quarkid?apikey=${process.env.NEXT_PUBLIC_EXTRIMIAN_API_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websocket: "https://sandbox-ssi-ws.extrimian.com",
          didMethod: "did:quarkid",
        }),
      }
    );

    const data = await response.json();
    console.log("Extrimian Response:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating DID:", error);
    return NextResponse.json(
      { error: "Failed to create DID" },
      { status: 500 }
    );
  }
}
