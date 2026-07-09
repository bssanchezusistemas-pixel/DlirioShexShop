import { BUSINESS } from "@/data/catalog";
import { getSiteUrl } from "@/lib/site-url";

export function LocalBusinessJsonLd() {
  const siteUrl = getSiteUrl();
  const phone = BUSINESS.primaryWhatsApp.startsWith("+")
    ? BUSINESS.primaryWhatsApp
    : `+${BUSINESS.primaryWhatsApp}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: BUSINESS.name,
    description: BUSINESS.subheadline,
    url: siteUrl,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carrera 8 # 7-27",
      addressLocality: "Zarzal",
      addressRegion: "Valle del Cauca",
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    areaServed: {
      "@type": "City",
      name: "Zarzal",
    },
    hasMap: BUSINESS.mapsUrl,
    sameAs: [BUSINESS.instagram, BUSINESS.mapsUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
