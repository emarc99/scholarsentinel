import { NextResponse } from "next/server";
import mongo from "@/lib/mongo";

export async function GET() {
  const scholarships = await mongo.getScholarships();
  return NextResponse.json({ success: true, scholarships });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const saved = await mongo.addOrUpdateScholarship(body);
    await mongo.addLog({
      action: "SCHOLARSHIP_SAVED",
      detail: `Updated scholarship record for: ${saved.title || saved.id}`
    });
    return NextResponse.json({ success: true, scholarship: saved });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
