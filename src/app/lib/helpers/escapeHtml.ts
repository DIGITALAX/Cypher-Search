const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value: string): string =>
  String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

export const safeHttpUrl = (value: string): string | null => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? value
      : null;
  } catch (err: any) {
    return null;
  }
};

export const safeJsonLd = (value: unknown): string =>
  (JSON.stringify(value) ?? "").replace(/</g, "\\u003c");

export default escapeHtml;
