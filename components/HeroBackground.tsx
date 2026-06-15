"use client";

import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  children?: React.ReactNode;
  overlayOpacity?: number;
  className?: string;
}

export default function HeroBackground({
  src,
  alt,
  children,
  overlayOpacity = 0.85,
  className = "",
}: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas to-canvas"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas/60 via-transparent to-canvas/60" />
      </div>
      <div className="bg-grid-faint absolute inset-0 pointer-events-none z-10" />
      <div className="relative z-20">{children}</div>
    </div>
  );
}
