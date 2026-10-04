import { NextResponse } from "next/server";
import { generateVoiceAlert } from "@/lib/elevenlabs";
import mongo from "@/lib/mongo";

export async function POST(req) {
  try {
    const { alertText, voiceId, apiKey } = await req.json().catch(() => ({}));
    const defaultText = alertText || `Urgent priority notice for Emmanuel Adeyemi at FUTA. You have been shortlisted for the NNPC TotalEnergies National Merit Scholarship. Your computer-based screening test is scheduled for Saturday, October 10th at 8:00 AM at the FUTA Digital Research Centre. Accreditation closes at 7:30 AM. Bring your original FUTA Student ID Card, printed invitation slip, and JAMB admission letter. Good luck!`;

    const voiceResult = await generateVoiceAlert(defaultText, voiceId, apiKey);
    await mongo.addLog({
      action: "ELEVENLABS_TTS_GENERATED",
      detail: `Synthesized voice alert (${voiceResult.mode})`
    });

    return NextResponse.json(voiceResult);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
