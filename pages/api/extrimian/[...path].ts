import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;

  // Fix path handling - path comes as an array, join it with slashes
  const pathString = Array.isArray(path) ? path.join("/") : path;

  // Add the specific path prefix for your Extrimian instance
  const apiUrl = `${process.env.NEXT_PUBLIC_EXTRIMIAN_API_URL}${process.env.NEXT_PUBLIC_EXTRIMIAN_PATH_PREFIX}/${pathString}?apikey=${process.env.NEXT_PUBLIC_EXTRIMIAN_API_KEY}`;

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
    console.log("Extrimian Response:", data); // Log the response

    if (!response.ok) {
      console.error("Extrimian Error Response:", data);
      return res.status(response.status).json(data);
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error calling Extrimian:", error);
    res.status(500).json({
      error: "Failed to fetch from Extrimian API",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
