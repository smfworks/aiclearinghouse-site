"use client";

import { useEffect } from "react";
import Script from "next/script";

/** Hydrate twitter-tweet blockquotes that marked() left in the article HTML. */
export default function TwitterWidgetLoader() {
  useEffect(() => {
    const load = () => {
      try {
        const widgets = (window as Window & { twttr?: { widgets?: { load?: (el?: HTMLElement | null) => void } } }).twttr?.widgets;
        widgets?.load?.();
      } catch {
        // X widget unavailable
      }
    };
    load();
    const timer = setTimeout(load, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Script
      src="https://platform.x.com/widgets.js"
      strategy="afterInteractive"
      charSet="utf-8"
      onLoad={() => {
        try {
          const widgets = (window as Window & { twttr?: { widgets?: { load?: () => void } } }).twttr?.widgets;
          widgets?.load?.();
        } catch {
          // Ignore
        }
      }}
    />
  );
}
