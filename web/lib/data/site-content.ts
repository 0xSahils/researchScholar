import type { ContentIconKey } from "@/lib/types/content-icon";

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/scopus-publication", label: "Scopus publication" },
  { href: "/research-support", label: "Research support" },
  { href: "/blog", label: "Blog" },
  { href: "/track-order", label: "Track order" },
  { href: "/contact", label: "Contact" },
] as const;

export const megaServices = [
  {
    title: "Thesis writing",
    description: "Full chapter structure to your university standard.",
    href: "/services#thesis",
    icon: "scroll",
  },
  {
    title: "Dissertations",
    description: "Doctoral depth, methodology, and analysis support.",
    href: "/services#dissertation",
    icon: "books",
  },
  {
    title: "Research papers",
    description: "Journal-ready manuscripts and citations.",
    href: "/services#papers",
    icon: "article",
  },
  {
    title: "Assignments",
    description: "Subject experts, urgent turnaround when feasible.",
    href: "/services#assignments",
    icon: "fileText",
  },
  {
    title: "Synopsis writing",
    description: "Committee-ready proposals and ethics formats.",
    href: "/services#synopsis",
    icon: "certificate",
  },
  {
    title: "Scopus publication",
    description: "Selection, manuscript polish, submission, revisions.",
    href: "/scopus-publication",
    icon: "sealCheck",
  },
] as const;

export const heroStatsChips = [
  "100% original work",
  "94% Scopus acceptance",
  "PhD scholar-led",
  "4.9 / 5 client rating",
] as const;

export const homeStats = [
  { value: 500, suffix: "+", label: "Academic projects completed" },
  { value: 200, suffix: "+", label: "Researchers and students served" },
  { value: 30, suffix: "+", label: "Scopus papers from our network" },
  { value: 94, suffix: "%", label: "Indexed journal acceptance rate" },
  { value: 98, suffix: "%", label: "On-time delivery rate" },
] as const;

export const featureStrips: {
  title: string;
  body: string;
  icon: ContentIconKey;
}[] = [
  {
    title: "Research and writing",
    body: "PhD-led writing from assignments to full doctoral dissertations, aligned to your institution’s format.",
    icon: "graduationCap",
  },
  {
    title: "Scopus journal publication",
    body: "Manuscript preparation through to submission and reviewer response, with a verified acceptance track record.",
    icon: "sealCheck",
  },
  {
    title: "Originality guarantee",
    body: "Turnitin and iThenticate checks before delivery, with an originality certificate on request.",
    icon: "certificate",
  },
];

export const challengeCards = [
  {
    title: "Thesis structure gaps",
    body: "Committees expect depth in literature review, methodology, and discussion—often without a clear map of what “enough” means.",
  },
  {
    title: "Journal rejection loops",
    body: "First submissions frequently fail on fit, abstract strength, formatting, or incomplete literature positioning.",
  },
  {
    title: "Deadline pressure",
    body: "Coursework, research, teaching, and personal commitments compete with writing to publication standard.",
  },
  {
    title: "Limited mentor bandwidth",
    body: "High supervisor ratios make deep, continuous writing guidance difficult to access.",
  },
  {
    title: "Citation and paraphrasing risk",
    body: "Accidental similarity from weak paraphrasing or missing citations can derail a degree or publication.",
  },
  {
    title: "Predatory journal noise",
    body: "Thousands of outlets misrepresent indexing; legitimate targets require careful verification.",
  },
];

export const serviceTabs = [
  {
    id: "ug",
    label: "Undergraduate",
    summary: "Assignments, research papers, and structured project reports.",
    services: ["assignments", "papers", "synopsis"],
  },
  {
    id: "pg",
    label: "Postgraduate",
    summary: "Thesis chapters, dissertations, and publication-ready papers.",
    services: ["thesis", "dissertation", "papers", "synopsis"],
  },
  {
    id: "phd",
    label: "PhD scholars",
    summary: "Synopsis, thesis chapters, papers, and Scopus end-to-end support.",
    services: ["synopsis", "thesis", "papers", "scopus"],
  },
  {
    id: "faculty",
    label: "Faculty and researchers",
    summary: "Manuscript editing, restructuring, and indexed journal strategy.",
    services: ["papers", "scopus"],
  },
] as const;

export const serviceCards: Record<
  string,
  {
    id: string;
    title: string;
    stat: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
  }
> = {
  thesis: {
    id: "thesis",
    title: "Thesis writing",
    stat: "200+ delivered",
    description:
      "Chapter-wise structure, literature review, methodology, results, and bibliography matched to your guide’s expectations.",
    imageSrc: "/images/service-thesis.png",
    imageAlt: "Scholarly thesis documents and research notes on a desk",
  },
  dissertation: {
    id: "dissertation",
    title: "Dissertations",
    stat: "98% on-time",
    description:
      "Doctoral-level research design, analysis support, and polished academic register across every chapter.",
    imageSrc: "/images/service-dissertation.png",
    imageAlt: "Doctoral candidate presenting research charts to a committee",
  },
  papers: {
    id: "papers",
    title: "Research papers",
    stat: "Journal-ready",
    description:
      "IMRaD-aligned drafts in APA 7, IEEE, Harvard, Vancouver, and other major styles for Scopus or UGC outlets.",
    imageSrc: "/images/service-papers.png",
    imageAlt: "Printed research paper with editorial marks and graphs",
  },
  assignments: {
    id: "assignments",
    title: "Assignments",
    stat: "24-hour urgent slots",
    description:
      "Subject-matched experts, clear brief adherence, and originality verification before you submit.",
    imageSrc: "/images/service-assignments.png",
    imageAlt: "Student working on a laptop with notes in a focused study session",
  },
  synopsis: {
    id: "synopsis",
    title: "Synopsis writing",
    stat: "Committee format",
    description:
      "Objectives, hypotheses, methodology, timeline, and expected outcomes aligned to ethics committee templates.",
    imageSrc: "/images/service-synopsis.png",
    imageAlt: "Research synopsis outline marked with academic annotations",
  },
  scopus: {
    id: "scopus",
    title: "Scopus publication",
    stat: "94% acceptance",
    description:
      "Journal shortlist, manuscript compliance, cover letter, submission, and structured revision responses.",
    imageSrc: "/images/service-scopus.png",
    imageAlt: "Open academic journal spread showing peer-reviewed article layout",
  },
};

export const processSteps: {
  title: string;
  body: string;
  icon: ContentIconKey;
}[] = [
  {
    title: "Share requirements",
    body: "Use the order form or WhatsApp with topic, deadline, university, and any rubric. Typical first response within an hour on working days.",
    icon: "fileText",
  },
  {
    title: "PhD expert assigned",
    body: "We match a scholar with active research in your domain—no generic writers, no cross-domain shortcuts.",
    icon: "microscope",
  },
  {
    title: "Receive verified work",
    body: "Delivery includes similarity checks where applicable, formatting to brief, and revision support until you are satisfied within scope.",
    icon: "sealCheck",
  },
];

export const whyChoose = [
  {
    title: "Verified PhD scholar bench",
    body: "Doctoral credentials and publication history are checked before onboarding.",
  },
  {
    title: "University-standard quality",
    body: "We mirror your institution’s structure, citation style, and depth expectations—not a one-template-fits-all draft.",
  },
  {
    title: "Indexed journal fluency",
    body: "Familiarity with Scopus and UGC-care criteria, desk review pitfalls, and reviewer tone.",
  },
  {
    title: "Originality checks",
    body: "Turnitin and iThenticate workflows with documented similarity and revision when needed.",
  },
  {
    title: "On-time delivery culture",
    body: "Operational tracking across 500+ engagements with transparent milestone updates.",
  },
  {
    title: "Revisions included",
    body: "Structured revision cycles so feedback from your guide or reviewers is incorporated systematically.",
  },
  {
    title: "Confidential handling",
    body: "Identity, topic, and files are compartmentalised with least-privilege access for the assigned team.",
  },
];

export const partnerLabels = [
  "IIT ecosystem",
  "IIM placements research",
  "Elsevier workflows",
  "Scopus indexing",
  "UGC guidelines",
  "Springer formats",
  "Wiley author guides",
  "NAAC documentation",
  "Anna University",
  "Osmania University",
];

export const testimonials = [
  {
    name: "Priya Sundaram",
    role: "M.Tech scholar",
    org: "NITK Surathkal",
    quote:
      "My supervisor returned fourteen comments on a single draft. The scholar rebuilt methodology and literature review with clearer claims-to-evidence mapping. The next review cleared without further structural rework.",
    tag: "Thesis writing",
    rating: 5,
  },
  {
    name: "Dr. Arjun Mehta",
    role: "Assistant professor",
    org: "Amrita Vishwa Vidyapeetham",
    quote:
      "Two desk rejections for abstract and discussion linkage issues. The team rewrote both sections, tightened novelty framing, and suggested a better quartile fit. A Q2 Scopus journal accepted the revision in under six weeks.",
    tag: "Scopus publication",
    rating: 5,
  },
  {
    name: "Kavitha Raman",
    role: "MBA final year",
    org: "Symbiosis Institute",
    quote:
      "Twelve-day dissertation window with quantitative analysis. A management PhD lead joined the same day, delivered two days early, and matched Symbiosis formatting line by line.",
    tag: "Dissertation",
    rating: 5,
  },
];

export const trustLogosRow = partnerLabels;

export const teamMembers = [
  {
    name: "Dr. Vikram Deshpande",
    title: "Lead scholar, mechanical systems",
    credentials: "PhD, IIT background, twelve years applied research",
    publications: "8 Scopus-indexed articles",
    bio: "Guides structural mechanics theses and journal submissions with a reviewer’s lens on novelty and reproducibility.",
  },
  {
    name: "Dr. Neha Kulkarni",
    title: "Lead scholar, management sciences",
    credentials: "PhD, case-method specialist",
    publications: "6 Scopus case and empirical papers",
    bio: "Builds MBA and doctoral narratives with defensible frameworks and clean data stories for committee scrutiny.",
  },
  {
    name: "Dr. Riya Menon",
    title: "Lead scholar, life sciences",
    credentials: "PhD, peer reviewer for three indexed journals",
    publications: "30+ peer-reviewed papers",
    bio: "Aligns wet-lab and clinical writing to journal-specific reporting checklists and CONSORT-style clarity.",
  },
  {
    name: "Dr. Karthik Iyer",
    title: "Lead scholar, computer science and AI",
    credentials: "PhD, IEEE and Springer publications",
    publications: "Cross-venue reproducibility focus",
    bio: "Structures ML systems papers with crisp problem formalisation, ablation discipline, and artifact-ready appendices.",
  },
];

export const aboutStoryParagraphs = [
  "ResearchScholars.online was founded by PhD scholars who repeatedly saw capable students stall on writing mechanics, journal navigation, and time—not on curiosity or data.",
  "What began as informal reviews for peers grew into a governed delivery model: domain-matched scholars, similarity checks, structured revisions, and transparent timelines.",
  "Today we support masters students, doctoral candidates, and faculty across India with the same rigour we apply to our own submissions: clear claims, honest limitations, and publication-grade presentation.",
];

export const missionVision = {
  mission:
    "Make PhD-led academic support accessible to every serious researcher in India—especially where mentorship bandwidth is thin.",
  vision:
    "Become the most trusted Indian platform for structured writing and indexed publication support, known for defensible quality and ethical boundaries.",
};

export const credibilityBlocks = [
  {
    title: "0% plagiarism incidents",
    body: "Documented checks and revision loops across five hundred plus deliveries.",
  },
  {
    title: "100% PhD bench",
    body: "No freelance generalists; credentials verified before project assignment.",
  },
  {
    title: "94% Scopus acceptance",
    body: "Measured on supported submissions with transparent scope boundaries.",
  },
  {
    title: "Institution-matched formatting",
    body: "We mirror your guide’s rubric—not a generic template.",
  },
];

export const values = [
  {
    title: "Academic integrity",
    body: "We provide structured support and language clarity while you remain the author of record for your submissions.",
  },
  {
    title: "Originality first",
    body: "No recycled paragraphs. Similarity checks and transparent revision when scores need to move.",
  },
  {
    title: "Confidentiality",
    body: "Topics, identities, and institutional affiliations are handled with strict need-to-know access.",
  },
  {
    title: "Deadline respect",
    body: "If we accept a timeline, we staff for it—with contingency built into quality review.",
  },
  {
    title: "Quality over volume",
    body: "We decline work we cannot match to a domain expert within your window.",
  },
  {
    title: "Student-first support",
    body: "WhatsApp escalation to your scholar lead when you need fast clarification mid-project.",
  },
];

export const audienceTabs = [
  { id: "ug", label: "Undergraduate", description: "First-time research projects and capstones requiring strong structural guidance." },
  { id: "pg", label: "Postgraduate", description: "Methodological support and rigorous analytical presentation for master's theses." },
  { id: "phd", label: "PhD Scholars", description: "Extensive dissertation drafting, robust arguments, and peer-reviewed journal pre-acceptance alignment." },
  { id: "faculty", label: "Faculty & Researchers", description: "Editorial polish, citation auditing, and submission strategy for top-tier indexing." },
];

export const academicStandards = [
  "APA 7", "MLA 9", "Harvard", "IEEE", "Chicago 17", "Vancouver", "UGC Guidelines", "Scopus Standards"
];

export const pricingData = [
  { id: "synopsis", title: "Synopsis", price: "₹1,000", features: ["Proposal structure", "Committee template format", "3-5 days standard delivery"], popular: false },
  { id: "research-paper", title: "Research Paper", price: "₹1,500", features: ["IMRaD Journal manuscript", "All citations & references", "3-7 days standard delivery"], popular: true },
  { id: "term-papers", title: "Term Papers / Assignments", price: "₹2,000", features: ["Subject-expert matched", "24-48 hours urgent available", "Originality verified"], popular: false },
  { id: "dissertation", title: "Dissertation", price: "₹8,999", features: ["Advanced research design", "Complete data analysis mapping", "10-20 days standard delivery"], popular: false },
  { id: "thesis", title: "Thesis", price: "₹15,000", features: ["Full end-to-end chapter writing", "Turnitin plagiarism cleared", "7-15 days standard delivery"], popular: true },
];
