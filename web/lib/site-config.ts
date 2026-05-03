export const siteConfig = {
  legalName: "ResearchScholars.online",
  domain: "researchscholars.online",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchscholars.online",
  tagline:
    "Structured academic support, delivered by verified PhD scholars across India.",
  description:
    "PhD-led thesis writing, dissertations, research papers, assignments, synopsis, and Scopus journal publication support. Original work, university-standard formatting, and confidential delivery.",
  phoneDisplay: "+91 76781 82421",
  whatsappNumber: "917678182421",
  email: "researchscholars.online@gmail.com",
  hours: "Monday to Saturday, 9:00 AM – 9:00 PM IST",
  foundingYear: 2008,
};

export function whatsappHref(prefill?: string) {
  const text =
    prefill ??
    "Hello, I would like a free quote for academic writing support.";
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
