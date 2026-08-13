export function extractInteger(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  if (
    typeof val === 'object' &&
    'toNumber' in val &&
    typeof (val as { toNumber: () => number }).toNumber === 'function'
  ) {
    return (val as { toNumber: () => number }).toNumber();
  }
  return Number(val) || 0;
}
