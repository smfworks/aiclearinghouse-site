import type { Metadata } from "next";
import { JetBrains_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_ORIGIN, siteJsonLdHtml } from "@/lib/site";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
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
    "The SMF Works AI field journal and open workshop: tested, cited dispatches from daily agent work, backed by open-source tools, templates, and benchmarks.",
  authors: [{ name: "Pamela Flannery", url: "https://smfworks.com/the-signal" }],
  keywords: [
    "AI agents",
    "autonomous agents",
    "open source AI",
    "coding agents",
    "agent how-tos",
    "local LLMs",
  ],
  openGraph: {
    title: "SMF Clearinghouse",
    description:
      "The SMF Works AI field journal and open workshop: tested, cited dispatches from daily agent work, backed by open-source tools, templates, and benchmarks.",
    url: `${SITE_ORIGIN}/`,
    siteName: "SMF Clearinghouse",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMF Clearinghouse",
    description:
      "The SMF Works AI field journal and open workshop: tested, cited dispatches from daily agent work, backed by open-source tools, templates, and benchmarks.",
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
      className={`h-full antialiased dark ${newsreader.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
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
