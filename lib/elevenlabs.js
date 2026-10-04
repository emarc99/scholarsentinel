/**
 * ElevenLabs High-Priority Audio Voice Briefing Module
 * 
 * Synthesizes crystal-clear audio briefings so Daniel never misses a test center
 * screening due to silent email inboxes. Sound cuts through notification fatigue.
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel / expressive voice

async function generateVoiceAlert(alertText, voiceId = DEFAULT_VOICE_ID, apiKey = null) {
  const activeKey = apiKey || process.env.ELEVENLABS_API_KEY;

  if (activeKey) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": activeKey
        },
        body: JSON.stringify({
          text: alertText,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8
          }
        })
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString("base64");
        return {
          success: true,
          mode: "live-elevenlabs",
          voiceId,
          audioDataUri: `data:audio/mpeg;base64,${base64Audio}`,
          transcript: alertText
        };
      } else {
        const errorText = await response.text();
        console.warn("ElevenLabs live API response not OK:", errorText);
      }
    } catch (err) {
      console.warn("ElevenLabs live call failed, falling back to simulated speech:", err.message);
    }
  }

  // Fallback simulator for demo / test without requiring credit card or API keys
  return {
    success: true,
    mode: "simulated-speech-synthesis",
    voiceId,
    useWebSpeechFallback: true,
    transcript: alertText,
    audioDataUri: null, // Frontend will play using Web Speech API or synthesizers
    note: "ElevenLabs API key not set or unavailable. Using instant client-side Web Audio synthesis with high priority voice timbre."
  };
}

module.exports = {
  generateVoiceAlert,
  DEFAULT_VOICE_ID
};
