# 🛡️ ScholarSentinel — Autonomous AI Scholarship Watchdog
> **Built for Emmanuel (300L Computer Engineering, Federal University of Technology, Akure - FUTA)**  
> *Official submission for the [Hacktoberfest 2026 Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026_Weekend_Challenge-FF6B4A?style=for-the-badge&logo=hacktoberfest&logoColor=white)](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)
[![Google Gemma](https://img.shields.io/badge/Google_Gemma-Open--Weights_Core-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/gemma)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com)
[![ElevenLabs](https://img.shields.io/badge/Voice_Alerts-ElevenLabs-black?style=for-the-badge)](https://elevenlabs.io)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![SerpApi](https://img.shields.io/badge/Web_Scout-SerpApi-blue?style=for-the-badge)](https://serpapi.com)

---

## 📖 The Story Behind ScholarSentinel

My younger brother, **Emmanuel**, is a 300-level Computer Engineering student at the **Federal University of Technology, Akure (FUTA)** in Nigeria. Like thousands of determined STEM undergraduates, he applies for major merit-based scholarships (NNPC/TotalEnergies, Chevron JV, MTN Foundation Science & Technology, PTDF, Jim Ovia, Shell).

Recently, Emmanuel suffered a devastating blow. He was shortlisted for a prestigious oil & gas scholarship screening test. But in Nigeria, **scholarship boards notoriously do not send candidate invitation emails**. Instead, they quietly upload massive PDF candidate lists or post unformatted bulletin updates on portal announcement pages and student forums (like *Myschool* and *Scholar9ja*). 

Because no email arrived in his inbox, Emmanuel had no idea he was shortlisted. By the time news reached him through campus word-of-mouth, the computer-based testing (CBT) center session in Akure had already concluded. His seat was forfeited.

He had the GPA, the technical skills, and the drive to pass with flying colors—but lost a life-changing scholarship purely due to a communication breakdown.

**ScholarSentinel** was engineered specifically so that Emmanuel—and any student like him—**never misses another scholarship screening date again**.

---

## ⚡ How It Works

ScholarSentinel combines autonomous web intelligence, open-source AI parsing, vector state persistence, and multi-channel urgency dispatch:

```mermaid
graph TD
    A[Educational Boards, Blogs & Portals] -->|Automated Web Crawl| B[SerpApi Web Scout]
    B -->|Raw PDF Tables & Bulletins| C[Google Gemma Open-Source AI Core]
    P[Emmanuel's Profile & Applied List] --> C
    
    subgraph "Open AI Intelligence Core (Gemma)"
        C -->|Candidate Matcher| C1[Match: Emmanuel Adeyemi / FUTA / CPE/21/4892]
        C -->|Entity Extraction| C2[Extract: CBT Date, Venue, Time, Requirements]
        C -->|Action Payload| C3[Generate Structured Action Notice]
    end
    
    C3 -->|Store State & Audit Log| D[(MongoDB Atlas)]
    C3 -->|Generate Audio Briefing| E[ElevenLabs Voice Engine]
    C3 -->|Format Emergency Dispatch| F[WhatsApp Alert Service]
    
    E -->|High-Priority Voice Notice| G[Emmanuel's Phone & Dashboard]
    F -->|Instant Message & Maps Link| G
    
    subgraph "Deployment & Cloud Engine"
        H[Render Web Service] -.->|Hosts 24/7 Service| G
    end
```

---

## 🏆 Hacktoberfest 2026 Partner Tracks & Integrations

ScholarSentinel was architected to compete across multiple featured and partner prize tracks:

### 🌟 1. Best Use of Gemma ($200)
- **Component:** [`lib/gemma.js`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/lib/gemma.js) / [`app/api/gemma/route.js`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/app/api/gemma/route.js)
- **Role:** Google Gemma open-weight models (Gemma 2 9B instruction-tuned) serve as the central cognitive engine. It parses unstructured circular text, matches Emmanuel's academic credentials (institution, matriculation number, JAMB reg code), extracts CBT test venues (e.g. *FUTA Digital Research Centre*), times, and mandatory items.
- **Why Open Innovation Matters:**
  - **Zero Student Cost:** Nigerian students cannot pay recurring dollar API subscriptions ($1 USD = ~₦1,600). Open-weight Gemma runs for free.
  - **100% Student Data Privacy:** Sensitive academic IDs, NINs, and state-of-origin records are processed in private memory without being harvested for commercial model training.
  - **Offline Campus Resilience:** Can be run locally via `llama.cpp` or Ollama on campus even during internet blackouts.

### 🌟 2. Best Use of Render ($200)
- **Component:** [`render.yaml`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/render.yaml)
- **Role:** The entire ScholarSentinel Next.js full-stack application, API routes, and scheduled watchdog worker run on Render with zero-downtime continuous deployment from GitHub.

### 🛠️ 3. Best Use of ElevenLabs ($100)
- **Component:** [`lib/elevenlabs.js`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/lib/elevenlabs.js) / [`app/api/elevenlabs/route.js`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/app/api/elevenlabs/route.js)
- **Role:** Sound breaks through where emails are ignored. When a shortlist match is verified, ElevenLabs synthesizes an urgent, natural audio briefing detailing the exam venue, accreditation cutoff time, and required documents.

### 🛠️ 4. Best Use of SerpApi ($100)
- **Component:** [`lib/serpapi.js`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/lib/serpapi.js) / [`app/api/scan/route.js`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/app/api/scan/route.js)
- **Role:** Autonomous scout that queries Google search across Nigerian education boards, university forums, and press bulletins for newly released shortlist circulars.

### 🛠️ 5. Best Use of MongoDB Atlas ($100)
- **Component:** [`lib/mongo.js`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/lib/mongo.js) / [`app/api/scholarships/route.js`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/app/api/scholarships/route.js)
- **Role:** Document store tracking applied scholarships, Emmanuel's credentials, test center locations, and historical shortlist matching logs.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/emarc99/scholarsentinel.git
cd scholarsentinel
npm install
```

### 2. Configure Environment (Optional)
Create a `.env` file (or test directly with pre-loaded realistic simulation data):
```env
PORT=3000
GEMMA_API_KEY=your_google_ai_or_gemma_key
ELEVENLABS_API_KEY=your_elevenlabs_key
SERPAPI_API_KEY=your_serpapi_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/scholarsentinel
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Render in 1 Click

1. Push your repository to GitHub.
2. In Render, select **New + Blueprint** and point it to your repository.
3. Render reads [`render.yaml`](file:///c:/Users/LENOVO/Documents/web2-3%20hacks/hacktoberfest26/dev-challalenges/weekend-launch/render.yaml) and automatically builds and provisions the web service.

---

## 📄 License
MIT License • Created with ❤️ for Emmanuel Adeyemi (FUTA) as part of Hacktoberfest 2026.
