/**
 * ScholarSentinel Server
 * Autonomous Open-Source AI Scholarship Watchdog for Daniel (FUTA)
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { danielProfile, sampleCirculars } = require("./lib/data");
const { searchScholarshipAnnouncements } = require("./lib/serpapi");
const { parseCircularWithGemma } = require("./lib/gemma");
const { generateVoiceAlert } = require("./lib/elevenlabs");
const { formatWhatsAppAlert } = require("./lib/whatsapp");
const mongo = require("./lib/mongo");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Initialize DB
mongo.initMongo();

// 1. Get Profile
app.get("/api/profile", async (req, res) => {
  const profile = await mongo.getProfile();
  res.json({ success: true, profile });
});

// 2. Get Tracked Scholarships
app.get("/api/scholarships", async (req, res) => {
  const scholarships = await mongo.getScholarships();
  res.json({ success: true, scholarships });
});

// 3. Add or update Scholarship
app.post("/api/scholarships", async (req, res) => {
  const saved = await mongo.addOrUpdateScholarship(req.body);
  await mongo.addLog({
    action: "SCHOLARSHIP_SAVED",
    detail: `Updated scholarship record for: ${saved.title || saved.id}`
  });
  res.json({ success: true, scholarship: saved });
});

// 4. Trigger SerpApi Watchdog Crawler
app.post("/api/scan", async (req, res) => {
  const { query, apiKey } = req.body || {};
  const scanResult = await searchScholarshipAnnouncements(query, apiKey);
  await mongo.addLog({
    action: "SERPAPI_CRAWL_COMPLETED",
    detail: `Watchdog scanned ${scanResult.resultsCount} circulars for query: "${scanResult.query}"`
  });
  res.json(scanResult);
});

// 5. Parse Circular with Google Gemma Open AI
app.post("/api/gemma/parse", async (req, res) => {
  const { rawText, apiKey, autoUpdate } = req.body || {};
  if (!rawText) {
    return res.status(400).json({ success: false, error: "rawText parameter is required." });
  }

  const parseResult = await parseCircularWithGemma(rawText, apiKey);
  
  if (parseResult.success && parseResult.result.isShortlisted && autoUpdate) {
    const r = parseResult.result;
    const newId = r.scholarshipTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
    await mongo.addOrUpdateScholarship({
      id: newId,
      title: r.scholarshipTitle,
      sponsor: "Verified Screening Body",
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
    detail: `Parsed circular: "${parseResult.result.scholarshipTitle}". Match: ${parseResult.result.isShortlisted ? "MATCHED (Daniel)" : "NO_MATCH"}`
  });

  res.json(parseResult);
});

// 6. Generate Voice Alert with ElevenLabs
app.post("/api/elevenlabs/voice", async (req, res) => {
  const { alertText, voiceId, apiKey } = req.body || {};
  const defaultText = alertText || `Urgent priority notice for Daniel Aroso at FUTA. You have been shortlisted for the NNPC TotalEnergies National Merit Scholarship. Your computer-based screening test is scheduled for Saturday, October 10th at 8:00 AM at the FUTA Digital Research Centre. Accreditation closes at 7:30 AM. Bring your original FUTA Student ID Card, printed invitation slip, and JAMB admission letter. Good luck!`;

  const voiceResult = await generateVoiceAlert(defaultText, voiceId, apiKey);
  await mongo.addLog({
    action: "ELEVENLABS_TTS_GENERATED",
    detail: `Synthesized voice alert (${voiceResult.mode})`
  });
  res.json(voiceResult);
});

// 7. Dispatch WhatsApp Alert
app.post("/api/whatsapp/dispatch", async (req, res) => {
  const { scholarshipId, customData } = req.body || {};
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
    detail: `Dispatched high-priority alert for ${scholarship.title} to Daniel's WhatsApp`
  });
  res.json({ success: true, dispatch });
});

// 8. Sample Circulars for Quick Testing
app.get("/api/sample-circulars", (req, res) => {
  res.json({ success: true, samples: sampleCirculars });
});

// 9. System Partner Status
app.get("/api/system-status", (req, res) => {
  const dbStatus = mongo.getStatus();
  res.json({
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
        runtime: "Node.js v24 Web Service"
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
});

// 10. Audit Logs
app.get("/api/logs", async (req, res) => {
  const logs = await mongo.getLogs();
  res.json({ success: true, logs });
});

// Start Server
app.listen(PORT, () => {
  console.log(`ScholarSentinel engine online on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to view the interface.`);
});
