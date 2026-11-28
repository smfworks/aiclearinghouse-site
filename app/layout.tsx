import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_ORIGIN, siteJsonLdHtml } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  title: "SMF Clearinghouse — The SMF Works AI Field Journal",
  description:
    "AI R&D at the intersection of human-AI interaction and personal and organizational transformation: tested, cited dispatches and open-source tools, templates, and benchmarks from SMF Works.",
  authors: [{ name: "Pamela Flannery", url: "https://smfworks.com" }],
  keywords: [
    "AI R&D",
    "AI agents",
    "autonomous AI",
    "human-AI interaction",
    "organizational transformation",
    "open source AI",
    "local LLMs",
  ],
  openGraph: {
    title: "SMF Clearinghouse",
    description:
      "AI R&D at the intersection of human-AI interaction and personal and organizational transformation: tested, cited dispatches and open-source projects from SMF Works.",
    url: `${SITE_ORIGIN}/`,
    siteName: "SMF Clearinghouse",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMF Clearinghouse",
    description:
      "AI R&D at the intersection of human-AI interaction and personal and organizational transformation: tested, cited dispatches and open-source projects from SMF Works.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased dark ${spaceGrotesk.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-foreground selection:bg-accent/25 selection:text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: siteJsonLdHtml() }}
        />
        {children}
      </body>
    </html>
  );
}
