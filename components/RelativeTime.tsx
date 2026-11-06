import { stableDateLabel } from "@/lib/time";

/** UTC calendar date. The same string on the server and in the browser. */
export default function RelativeTime({
  date,
  className,
}: {
  date?: string;
  className?: string;
}) {
  if (!date) return null;
  const label = stableDateLabel(date);
  if (!label) return null;
  return (
    <time dateTime={date} className={className}>
      {label}
    </time>
  );
}
