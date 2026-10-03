/** Compact notation: 1000 to "1K", 1500000 to "1.5M". */
export function formatNumber(num: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });
  return formatter.format(num);
}
/** Ordinal suffix: 1 to "1st", 2 to "2nd". */
export function formatNumberOrdinal(num: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
}
