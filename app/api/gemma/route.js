import { NextResponse } from "next/server";
import { parseCircularWithGemma } from "@/lib/gemma";
import mongo from "@/lib/mongo";

export async function POST(req) {
  try {
    const { rawText, apiKey, autoUpdate } = await req.json().catch(() => ({}));
    if (!rawText) {
      return NextResponse.json({ success: false, error: "rawText is required" }, { status: 400 });
    }

    const parseResult = await parseCircularWithGemma(rawText, apiKey);

    if (parseResult.success && parseResult.result.isShortlisted && autoUpdate) {
      const r = parseResult.result;
      const newId = r.scholarshipTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
      await mongo.addOrUpdateScholarship({
        id: newId,
        title: r.scholarshipTitle,
        sponsor: "Verified Screening Board",
        category: "Engineering & Technology",
        status: "Shortlisted",
        examStatus: "Screening Scheduled",
        examDate: r.examDate,
        examVenue: r.examVenue,
        examTime: r.examTime,
        accreditationTime: r.accreditationTime,
        requirements: r.requiredDocuments,
        detectedDate: new Date().toISOString().split("T")[0],
        urgentAlertSent: true
      });
    }

    await mongo.addLog({
      action: "GEMMA_PARSING_COMPLETED",
      detail: `Parsed circular: "${parseResult.result.scholarshipTitle}". Match: ${parseResult.result.isShortlisted ? "MATCHED (Emmanuel)" : "NO_MATCH"}`
    });

    return NextResponse.json(parseResult);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
