import { NextResponse } from "next/server";
import { searchScholarshipAnnouncements } from "@/lib/serpapi";
import mongo from "@/lib/mongo";

export async function POST(req) {
  try {
    const { query, apiKey } = await req.json().catch(() => ({}));
    const scanResult = await searchScholarshipAnnouncements(query, apiKey);
    await mongo.addLog({
      action: "SERPAPI_CRAWL_COMPLETED",
      detail: `Watchdog scanned ${scanResult.resultsCount} circulars for query: "${scanResult.query}"`
    });
    return NextResponse.json(scanResult);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
