export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sam Wightwick",
    "jobTitle": "Creative Frontend Developer",
    "description": "Frontend developer with 15+ years of experience building websites and web applications for some of the world's biggest brands and agencies.",
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "sameAs": [
      "https://github.com/samwightwick",
      "https://linkedin.com/in/samwightwick"
    ],
    "knowsAbout": [
      "React",
      "Three.js",
      "Next.js",
      "Frontend Development",
      "Web Development",
      "JavaScript",
      "TypeScript",
      "Creative Development"
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": process.env.NEXT_PUBLIC_SITE_URL
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}