import type { RecordShape } from 'neo4j-driver';

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

export function getStr(record: RecordShape, key: string): string {
  const v = record.get(key);
  return v === null || v === undefined ? '' : String(v);
}
