export function normalizeNumericInput(value: string): string {
  return value.replace(",", ".").trim();
}

export function toPositiveNumber(value: string): number | null {
  const parsed = Number(normalizeNumericInput(value));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}
