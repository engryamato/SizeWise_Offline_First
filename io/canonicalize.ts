// Canonicalization utilities for .sizewise JSON
export function stableStringify(obj: unknown): string {
  return JSON.stringify(sortKeys(obj), replacer, 0);
}

function sortKeys(input: any): any {
  if (Array.isArray(input)) return input.map(sortKeys);
  if (input && typeof input === 'object') {
    const out: Record<string, any> = {};
    for (const key of Object.keys(input).sort()) out[key] = sortKeys((input as any)[key]);
    return out;
  }
  return input;
}

function replacer(_key: string, value: any) {
  return value === null || value === undefined ? undefined : value;
}

