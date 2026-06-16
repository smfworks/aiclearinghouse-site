"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface XVideoEmbedProps {
  tweetUrl: string;
  className?: string;
  maxWidth?: number;
}

/**
 * X (Twitter) video embed component.
 * Renders the tweet using X's widget script so the embedded video is playable inline.
 * Calls twttr.widgets.load() after mount to ensure the widget is processed on client navigation.
 */
export default function XVideoEmbed({
  tweetUrl,
  className = "",
  maxWidth = 560,
}: XVideoEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const process = () => {
      try {
        if (typeof window !== "undefined" && (window as any).twttr?.widgets?.load) {
          (window as any).twttr.widgets.load(containerRef.current);
        }
      } catch {
        // Fail silently if X widget API is unavailable
      }
    };

    // Process immediately and again after a short delay to handle lazy script load
    process();
    const timer = setTimeout(process, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className={`x-video-embed ${className}`}>
      <blockquote
        className="twitter-tweet"
        data-media-max-width={maxWidth}
        data-dnt="true"
      >
        <p lang="en" dir="ltr">
          What is the SMF Clearinghouse?
          <br />
          The tools are multiplying. Compare autonomous agents, LLM pricing,
          open-source tools, vendor services, and tested self-hosting recipes —
          without wading through marketing copy.{" "}
          <a href={tweetUrl}>{tweetUrl}</a>
        </p>
        — Mike Gannotti (@MichaelGannotti){" "}
        <a href={`${tweetUrl}?ref_src=twsrc%5Etfw`}>June 16, 2026</a>
      </blockquote>
      <Script
        src="https://platform.x.com/widgets.js"
        strategy="afterInteractive"
        charSet="utf-8"
        onLoad={() => {
          try {
            if ((window as any).twttr?.widgets?.load) {
              (window as any).twttr.widgets.load(containerRef.current);
            }
          } catch {
            // Ignore
          }
        }}
      />
    </div>
  );
}
