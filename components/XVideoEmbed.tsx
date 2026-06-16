"use client";

import Script from "next/script";

interface XVideoEmbedProps {
  tweetUrl: string;
  className?: string;
  maxWidth?: number;
}

/**
 * X (Twitter) video embed component.
 * Renders the tweet using X's widget script so the embedded video is playable inline.
 */
export default function XVideoEmbed({
  tweetUrl,
  className = "",
  maxWidth = 560,
}: XVideoEmbedProps) {
  return (
    <div className={`x-video-embed ${className}`}>
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
        <a href={tweetUrl}>June 16, 2026</a>
      </blockquote>
      <Script
        src="https://platform.x.com/widgets.js"
        strategy="lazyOnload"
        charSet="utf-8"
      />
    </div>
  );
}
