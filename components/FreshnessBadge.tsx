import { Clock, AlertTriangle } from "lucide-react";

interface Props {
  dateString?: string;
}

function parseDate(input: string): Date | null {
  if (!input) return null;
  const cleaned = input.trim();
  // Try ISO-like or US formats: 2026-06-14, Jun 14 2026, 06/14/2026
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(cleaned);
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}T00:00:00Z`);
    return isNaN(d.getTime()) ? null : d;
  }

  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(cleaned);
  if (us) {
    const d = new Date(`${us[3]}-${us[1].padStart(2, "0")}-${us[2].padStart(2, "0")}T00:00:00Z`);
    return isNaN(d.getTime()) ? null : d;
  }

  const words = /^(\w{3})\s+(\d{1,2}),?\s+(\d{4})/.exec(cleaned);
  if (words) {
    const d = new Date(`${words[1]} ${words[2]}, ${words[3]} 00:00:00 UTC`);
    return isNaN(d.getTime()) ? null : d;
  }

  const fallback = new Date(cleaned);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function daysSince(date: Date): number {
  const now = new Date();
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
}

export default function FreshnessBadge({ dateString }: Props) {
  const date = parseDate(dateString || "");
  if (!date) return null;

  const days = Math.floor(daysSince(date));
  let status: "fresh" | "aging" | "stale";
  if (days <= 30) status = "fresh";
  else if (days <= 90) status = "aging";
  else status = "stale";

  const styles = {
    fresh: "border-success/30 bg-success-muted text-success",
    aging: "border-warning/30 bg-warning-muted text-warning",
    stale: "border-danger/30 bg-danger/10 text-danger",
  };

  const label = days === 0 ? "Verified today" : days === 1 ? "Verified 1 day ago" : `Verified ${days} days ago`;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {status === "stale" ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}
