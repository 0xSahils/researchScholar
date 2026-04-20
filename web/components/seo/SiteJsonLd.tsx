import { siteConfig } from "@/lib/site-config";

export function SiteJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.legalName,
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.legalName,
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
    },
    inLanguage: "en-IN",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
