import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join("/") : path;

  // Fix URL construction
  const apiUrl = `${process.env.NEXT_PUBLIC_EXTRIMIAN_API_URL}/${pathString}?apikey=${process.env.NEXT_PUBLIC_EXTRIMIAN_API_KEY}`;

  console.log("Calling Extrimian API:", apiUrl);
  console.log("Request Method:", req.method);
  console.log("Request Body:", req.body);

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error calling Extrimian:", error);
    return res.status(500).json({
      error: "Failed to fetch from Extrimian API",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
