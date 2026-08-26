import crypto from 'crypto';

/**
 * TOTP implementation (RFC 6238) — compatible with Google Authenticator.
 */
export function generateSecret(bytes: number = 20): string {
  const buf = crypto.randomBytes(bytes);
  return base32Encode(buf);
}

function base32Encode(buf: Buffer): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '', bits = 0, value = 0;
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += chars[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) result += chars[(value << (5 - bits)) & 0x1f];
  return result;
}

function base32Decode(str: string): Buffer {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let value = 0, bits = 0;
  const bytes: number[] = [];
  for (const c of str.toUpperCase()) {
    const idx = chars.indexOf(c);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return Buffer.from(bytes);
}

export function hotp(secret: string, counter: bigint, digits: number = 6): string {
  const key = base32Decode(secret);
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(counter);
  const hmac = crypto.createHmac('sha1', key).update(msg).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24) |
               (hmac[offset+1] << 16) | (hmac[offset+2] << 8) | hmac[offset+3];
  return String(code % (10 ** digits)).padStart(digits, '0');
}

export function totp(secret: string, step: number = 30, digits: number = 6): string {
  const counter = BigInt(Math.floor(Date.now() / 1000 / step));
  return hotp(secret, counter, digits);
}

export function verifyTotp(secret: string, code: string, step: number = 30, tolerance: number = 1): boolean {
  const counter = BigInt(Math.floor(Date.now() / 1000 / step));
  for (let i = -tolerance; i <= tolerance; i++) {
    if (crypto.timingSafeEqual(
      Buffer.from(hotp(secret, counter + BigInt(i))),
      Buffer.from(code)
    )) return true;
  }
  return false;
}
