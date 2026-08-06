// Splits a headline into segments, marking which segments match one of the
// accentWords phrases so they can be rendered in the accent color.

export type Segment = { text: string; accent: boolean };

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const splitHeadline = (
  headline: string,
  accentWords: string[],
): Segment[] => {
  if (accentWords.length === 0) return [{ text: headline, accent: false }];

  // Longest phrases first so multi-word matches win over their substrings.
  const sorted = [...accentWords].sort((a, b) => b.length - a.length);
  const pattern = sorted.map(escapeRegExp).join("|");
  const re = new RegExp(`(${pattern})`, "g");

  return headline
    .split(re)
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      accent: accentWords.includes(part),
    }));
};
