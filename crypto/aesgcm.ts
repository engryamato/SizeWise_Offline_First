// AES-256-GCM thin wrapper (placeholder; no external deps)
// NOTE: Argon2id KDF will require a dependency; this is a structural stub only.
import { randomBytes, webcrypto } from 'crypto';

export async function encryptAesGcm(plaintext: Uint8Array, key: Uint8Array) {
  const iv = randomBytes(12);
  const subtle = webcrypto.subtle;
  const cryptoKey = await subtle.importKey('raw', key, { name: 'AES-GCM' }, false, ['encrypt']);
  const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, plaintext);
  return { iv, ciphertext: new Uint8Array(ct) };
}

export async function decryptAesGcm(ciphertext: Uint8Array, key: Uint8Array, iv: Uint8Array) {
  const subtle = webcrypto.subtle;
  const cryptoKey = await subtle.importKey('raw', key, { name: 'AES-GCM' }, false, ['decrypt']);
  const pt = await subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext);
  return new Uint8Array(pt);
}

