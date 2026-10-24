import { businessDetails } from "@/content/legal";
import { copy } from "@/content/copy";
import { site } from "@/lib/site";

// Shared LocalBusiness/EducationalOrganization structured data, used on the homepage and on
// /llm-information. sameAs ties the site to the Google Business Profile (same NAP everywhere —
// name, address, phone — is what makes this signal count for local search).
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  name: "Anglit",
  url: site.url,
  email: businessDetails.email,
  telephone: businessDetails.phone,
  address: { "@type": "PostalAddress", streetAddress: businessDetails.address, addressCountry: "IL" },
  sameAs: [site.instagramUrl, site.googleBusinessUrl],
  description: copy.seoDescription,
};
