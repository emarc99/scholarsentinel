import { NextResponse } from "next/server";
import mongo from "@/lib/mongo";

export async function GET() {
  const dbStatus = mongo.getStatus();
  return NextResponse.json({
    success: true,
    platform: "Render Cloud Runtime",
    partners: {
      gemma: {
        name: "Google Gemma (Open-Weights)",
        status: "Active (Local + API Gateway)",
        track: "Best Use of Gemma ($200)",
        model: "gemma-2-9b-it / gemini-1.5-flash fallback"
      },
      render: {
        name: "Render",
        status: "Ready for Blueprint Deployment",
        track: "Best Use of Render ($200)",
        runtime: "Next.js Web Service"
      },
      elevenlabs: {
        name: "ElevenLabs",
        status: process.env.ELEVENLABS_API_KEY ? "Live API Connected" : "Client Synthesis Active",
        track: "Best Use of ElevenLabs ($100)",
        defaultVoice: "Rachel (Urgent Briefing)"
      },
      serpapi: {
        name: "SerpApi",
        status: process.env.SERPAPI_API_KEY ? "Live Google Search" : "Simulated Education Feeds",
        track: "Best Use of SerpApi ($100)"
      },
      mongodb: {
        name: "MongoDB Atlas",
        status: dbStatus.isConnected ? "Cluster Connected" : "In-Memory Document Store",
        track: "Best Use of MongoDB Atlas ($100)",
        recordsCount: dbStatus.recordsCount
      }
    }
  });
}
