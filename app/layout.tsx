import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://versatilescientist.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Versatile Scientist | Research, Mentorship & Opportunities",
    template: "%s | Versatile Scientist",
  },
  description:
    "Empowering students, scholars, and researchers worldwide with insights, academic guidance, and research opportunities.",
  keywords: ["STEM", "Scholarships", "Research", "Academic Guidance", "Mentorship", "Science Blog"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Versatile Scientist",
    title: "Versatile Scientist | Research, Mentorship & Opportunities",
    description: "Empowering students, scholars, and researchers worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Versatile Scientist",
    description: "Empowering students, scholars, and researchers worldwide.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.jpg" },
    ],
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </head>
      <body
        className={`${dmSans.className} ${playfair.variable} ${dmSans.variable}`}
      >
        <NextTopLoader showSpinner={false} color="#1d4ed8" height={3} />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
