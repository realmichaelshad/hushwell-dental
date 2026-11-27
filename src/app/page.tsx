import { Hero } from "@/components/home/Hero";
import {
  ComfortSection,
  FinalCta,
  FirstVisitSection,
  InsuranceSection,
  ReviewsSection,
  ServicesSection,
  TeamSection,
  VisitSection,
} from "@/components/home/Sections";
import { CONTACT, HOURS, SITE } from "@/content/site";
import { openingHoursSpec } from "@/lib/hours";

/** Structured data so search engines can show hours and the address. */
function PracticeJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: SITE.name,
    url: SITE.url,
    telephone: CONTACT.phone,
    address: { "@type": "PostalAddress", streetAddress: CONTACT.street, addressLocality: CONTACT.town },
    openingHours: openingHoursSpec(HOURS),
    priceRange: "$$",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function HomePage() {
  return (
    <>
      <PracticeJsonLd />
      <Hero />
      <FirstVisitSection />
      <ServicesSection />
      <ComfortSection />
      <TeamSection />
      <ReviewsSection />
      <InsuranceSection />
      <VisitSection />
      <FinalCta />
    </>
  );
}
