import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_ORIGIN, siteJsonLdHtml } from "@/lib/site";

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
    "Field notes from the SMF Works team on AI agents: how-tos, releases, and practitioner dispatches from building with agents every day.",
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
      "Field notes from the SMF Works team on AI agents: how-tos, releases, and practitioner dispatches.",
    url: `${SITE_ORIGIN}/`,
    siteName: "SMF Clearinghouse",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMF Clearinghouse",
    description:
      "Field notes from the SMF Works team on AI agents: how-tos, releases, and practitioner dispatches.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-canvas">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: siteJsonLdHtml() }}
        />
        {children}
      </body>
    </html>
  );
}
