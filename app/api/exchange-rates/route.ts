import { NextResponse } from "next/server";

import { getExchangeRateSnapshot } from "@/lib/currency";

export const revalidate = 43_200;

export async function GET() {
  try {
    const snapshot = await getExchangeRateSnapshot();
    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400" }
    });
  } catch (error) {
    console.error("Exchange-rate lookup failed", error);
    return NextResponse.json(
      { error: "Currency conversion is temporarily unavailable." },
      { status: 503 }
    );
  }
}
