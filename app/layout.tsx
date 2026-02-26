import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lora } from "next/font/google";
import CustomCursor from "./components/CustomCursor";
import HamsterPet from "./components/HamsterPet";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://divitperiwal.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Divit Periwal — Software Developer",
    template: "%s | Divit Periwal",
  },
  description:
    "Backend-focused software developer building systems that last. Experienced with TypeScript, Node.js, PostgreSQL, Redis, and Docker.",
  keywords: [
    "Divit Periwal",
    "Software Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "TypeScript",
    "Node.js",
    "Next.js",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Portfolio",
  ],
  authors: [{ name: "Divit Periwal", url: SITE_URL }],
  creator: "Divit Periwal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Divit Periwal",
    title: "Divit Periwal — Software Developer",
    description:
      "Backend-focused software developer building systems that last. Experienced with TypeScript, Node.js, PostgreSQL, Redis, and Docker.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Divit Periwal — Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divit Periwal — Software Developer",
    description:
      "Backend-focused software developer building systems that last.",
    images: ["/og.png"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased noise-overlay`}
      >
        <CustomCursor />
        <HamsterPet />
        {children}
      </body>
    </html>
  );
}
