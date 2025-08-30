export function toNumber(value, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[,\s]/g, ''));
  return Number.isFinite(num) ? num : fallback;
}

export function clamp(value, min = 0, max = 100) {
  const n = toNumber(value, min);
  return Math.max(min, Math.min(max, n));
}
