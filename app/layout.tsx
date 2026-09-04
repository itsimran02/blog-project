import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import NextTopLoader from "nextjs-toploader";
import fs from "fs";
import path from "path";
import "./globals.css";

// Sync logo with favicon files and eliminate default Vercel favicon
try {
  const publicDir = path.join(process.cwd(), "public");
  const appDir = path.join(process.cwd(), "app");
  const logoPath = path.join(publicDir, "logo.jpg");
  
  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath);
    
    // Overwrite the app/favicon.ico and public/favicon.ico with the real logo
    fs.writeFileSync(path.join(appDir, "favicon.ico"), logoBuffer);
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), logoBuffer);
    fs.writeFileSync(path.join(publicDir, "favicon-96x96.png"), logoBuffer);
    fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), logoBuffer);

    // Build self-contained vector SVG with embedded logo
    const base64Data = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="100" fill="#07163d"/>
  <g transform="translate(16, 16)">
    <clipPath id="logo-clip">
      <rect width="480" height="480" rx="84" fill="#ffffff"/>
    </clipPath>
    <rect width="480" height="480" rx="84" fill="#ffffff"/>
    <image href="${base64Data}" width="480" height="480" preserveAspectRatio="xMidYMid meet" clip-path="url(#logo-clip)"/>
  </g>
</svg>`;
    fs.writeFileSync(path.join(publicDir, "favicon.svg"), svgContent);
  }
} catch {
  // Silent fallback
}

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
        <NextTopLoader showSpinner={false} />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
