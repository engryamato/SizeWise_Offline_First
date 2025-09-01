// Integrity (hash/sign) — placeholders only, no external deps
import { createHash } from 'crypto';
import { stableStringify } from './canonicalize';

export function sha256Hex(obj: unknown): string {
  const json = stableStringify(obj);
  return createHash('sha256').update(json).digest('hex');
}

// Signing placeholders (ed25519/RSA) would wrap Node crypto with keys loaded from config/keystore.

