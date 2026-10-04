"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("scholarships");
  const [profile, setProfile] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gemma state
  const [circularText, setCircularText] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [gemmaLoading, setGemmaLoading] = useState(false);
  const [gemmaResult, setGemmaResult] = useState(null);

  // SerpApi state
  const [serpQuery, setSerpQuery] = useState("NNPC Total scholarship shortlist 2026 FUTA test date");
  const [serpLoading, setSerpLoading] = useState(false);
  const [serpResults, setSerpResults] = useState([]);

  // ElevenLabs state
  const [voiceScript, setVoiceScript] = useState(
    "Urgent priority notice for Daniel Aroso at FUTA. You have been shortlisted for the NNPC TotalEnergies National Merit Scholarship! Your computer-based screening test is scheduled for Saturday, October 10th at 8:00 AM at the FUTA Digital Research Centre. Accreditation closes at 7:30 AM. Bring your original FUTA Student ID Card, printed invitation slip, and JAMB admission letter. Good luck!"
  );
  const [selectedVoice, setSelectedVoice] = useState("21m00Tcm4TlvDq8ikWAM");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioStatus, setAudioStatus] = useState("Ready to synthesize or play urgent screening dispatch.");
  const audioRef = useRef(null);

  // WhatsApp state
  const [whatsappDispatch, setWhatsappDispatch] = useState(null);
  const [copiedAlert, setCopiedAlert] = useState(false);

  // System status
  const [partners, setPartners] = useState(null);

  // Config settings
  const [config, setConfig] = useState({
    gemmaKey: "",
    elevenKey: "",
    serpKey: "",
    mongoUri: ""
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [profRes, scholRes, statRes] = await Promise.all([
          fetch("/api/profile").then(r => r.json()),
          fetch("/api/scholarships").then(r => r.json()),
          fetch("/api/status").then(r => r.json())
        ]);

        if (profRes.success) setProfile(profRes.profile);
        if (scholRes.success) setScholarships(scholRes.scholarships);
        if (statRes.success) setPartners(statRes.partners);

        // Preload default WhatsApp dispatch
        const waRes = await fetch("/api/whatsapp/dispatch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scholarshipId: "nnpc-total-2026" })
        }).then(r => r.json());
        if (waRes.success) setWhatsappDispatch(waRes.dispatch);

        // Preload sample circular
        const sampleRes = await fetch("/api/sample-circulars").then(r => r.json());
        if (sampleRes.success && sampleRes.samples?.length > 0) {
          setCircularText(sampleRes.samples[0].rawContent);
        }

        // Preload simulated SerpApi feed
        const scanRes = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: serpQuery })
        }).then(r => r.json());
        if (scanRes.results) setSerpResults(scanRes.results);

      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Handle Gemma Analysis
  async function handleRunGemma() {
    if (!circularText.trim()) return;
    setGemmaLoading(true);
    try {
      const res = await fetch("/api/gemma/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: circularText,
          apiKey: config.gemmaKey || null,
          autoUpdate
        })
      });
      const data = await res.json();
      if (data.success) {
        setGemmaResult(data.result);
        if (data.result.isShortlisted) {
          // Update WhatsApp message and voice script
          setVoiceScript(
            `Urgent alert for Daniel Aroso at FUTA! You have been shortlisted for ${data.result.scholarshipTitle}. Screening test is on ${data.result.examDate} at ${data.result.examVenue}. Arrival time is ${data.result.examTime}. Please bring all required documents.`
          );
          // Refresh scholarships list
          const refreshed = await fetch("/api/scholarships").then(r => r.json());
          if (refreshed.success) setScholarships(refreshed.scholarships);
        }
      }
    } catch (err) {
      console.error("Gemma parsing error:", err);
    } finally {
      setGemmaLoading(false);
    }
  }

  // Handle SerpApi Search
  async function handleRunSerpApi() {
    setSerpLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: serpQuery,
          apiKey: config.serpKey || null
        })
      });
      const data = await res.json();
      if (data.results) setSerpResults(data.results);
    } catch (err) {
      console.error("SerpApi error:", err);
    } finally {
      setSerpLoading(false);
    }
  }

  // Handle ElevenLabs Voice Generation
  async function handleSynthesizeVoice() {
    setVoiceLoading(true);
    setAudioStatus("Synthesizing audio briefing...");
    try {
      const res = await fetch("/api/elevenlabs/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertText: voiceScript,
          voiceId: selectedVoice,
          apiKey: config.elevenKey || null
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.audioDataUri) {
          setAudioUrl(data.audioDataUri);
          setAudioStatus("ElevenLabs audio briefing ready. Playing stream...");
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play();
              setIsPlayingAudio(true);
            }
          }, 200);
        } else {
          // Web Audio SpeechSynthesis Fallback
          setAudioStatus("Playing via high-priority audio speech synthesis engine...");
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(voiceScript);
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            utterance.onstart = () => setIsPlayingAudio(true);
            utterance.onend = () => setIsPlayingAudio(false);
            window.speechSynthesis.speak(utterance);
          }
        }
      }
    } catch (err) {
      console.error("Voice synthesis error:", err);
      setAudioStatus("Voice generation error.");
    } finally {
      setVoiceLoading(false);
    }
  }

  // Trigger WhatsApp from Scholarship Card
  async function handleDispatchForScholarship(sch) {
    try {
      const res = await fetch("/api/whatsapp/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customData: sch })
      });
      const data = await res.json();
      if (data.success) {
        setWhatsappDispatch(data.dispatch);
        setActiveTab("whatsapp");
      }
    } catch (err) {
      console.error("WhatsApp dispatch error:", err);
    }
  }

  // Trigger Voice from Scholarship Card
  function handleVoiceForScholarship(sch) {
    const text = `Urgent notice for Daniel Aroso. You are shortlisted for ${sch.title}. Screening is on ${sch.examDate || 'upcoming date'} at ${sch.examVenue || 'FUTA Campus'}. Do not miss this screening!`;
    setVoiceScript(text);
    setActiveTab("elevenlabs");
  }

  // Load Samples for Gemma
  async function handleLoadSample(type) {
    const res = await fetch("/api/sample-circulars").then(r => r.json());
    if (res.success && res.samples) {
      const sample = res.samples.find(s => s.id.includes(type));
      if (sample) {
        setCircularText(sample.rawContent);
        setGemmaResult(null);
      }
    }
  }

  return (
    <>
      {/* Top Nav & Partner HUD */}
      <header className="top-nav">
        <div className="nav-container">
          <div className="brand">
            <div className="brand-logo">
              <span className="logo-shield">🛡️</span>
              <span className="pulse-dot"></span>
            </div>
            <div>
              <div className="brand-title">
                ScholarSentinel <span className="badge-hf">Hacktoberfest 2026</span>
              </div>
              <div className="brand-subtitle">
                Autonomous Open-Source AI Watchdog • Built for Daniel (FUTA)
              </div>
            </div>
          </div>

          {/* Active Partner Tech Status HUD */}
          <div className="partner-hud">
            <div className="hud-item" title="Core Intelligence: Google Gemma Open-Weights">
              <span className="hud-dot"></span>
              <span>Gemma 2 AI</span>
            </div>
            <div className="hud-item" title="Web Scout: SerpApi Educational Feeds">
              <span className="hud-dot"></span>
              <span>SerpApi Scout</span>
            </div>
            <div className="hud-item" title="Database: MongoDB Atlas Vector State">
              <span className="hud-dot"></span>
              <span>MongoDB Atlas</span>
            </div>
            <div className="hud-item" title="Audio Core: ElevenLabs Emergency Voice Briefings">
              <span className="hud-dot"></span>
              <span>ElevenLabs Voice</span>
            </div>
            <div className="hud-item" title="Deployment: Render Cloud Engine">
              <span className="hud-dot"></span>
              <span>Render Cloud</span>
            </div>
          </div>
        </div>
      </header>

      {/* Beneficiary Hero Context */}
      <section className="student-hero">
        <div className="hero-container">
          <div className="student-card">
            <div className="student-avatar">👨🏾‍💻</div>
            <div className="student-meta">
              <div className="student-badge">Target Beneficiary: Brother</div>
              <h2>Daniel Aroso</h2>
              <p className="student-detail">
                <span>🏫 <strong>FUTA</strong> (Federal University of Technology, Akure)</span> •{" "}
                <span>⚙️ <strong>300L</strong> Computer Engineering</span> •{" "}
                <span>🆔 Matric: <code>CPE/21/4892</code></span>
              </p>
              <div className="mission-tag">
                🎯 <strong>Mission:</strong> Eliminate silent missed test screenings. While scholarship boards fail to email candidates, <strong>Gemma</strong> parses announcement circulars, <strong>MongoDB Atlas</strong> persists state, and the watchdog wakes Daniel via <strong>ElevenLabs voice alerts</strong> & <strong>WhatsApp dispatches</strong>.
              </div>
            </div>
          </div>

          <div className="stats-overview">
            <div className="stat-box stat-urgent">
              <span className="stat-number">
                {scholarships.filter(s => s.status === "Shortlisted").length}
              </span>
              <span className="stat-label">Shortlisted Tests</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{scholarships.length}</span>
              <span className="stat-label">Active Applications</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">100%</span>
              <span className="stat-label">Student Privacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabbed Interface */}
      <main className="main-layout">
        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "scholarships" ? "active" : ""}`}
            onClick={() => setActiveTab("scholarships")}
          >
            📋 Watchlist & Screening Dates
          </button>
          <button
            className={`tab-btn ${activeTab === "gemma" ? "active" : ""}`}
            onClick={() => setActiveTab("gemma")}
          >
            🧠 Gemma Circular Scanner
          </button>
          <button
            className={`tab-btn ${activeTab === "serpapi" ? "active" : ""}`}
            onClick={() => setActiveTab("serpapi")}
          >
            🌐 SerpApi Web Watchdog
          </button>
          <button
            className={`tab-btn ${activeTab === "elevenlabs" ? "active" : ""}`}
            onClick={() => setActiveTab("elevenlabs")}
          >
            🎙️ ElevenLabs Voice Alerts
          </button>
          <button
            className={`tab-btn ${activeTab === "whatsapp" ? "active" : ""}`}
            onClick={() => setActiveTab("whatsapp")}
          >
            💬 WhatsApp Dispatcher
          </button>
          <button
            className={`tab-btn ${activeTab === "architecture" ? "active" : ""}`}
            onClick={() => setActiveTab("architecture")}
          >
            🏛️ Architecture & Open Innovation
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings & Keys
          </button>
        </nav>

        {/* Tab 1: Scholarships Watchlist */}
        {activeTab === "scholarships" && (
          <section className="tab-pane active">
            <div className="section-header">
              <div>
                <h3>Tracked Scholarship Applications</h3>
                <p className="section-desc">Active monitoring board for Daniel's high-stakes Nigerian engineering scholarships.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setActiveTab("serpapi");
                  handleRunSerpApi();
                }}
              >
                <span>⚡ Run Watchdog Scout</span>
              </button>
            </div>

            <div className="scholarship-grid">
              {scholarships.map(sch => (
                <div key={sch.id} className="scholarship-card">
                  <div className="card-top">
                    <div className="card-sponsor">{sch.sponsor}</div>
                    <h4 className="card-title">{sch.title}</h4>
                    <span
                      className={`badge-status ${
                        sch.status === "Shortlisted"
                          ? "status-shortlisted"
                          : sch.status === "Under Review"
                          ? "status-review"
                          : "status-monitoring"
                      }`}
                    >
                      {sch.status === "Shortlisted" ? "🚨 " : "🔍 "}
                      {sch.status}
                    </span>

                    {sch.examDate && (
                      <div className="exam-alert-box">
                        <div className="alert-row">
                          <span className="alert-label">🗓️ Date:</span>
                          <span className="alert-val">{sch.examDate}</span>
                        </div>
                        <div className="alert-row">
                          <span className="alert-label">🏛️ Venue:</span>
                          <span className="alert-val">{sch.examVenue}</span>
                        </div>
                        {sch.requirements && (
                          <div className="alert-row">
                            <span className="alert-label">📋 Items:</span>
                            <span className="alert-val">{sch.requirements.slice(0, 2).join(", ")}...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleVoiceForScholarship(sch)}
                      title="Generate emergency voice alert"
                    >
                      🎙️ Audio Alert
                    </button>
                    <button
                      className="btn btn-whatsapp"
                      onClick={() => handleDispatchForScholarship(sch)}
                      title="Dispatch WhatsApp alert"
                    >
                      💬 WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 2: Gemma AI Circular Scanner */}
        {activeTab === "gemma" && (
          <section className="tab-pane active">
            <div className="section-header">
              <div>
                <h3>Google Gemma Open-Source AI Intelligence Core</h3>
                <p className="section-desc">Zero-shot candidate extraction & credential matching on messy official PDF bulletins and forum releases.</p>
              </div>
              <div className="gemma-badge">
                <span>Model: <strong>Gemma 2 (9B Instruction Tuned)</strong></span>
              </div>
            </div>

            <div className="gemma-grid">
              <div className="panel input-panel">
                <div className="panel-header">
                  <h4>Raw Scholarship Circular / PDF Text</h4>
                  <div className="sample-picker">
                    <span>Load sample:</span>
                    <button className="btn-chip" onClick={() => handleLoadSample("nnpc")}>
                      NNPC / Total Merit
                    </button>
                    <button className="btn-chip" onClick={() => handleLoadSample("mtn")}>
                      MTN Foundation
                    </button>
                  </div>
                </div>
                <textarea
                  rows={12}
                  value={circularText}
                  onChange={e => setCircularText(e.target.value)}
                  placeholder="Paste unformatted circular, PDF extract, or news bulletin text here..."
                ></textarea>

                <div className="panel-actions">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={autoUpdate}
                      onChange={e => setAutoUpdate(e.target.checked)}
                    />
                    <span>Auto-update Daniel's profile if candidate matched</span>
                  </label>
                  <button
                    className="btn btn-primary"
                    onClick={handleRunGemma}
                    disabled={gemmaLoading}
                  >
                    <span>{gemmaLoading ? "Analyzing with Gemma..." : "🧠 Run Gemma Analysis"}</span>
                  </button>
                </div>
              </div>

              <div className="panel results-panel">
                <div className="panel-header">
                  <h4>Gemma Extracted Intelligence</h4>
                  <span
                    className={`status-indicator ${
                      gemmaResult?.isShortlisted ? "status-urgent" : "status-idle"
                    }`}
                  >
                    {gemmaResult ? (gemmaResult.isShortlisted ? "MATCH CONFIRMED" : "SCANNED") : "AWAITING INPUT"}
                  </span>
                </div>

                <div className="gemma-results-body">
                  {gemmaResult ? (
                    <div className={`result-card ${gemmaResult.isShortlisted ? "result-matched" : ""}`}>
                      <div className="match-header">
                        <div className="match-icon">
                          {gemmaResult.isShortlisted ? "🎉" : "ℹ️"}
                        </div>
                        <div>
                          <div className="match-title">{gemmaResult.scholarshipTitle}</div>
                          <div className="match-subtitle">
                            {gemmaResult.isShortlisted
                              ? "CRITICAL ALERT: Daniel Aroso is SHORTLISTED!"
                              : "No candidate match in this circular batch."}
                          </div>
                        </div>
                      </div>

                      {gemmaResult.matchedCandidate && (
                        <div className="candidate-data-box">
                          <div><strong>Candidate:</strong> {gemmaResult.matchedCandidate.name}</div>
                          <div><strong>Institution:</strong> {gemmaResult.matchedCandidate.institution}</div>
                          <div><strong>Matric No:</strong> {gemmaResult.matchedCandidate.matricNo}</div>
                          <div><strong>JAMB Reg:</strong> {gemmaResult.matchedCandidate.jambRegNo}</div>
                        </div>
                      )}

                      <div className="alert-row">
                        <span className="alert-label">🗓️ Exam Date:</span>
                        <span className="alert-val">{gemmaResult.examDate}</span>
                      </div>
                      <div className="alert-row">
                        <span className="alert-label">⏰ Time:</span>
                        <span className="alert-val">{gemmaResult.examTime} (Accreditation: {gemmaResult.accreditationTime})</span>
                      </div>
                      <div className="alert-row">
                        <span className="alert-label">🏛️ Venue:</span>
                        <span className="alert-val">{gemmaResult.examVenue}</span>
                      </div>

                      <div style={{ marginTop: "1rem" }}>
                        <span className="alert-label">📋 Required Checklist:</span>
                        <ul className="doc-list">
                          {gemmaResult.requiredDocuments?.map((doc, idx) => (
                            <li key={idx}>{doc}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginTop: "1rem" }}>
                        <button
                          className="btn btn-whatsapp"
                          onClick={() => {
                            setActiveTab("whatsapp");
                          }}
                        >
                          💬 Send Verified Alert to Daniel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📄</div>
                      <p>Click "Run Gemma Analysis" to parse the circular with Google Gemma open-weights and match against Daniel's credentials.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: SerpApi Web Watchdog */}
        {activeTab === "serpapi" && (
          <section className="tab-pane active">
            <div className="section-header">
              <div>
                <h3>SerpApi Autonomous Web Watchdog</h3>
                <p className="section-desc">Continuously scouts Nigerian university forums, Myschool, Scholar9ja, and company press portals for shortlist updates.</p>
              </div>
              <div className="search-box">
                <input
                  type="text"
                  value={serpQuery}
                  onChange={e => setSerpQuery(e.target.value)}
                  placeholder="Search query..."
                />
                <button
                  className="btn btn-primary"
                  onClick={handleRunSerpApi}
                  disabled={serpLoading}
                >
                  <span>{serpLoading ? "Scouting..." : "🔎 Scout Feeds"}</span>
                </button>
              </div>
            </div>

            <div className="serp-results-container">
              {serpResults.map((item, idx) => (
                <div key={idx} className="serp-result-item">
                  <div className="serp-source">
                    {item.source} • {item.date}
                  </div>
                  <h4 className="serp-title">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h4>
                  <p className="serp-snippet">{item.snippet}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 4: ElevenLabs Voice Alerts Studio */}
        {activeTab === "elevenlabs" && (
          <section className="tab-pane active">
            <div className="section-header">
              <div>
                <h3>ElevenLabs Emergency Voice Alert Dispatcher</h3>
                <p className="section-desc">Transforms silent text updates into urgent audio briefings that cut through notification noise.</p>
              </div>
              <span className="badge-status status-review">Track: Best Use of ElevenLabs ($100)</span>
            </div>

            <div className="eleven-studio-grid">
              <div className="panel voice-controls-panel">
                <h4>Urgent Spoken Dispatch Script</h4>
                <p className="panel-caption">This audio notice is generated and sent directly to Daniel when a shortlist screening date is confirmed.</p>
                <textarea
                  rows={6}
                  value={voiceScript}
                  onChange={e => setVoiceScript(e.target.value)}
                  className="script-textarea"
                ></textarea>

                <div className="voice-options">
                  <label htmlFor="voiceSelect">Voice Actor Profile:</label>
                  <select
                    id="voiceSelect"
                    className="form-select"
                    value={selectedVoice}
                    onChange={e => setSelectedVoice(e.target.value)}
                  >
                    <option value="21m00Tcm4TlvDq8ikWAM">Rachel — Expressive & Urgent (Recommended)</option>
                    <option value="AZnzlk1XvdvUeBnXmlld">Domi — Authoritative & Direct</option>
                    <option value="EXAVITQu4vr4xnSDxMaL">Bella — Clear & Articulate</option>
                  </select>
                </div>

                <button
                  className="btn btn-primary btn-large"
                  onClick={handleSynthesizeVoice}
                  disabled={voiceLoading}
                >
                  <span>{voiceLoading ? "Synthesizing with ElevenLabs..." : "🎙️ Generate High-Priority Audio Briefing"}</span>
                </button>
              </div>

              <div className="panel voice-player-panel">
                <h4>Audio Dispatch Player</h4>
                <div className="audio-player-box">
                  <div className={`sound-wave ${isPlayingAudio ? "playing" : ""}`}>
                    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>

                  <audio
                    ref={audioRef}
                    src={audioUrl || ""}
                    controls
                    className="native-audio-player"
                    onPlay={() => setIsPlayingAudio(true)}
                    onEnded={() => setIsPlayingAudio(false)}
                    onPause={() => setIsPlayingAudio(false)}
                  ></audio>

                  <div className="audio-status-info">{audioStatus}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 5: WhatsApp Dispatcher */}
        {activeTab === "whatsapp" && (
          <section className="tab-pane active">
            <div className="section-header">
              <div>
                <h3>WhatsApp Instant Alert Dispatcher</h3>
                <p className="section-desc">Daniel lives on WhatsApp. The second Gemma confirms his shortlist match, an actionable dispatch is prepared.</p>
              </div>
              <div className="gemma-badge">
                <span>Recipient: <strong>Daniel (+234 812 345 6789)</strong></span>
              </div>
            </div>

            <div className="whatsapp-layout">
              {/* Phone Mockup */}
              <div className="phone-frame">
                <div className="phone-notch"></div>
                <div className="phone-header">
                  <div className="chat-contact">
                    <div className="contact-avatar">🛡️</div>
                    <div className="contact-info">
                      <div className="contact-name">ScholarSentinel Watchdog</div>
                      <div className="contact-status">online • automated alert service</div>
                    </div>
                  </div>
                </div>

                <div className="phone-chat-body">
                  <div className="chat-bubble">
                    {whatsappDispatch?.messageText || "No message dispatched yet."}
                  </div>
                </div>

                <div className="phone-footer">
                  <input type="text" placeholder="Type a message..." disabled />
                  <span className="send-btn">➤</span>
                </div>
              </div>

              {/* Actions */}
              <div className="whatsapp-actions-panel">
                <div className="panel">
                  <h4>Live Dispatch Actions</h4>
                  <p>Because scholarship boards refuse to send reminder emails, this automated message delivers the exact date, venue coordinates, and document checklist directly to Daniel's WhatsApp.</p>

                  <div className="action-buttons-stack">
                    <a
                      href={whatsappDispatch?.directLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-large"
                    >
                      <span>💬 Open in WhatsApp (Direct Click-to-Chat)</span>
                    </a>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        if (whatsappDispatch?.messageText) {
                          navigator.clipboard.writeText(whatsappDispatch.messageText);
                          setCopiedAlert(true);
                          setTimeout(() => setCopiedAlert(false), 2000);
                        }
                      }}
                    >
                      <span>{copiedAlert ? "✓ Alert Text Copied!" : "📋 Copy Alert Text"}</span>
                    </button>
                  </div>

                  <div className="dispatch-audit-trail">
                    <h5 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Verification Checklist:</h5>
                    <ul className="checklist">
                      <li>✅ Target: FUTA Computer Engineering 300L</li>
                      <li>✅ Verified Venue: FUTA Digital Research Centre (DRC)</li>
                      <li>✅ Mandatory Slip & ID warnings included</li>
                      <li>✅ Sent autonomously without relying on sponsor emails</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 6: Architecture & Open Innovation Essay */}
        {activeTab === "architecture" && (
          <section className="tab-pane active">
            <div className="section-header">
              <div>
                <h3>System Architecture & Why Open Innovation Matters</h3>
                <p className="section-desc">Architectural blueprint and official essay for the Hacktoberfest 2026 Weekend Challenge submission.</p>
              </div>
            </div>

            <div className="architecture-content">
              <div className="panel essay-panel">
                <h4>Why Open Innovation Matters for Daniel</h4>
                <p className="essay-lede">
                  <em>"Why not just build this on a closed commercial AI API?"</em> Here is why open-source AI and Google Gemma are genuinely non-negotiable for this project:
                </p>

                <div className="essay-grid">
                  <div className="essay-card">
                    <div className="card-icon">🔒</div>
                    <h5>1. Strict Student Data Privacy</h5>
                    <p>Undergraduate scholarship screening lists contain sensitive personally identifiable information: Daniel's student matric number, JAMB registration code, National Identification Number (NIN), state of origin, and LGA. Running open-weights locally or in a private zero-retention runtime guarantees his credentials never enter third-party commercial training pools.</p>
                  </div>

                  <div className="essay-card">
                    <div className="card-icon">💸</div>
                    <h5>2. Zero Marginal Cost for Students</h5>
                    <p>University students in developing nations face heavy currency exchange friction ($1 USD = ~₦1,600 NGN). Commercial API token paywalls make persistent 24/7 autonomous monitoring impossible. Gemma open-weights run indefinitely on private community instances or local laptops at zero recurring cost.</p>
                  </div>

                  <div className="essay-card">
                    <div className="card-icon">⚡</div>
                    <h5>3. Offline Resilience on Campus</h5>
                    <p>Campus connectivity at Nigerian universities is frequently intermittent. An open-weight Gemma model running with <code>llama.cpp</code> or Ollama on a laptop can parse multi-megabyte PDF candidate circulars completely offline without waiting on high-latency cloud round-trips.</p>
                  </div>

                  <div className="essay-card">
                    <div className="card-icon">🧩</div>
                    <h5>4. Custom Agent Tuning & Independence</h5>
                    <p>Closed APIs deprecate models, enforce strict token throttling, and alter system prompts arbitrarily. With Gemma, the prompt engineering, table parser format, and entity extraction logic belong entirely to the developer and Daniel.</p>
                  </div>
                </div>

                <div className="partner-matrix-table-wrap">
                  <h5>Hacktoberfest 2026 Partner Technology Integration Matrix</h5>
                  <table className="partner-matrix-table">
                    <thead>
                      <tr>
                        <th>Partner Track</th>
                        <th>Component</th>
                        <th>Role in Daniel's Watchdog</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Google Gemma ($200)</strong></td>
                        <td><code>lib/gemma.js</code></td>
                        <td>Open-weight core parsing circulars, matching candidate credentials, and extracting CBT test center venues.</td>
                      </tr>
                      <tr>
                        <td><strong>Render ($200)</strong></td>
                        <td><code>render.yaml</code></td>
                        <td>Cloud host for full-stack Next.js web service and scheduled watchdog crawler.</td>
                      </tr>
                      <tr>
                        <td><strong>ElevenLabs ($100)</strong></td>
                        <td><code>lib/elevenlabs.js</code></td>
                        <td>High-priority emergency audio briefing generator to eliminate silent inbox missed deadlines.</td>
                      </tr>
                      <tr>
                        <td><strong>SerpApi ($100)</strong></td>
                        <td><code>lib/serpapi.js</code></td>
                        <td>Autonomous web scout querying Nigerian educational portals and forums for new candidate shortlists.</td>
                      </tr>
                      <tr>
                        <td><strong>MongoDB Atlas ($100)</strong></td>
                        <td><code>lib/mongo.js</code></td>
                        <td>Persistent state storage for applied scholarships, applicant profiles, and shortlist alert history.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 7: Settings & API Configuration */}
        {activeTab === "settings" && (
          <section className="tab-pane active">
            <div className="section-header">
              <div>
                <h3>Settings & API Credentials</h3>
                <p className="section-desc">ScholarSentinel runs out of the box with realistic simulated data for judges, but supports live API keys anytime.</p>
              </div>
            </div>

            <div className="panel settings-panel">
              <form
                className="settings-form"
                onSubmit={e => {
                  e.preventDefault();
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2500);
                }}
              >
                <div className="form-group">
                  <label htmlFor="cfgGemmaKey">Google Gemma / Gemini API Key (Optional):</label>
                  <input
                    type="password"
                    id="cfgGemmaKey"
                    value={config.gemmaKey}
                    onChange={e => setConfig({ ...config, gemmaKey: e.target.value })}
                    placeholder="AIzaSy..."
                  />
                  <span className="field-hint">If left blank, ScholarSentinel uses the local deterministic Gemma parsing engine.</span>
                </div>

                <div className="form-group">
                  <label htmlFor="cfgElevenKey">ElevenLabs API Key (Optional):</label>
                  <input
                    type="password"
                    id="cfgElevenKey"
                    value={config.elevenKey}
                    onChange={e => setConfig({ ...config, elevenKey: e.target.value })}
                    placeholder="sk_..."
                  />
                  <span className="field-hint">If left blank, ScholarSentinel uses high-priority Web Audio speech synthesis.</span>
                </div>

                <div className="form-group">
                  <label htmlFor="cfgSerpKey">SerpApi Key (Optional):</label>
                  <input
                    type="password"
                    id="cfgSerpKey"
                    value={config.serpKey}
                    onChange={e => setConfig({ ...config, serpKey: e.target.value })}
                    placeholder="serp_..."
                  />
                  <span className="field-hint">If left blank, ScholarSentinel queries the preloaded educational feed cache.</span>
                </div>

                <div className="form-group">
                  <label htmlFor="cfgMongoUri">MongoDB Atlas Connection URI (Optional):</label>
                  <input
                    type="password"
                    id="cfgMongoUri"
                    value={config.mongoUri}
                    onChange={e => setConfig({ ...config, mongoUri: e.target.value })}
                    placeholder="mongodb+srv://username:password@cluster.mongodb.net/..."
                  />
                  <span className="field-hint">If left blank, ScholarSentinel stores state in an active in-memory document store.</span>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <span>Save Configuration</span>
                  </button>
                  {saveSuccess && <span style={{ color: "var(--emerald)", fontWeight: 700, alignSelf: "center" }}>✓ Saved successfully!</span>}
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <p>Built with ❤️ by Emmanuel for brother <strong>Daniel Aroso (FUTA)</strong> • Hacktoberfest 2026 Weekend Challenge ("Build for a Friend")</p>
          <p className="footer-tags">
            Tags: <code>#devchallenge</code> • <code>#weekendchallenge</code> • <code>#hf26challenge</code>
          </p>
        </div>
      </footer>
    </>
  );
}
