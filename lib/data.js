/**
 * Default Seed Data for ScholarSentinel
 * Tailored specifically for Emmanuel (300L Computer Engineering, FUTA)
 */

const emmanuelProfile = {
  name: "Emmanuel",
  fullName: "Emmanuel Adeyemi",
  institution: "Federal University of Technology, Akure (FUTA)",
  department: "Computer Engineering",
  level: "300 Level",
  jambRegNo: "202390128498EF",
  matricNo: "CPE/21/4892",
  phone: "+2348123456789",
  whatsappNumber: "+2348123456789",
  stateOfOrigin: "Ondo State",
  lga: "Akure South",
  preferredExamRegion: "Akure / South-West",
  preferredCbtCenters: [
    "FUTA Digital Research Centre, Obanla Campus, Akure",
    "ETC CBT Centre, FUTA, Ondo Road, Akure",
    "JAMB Zonal Office, Alagbaka, Akure"
  ]
};

const initialScholarships = [
  {
    id: "nnpc-total-2026",
    title: "NNPC / TotalEnergies National Merit Scholarship",
    sponsor: "TotalEnergies & NNPC E&P Ltd",
    category: "Oil & Gas / Engineering",
    awardAmount: "₦150,000 / academic session",
    applicationDate: "2026-07-15",
    status: "Shortlisted",
    examStatus: "Screening Scheduled",
    examDate: "2026-10-10 08:00 AM WAT",
    examVenue: "FUTA Digital Research Centre, Obanla, Akure",
    requirements: [
      "Original FUTA Student ID Card",
      "Printed CBT Screening Invitation Slip",
      "JAMB Admission Letter",
      "Two Recent Passport Photographs"
    ],
    sourceUrl: "https://scholarships.totalenergies.ng/shortlist-2026",
    detectedDate: "2026-10-03",
    urgentAlertSent: true,
    audioAlertUrl: "/api/audio/sample-nnpc-alert.mp3"
  },
  {
    id: "mtn-foundation-2026",
    title: "MTN Foundation Science & Technology Scholarship",
    sponsor: "MTN Nigeria Foundation",
    category: "STEM / Computer Engineering",
    awardAmount: "₦200,000 / year until graduation",
    applicationDate: "2026-06-20",
    status: "Under Review",
    examStatus: "Pending Shortlist Release",
    examDate: null,
    examVenue: "TBD (Expected: Akure Zonal Center)",
    requirements: [
      "Academic Transcript (Minimum 3.5 CGPA)",
      "Valid Student ID Card",
      "Indigene Certificate"
    ],
    sourceUrl: "https://www.mtn.ng/foundation/scholarships/",
    detectedDate: null,
    urgentAlertSent: false
  },
  {
    id: "chevron-merit-2026",
    title: "Chevron Nigeria Joint Venture National University Scholarship",
    sponsor: "Chevron & NNPC JV",
    category: "Engineering & Geosciences",
    awardAmount: "₦250,000 / session",
    applicationDate: "2026-08-01",
    status: "Shortlisted",
    examStatus: "Awaiting Venue Confirmation",
    examDate: "2026-10-24 (Provisional)",
    examVenue: "South-West CBT Zonal Hub, Akure",
    requirements: [
      "School ID Card",
      "Admission Letter",
      "Confirmation of Enrolment from HOD Computer Engineering"
    ],
    sourceUrl: "https://www.scholarsplatform.org/chevron-shortlist-2026",
    detectedDate: "2026-10-04",
    urgentAlertSent: true
  },
  {
    id: "ptdf-undergraduate-2026",
    title: "PTDF National Undergraduate Scholarship",
    sponsor: "Petroleum Technology Development Fund",
    category: "Energy & Computing",
    awardAmount: "Full Tuition + LapTop Grant",
    applicationDate: "2026-05-12",
    status: "Monitoring",
    examStatus: "Circular Watchdog Active",
    examDate: null,
    examVenue: null,
    requirements: [
      "O-Level Results",
      "5 Credits including English and Mathematics",
      "FUTA 200L/300L Result Slip"
    ],
    sourceUrl: "https://ptdf.gov.ng/scholarships",
    detectedDate: null,
    urgentAlertSent: false
  },
  {
    id: "jim-ovia-ict-2026",
    title: "Jim Ovia Foundation Leaders Scholarship (JOFLS)",
    sponsor: "Jim Ovia Foundation & AAI",
    category: "Technology & Software Innovation",
    awardAmount: "Full Tuition + Annual Living Stipend",
    applicationDate: "2026-06-05",
    status: "Monitoring",
    examStatus: "Application Verified",
    examDate: null,
    examVenue: null,
    requirements: ["Personal Statement", "Engineering Project Portfolio", "2 Letters of Recommendation"],
    sourceUrl: "https://www.jimoviafoundation.org/",
    detectedDate: null,
    urgentAlertSent: false
  }
];

const sampleCirculars = [
  {
    id: "circ-nnpc-2026",
    headline: "NNPC/TotalEnergies 2026 National Merit Scholarship CBT Screening Schedule Released",
    source: "TotalEnergies Education Desk / Myschool News Digest",
    date: "2026-10-03",
    rawContent: `OFFICIAL RELEASE: TOTALENERGIES EP NIGERIA & NNPC LIMITED 2026 MERIT SCHOLARSHIP SCREENING EXERCISE
Notice to all 2026 Shortlisted Undergraduate Applicants in South-West Universities (OAU, FUTA, UNILAG, UI).
The Computer Based Aptitude Screening has been scheduled to take place on Saturday, 10th October 2026.
Accreditation begins strictly at 07:30 AM WAT, and exam commences at 08:00 AM.

AKURE EXAMINATION CENTRE:
Venue: FUTA Digital Research Centre (DRC), Obanla Campus, Federal University of Technology, Akure, Ondo State.

Shortlisted Candidates for Computer Engineering (FUTA) include:
1. Adebayo Olumide - CPE/21/4810
2. Emmanuel Adeyemi - CPE/21/4892 (JAMB: 202390128498EF) - Session 1
3. Okonkwo Chinedu - CPE/21/4901
4. Williams Kemi - CPE/21/4933

Candidates must present:
1. Valid FUTA Student Identity Card
2. CBT Screening Slip printout
3. JAMB Admission Letter
Failure to appear at the specified time implies automatic forfeiture of the scholarship award.`
  },
  {
    id: "circ-mtn-2026",
    headline: "MTN Foundation Scholarship Scheme 2026 (Phase 16) Shortlist Bulletin",
    source: "MTN Foundation Press Portal & Scholar9ja",
    date: "2026-10-02",
    rawContent: `MTN NIGERIA FOUNDATION SCHOLARSHIPS FOR 200L & 300L STEM STUDENTS
Verification of qualifying candidates from Nigerian Federal Universities is currently ongoing.
The first batch of shortlisted candidates for assessment tests will be published on Friday, 16th October 2026.
Students in Computer Engineering, Electrical Engineering, and Computer Science with CGPA >= 3.5 are advised to monitor official communications.
No individual invitation letters will be posted; all shortlisted names will be uploaded in portal bulletins.`
  }
];

module.exports = {
  emmanuelProfile,
  initialScholarships,
  sampleCirculars
};
