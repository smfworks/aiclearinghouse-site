import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-canvas">{children}</body>
    </html>
  );
}
