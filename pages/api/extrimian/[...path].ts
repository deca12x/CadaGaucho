import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;

  // Fix path handling - path comes as an array, join it with slashes
  const pathString = Array.isArray(path) ? path.join("/") : path;

  const apiUrl = `${process.env.NEXT_PUBLIC_EXTRIMIAN_API_URL}/${pathString}?apikey=${process.env.NEXT_PUBLIC_EXTRIMIAN_API_KEY}`;

  console.log("Calling Extrimian API:", apiUrl); // Debug log

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Extrimian API" });
  }
}
