import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch from the external API
    const response = await fetch("https://inwesol.com/api/occupations-redis/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Inwesol-App/1.0",
      },
    });

    if (!response.ok) {
      console.error(
        "External API error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: "Failed to fetch occupations from external API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract titles from the response
    const titles = data.map((item: any) => item.title).filter(Boolean);

    if (titles.length === 0) {
      return NextResponse.json(
        { error: "No occupations found in API response" },
        { status: 404 }
      );
    }

    return NextResponse.json({ occupations: titles });
  } catch (error) {
    console.error("Error fetching occupations:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching occupations" },
      { status: 500 }
    );
  }
}
