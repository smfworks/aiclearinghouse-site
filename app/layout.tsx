import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMF Clearinghouse — Find the Right AI Agent",
  description:
    "Compare autonomous AI agents, LLM pricing, open-source tools, and self-hosting recipes. Built for builders, enthusiasts, and small businesses.",
  keywords: [
    "AI agents",
    "autonomous agents",
    "LLM pricing",
    "open source AI",
    "coding agents",
    "agent comparison",
    "self-hosting",
    "local LLMs",
  ],
  openGraph: {
    title: "SMF Clearinghouse",
    description: "Compare autonomous AI agents, LLM pricing, and self-hosting recipes.",
    url: "https://smfclearinghouse.com",
    siteName: "SMF Clearinghouse",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
