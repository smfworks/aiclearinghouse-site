import { marked } from "marked";

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Give task-list checkboxes a name from the list item text. */
export function labelChecklistInputs(html: string): string {
  return html.replace(/<input\b([^>]*type="checkbox"[^>]*)>/gi, (match, attrs: string, offset: number, full: string) => {
    if (/aria-label=|aria-labelledby=/i.test(attrs)) return match;
    const liEnd = full.indexOf("</li>", offset);
    const rest = liEnd === -1 ? "" : full.slice(offset + match.length, liEnd);
    const text = rest.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return match;
    return `<input${attrs} aria-label="${escapeAttr(text)}">`;
  });
}

export function markdownToHtml(md: string): string {
  if (!md) return "";

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  return labelChecklistInputs(marked.parse(md) as string);
}
