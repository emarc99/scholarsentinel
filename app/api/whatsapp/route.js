import { NextResponse } from "next/server";
import { formatWhatsAppAlert } from "@/lib/whatsapp";
import mongo from "@/lib/mongo";

export async function POST(req) {
  try {
    const { scholarshipId, customData } = await req.json().catch(() => ({}));
    const profile = await mongo.getProfile();
    let scholarship = customData;

    if (!scholarship && scholarshipId) {
      const list = await mongo.getScholarships();
      scholarship = list.find(s => s.id === scholarshipId);
    }

    if (!scholarship) {
      scholarship = {
        title: "NNPC / TotalEnergies National Merit Scholarship",
        examDate: "Saturday, 10th October 2026",
        examVenue: "FUTA Digital Research Centre, Obanla Campus, Akure",
        examTime: "08:00 AM WAT",
        accreditationTime: "07:30 AM WAT",
        requirements: [
          "Original FUTA Student ID Card",
          "Printed CBT Screening Slip",
          "JAMB Admission Letter"
        ]
      };
    }

    const dispatch = formatWhatsAppAlert(scholarship, profile);
    await mongo.addLog({
      action: "WHATSAPP_DISPATCHED",
      detail: `Dispatched high-priority alert for ${scholarship.title} to Emmanuel's WhatsApp`
    });

    return NextResponse.json({ success: true, dispatch });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
