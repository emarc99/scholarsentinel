/**
 * WhatsApp Emergency Dispatcher Module
 * 
 * Generates direct high-urgency WhatsApp dispatch payloads and direct action links
 * formatted for Daniel's mobile phone (+2348123456789).
 */

function formatWhatsAppAlert(scholarshipData, profile) {
  const title = scholarshipData.title || "National University Scholarship";
  const date = scholarshipData.examDate || "Saturday, 10th October 2026";
  const venue = scholarshipData.examVenue || "FUTA Digital Research Centre, Obanla Campus, Akure";
  const time = scholarshipData.examTime || "08:00 AM WAT";
  const accreditation = scholarshipData.accreditationTime || "07:30 AM WAT";
  const docs = scholarshipData.requirements || [
    "Original FUTA Student ID Card",
    "Printed CBT Screening Slip",
    "JAMB Admission Letter"
  ];

  const message = `🚨 *URGENT SCHOLARSHIP ALERT FOR DANIEL* 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 *Scholarship:* ${title}
📍 *Status:* *SHORTLISTED FOR CBT SCREENING!*
👤 *Candidate:* ${profile.fullName}
🏫 *Institution:* ${profile.institution} (300L)
🔢 *Matric No:* ${profile.matricNo}

🗓️ *EXAM DATE:* *${date}*
⏰ *Start Time:* ${time}
⏳ *Accreditation Closes:* ${accreditation}
🏛️ *VENUE:* *${venue}*

📋 *MANDATORY REQUIREMENTS:*
${docs.map(d => `• ${d}`).join("\n")}

⚠️ *DO NOT MISS THIS!* They did not send an email notification. Please pack your documents tonight.

🔗 *Portal Ref:* ${scholarshipData.sourceUrl || "https://scholarships.portal.ng"}
━━━━━━━━━━━━━━━━━━━━━━━━━━
_Sent autonomously by ScholarSentinel Watchdog_`;

  // Encode for WhatsApp click-to-chat
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = profile.whatsappNumber.replace(/[^0-9]/g, "");
  const directLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return {
    recipientPhone: profile.whatsappNumber,
    recipientName: profile.fullName,
    messageText: message,
    encodedMessage,
    directLink,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  formatWhatsAppAlert
};
