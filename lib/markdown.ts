import { marked } from "marked";

export function markdownToHtml(md: string): string {
  if (!md) return "";

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  return marked.parse(md) as string;
}
