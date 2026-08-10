export function formatReadTime(value: unknown, fallback = "Read time pending") {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return `${Math.round(value)} min read`;
  }

  if (typeof value === "string") {
    const match = value.trim().match(/\d+/);
    if (match) return `${Number(match[0])} min read`;
  }

  return fallback;
}

export function stripSiteNameFromTitle(value: string) {
  return value
    .replace(/\s*(?:\||-|–|—)\s*HIDD Advisory\s*$/i, "")
    .trim();
}
