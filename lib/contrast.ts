function linear(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = linear(parseInt(h.slice(0, 2), 16));
  const g = linear(parseInt(h.slice(2, 4), 16));
  const b = linear(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

const PAPER = "#ffffff";
const INK = "#050507";

/** Text color that reaches 4.5:1 on the given background. */
export function readableTextOn(background: string): string {
  return contrastRatio(PAPER, background) >= 4.5 ? PAPER : INK;
}
