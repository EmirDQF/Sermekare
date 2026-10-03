import type { TrustStat } from "@/types/medical";

const NUMBER_FORMAT_LOCALE = "en-US"; // "15,000", igual que en el resto de la web

/** { value: 15000, prefix: "+" } → "+15,000" · { value: 4.9, decimals: 1 } → "4.9" */
export function formatStat(stat: Pick<TrustStat, "prefix" | "suffix" | "decimals">, value: number): string {
  const formatted = value.toLocaleString(NUMBER_FORMAT_LOCALE, {
    minimumFractionDigits: stat.decimals ?? 0,
    maximumFractionDigits: stat.decimals ?? 0,
  });
  return `${stat.prefix ?? ""}${formatted}${stat.suffix ?? ""}`;
}
