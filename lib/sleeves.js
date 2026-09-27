// Σταθερή "τυχαία" παλέτα εξωφύλλου ανά slug. Τα εξώφυλλα είναι δικά μας,
// τυπογραφικά — ΟΧΙ αναπαραγωγή των πραγματικών (έχουν πνευματικά
// δικαιώματα) — εμπνευσμένα από τις ελληνικές δισκογραφικές ετικέτες των '60s.
const SLEEVES = [
  { bg: "#8c3a3a", fg: "#faf5ea", accent: "#e9c98a", label: "#e9c98a" },
  { bg: "#2f4a5c", fg: "#f3ead8", accent: "#e39b6b", label: "#e39b6b" },
  { bg: "#b8863c", fg: "#241b16", accent: "#faf5ea", label: "#8c3a3a" },
  { bg: "#3f6d64", fg: "#f3ead8", accent: "#f0d9a8", label: "#f0d9a8" },
  { bg: "#e8dcc2", fg: "#241b16", accent: "#8c3a3a", label: "#8c3a3a" },
  { bg: "#a15c3a", fg: "#faf5ea", accent: "#241b16", label: "#2f4a5c" },
  { bg: "#241b16", fg: "#e9c98a", accent: "#8c3a3a", label: "#b8863c" },
  { bg: "#c9b27c", fg: "#2f2419", accent: "#2f4a5c", label: "#3f6d64" },
];

export function sleeveFor(slug) {
  let h = 0;
  for (const ch of slug || "") h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { ...SLEEVES[h % SLEEVES.length], variant: h % 4 };
}
