import { NextResponse } from "next/server";
import mongo from "@/lib/mongo";

export async function GET() {
  const profile = await mongo.getProfile();
  return NextResponse.json({ success: true, profile });
}
