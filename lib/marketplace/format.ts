export function formatPrice(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return `$${n.toFixed(n < 1 ? 3 : 2)}`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export function modelSlug(modelId: string): string {
  return modelId.replace(/[^a-z0-9]+/g, "-").toLowerCase();
}
