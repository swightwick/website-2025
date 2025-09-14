import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import StructuredData from '@/components/StructuredData'
import ClientScripts from '@/components/ClientScripts'
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Sam Wightwick - Creative Frontend Developer",
    template: "%s | Sam Wightwick"
  },
  description: "Frontend developer with 15+ years experience. Interactive portfolio showcasing creative development with React Three Fiber, Next.js, and modern web technologies.",
  keywords: [
    "frontend developer",
    "creative developer", 
    "React developer",
    "Three.js developer",
    "Next.js developer",
    "web developer",
    "portfolio",
    "JavaScript",
    "TypeScript",
    "creative coding",
    "interactive design",
    "3D web development"
  ],
  authors: [{ name: "Sam Wightwick", url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: "Sam Wightwick",
  publisher: "Sam Wightwick",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Sam Wightwick Portfolio",
    title: "Sam Wightwick - Creative Frontend Developer",
    description: "Frontend developer with 15+ years experience. Interactive portfolio showcasing creative development with React Three Fiber and Next.js.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sam Wightwick - Creative Frontend Developer Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sam Wightwick - Creative Frontend Developer", 
    description: "Frontend developer with 15+ years experience. Interactive portfolio with React Three Fiber.",
    images: ["/og-image.jpg"],
    creator: "@samwightwick"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'theme-color': '#200B30',
    'color-scheme': 'dark light',
    'twitter:image': '/og-image.jpg',
    'twitter:card': 'summary_large_image',
    'og:image:width': '1200',
    'og:image:height': '630',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${dmMono.variable} antialiased font-mono`}
        suppressHydrationWarning
      >
        <StructuredData />
        <ClientScripts />
        {children}
      </body>
    </html>
  );
}
