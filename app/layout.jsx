import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata = {
  title: "ScholarSentinel — Autonomous AI Scholarship Watchdog for Daniel (FUTA)",
  description: "Open-source AI scholarship watchdog built by Emmanuel for his brother Daniel (300L Computer Engineering, FUTA) to monitor test center shortlists, parse messy circulars with Google Gemma, and dispatch urgent ElevenLabs voice alerts and WhatsApp notifications.",
  keywords: ["hacktoberfest", "hacktoberfest2026", "gemma", "elevenlabs", "render", "serpapi", "mongodb-atlas", "devchallenge", "weekendchallenge", "hf26challenge"],
  authors: [{ name: "Emmanuel Aroso" }],
  openGraph: {
    title: "ScholarSentinel — Autonomous AI Scholarship Watchdog",
    description: "Built by Emmanuel for his brother Daniel (FUTA Computer Engineering) to eliminate silent missed scholarship exam dates.",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
