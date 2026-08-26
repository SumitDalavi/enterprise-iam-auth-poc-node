import { generateSecret, totp, verifyTotp, hotp } from '../src/auth/totp';
import assert from 'assert';

describe('TOTP', () => {
  it('generates a non-empty secret', () => {
    const secret = generateSecret();
    assert.ok(secret.length >= 16, 'Secret should be at least 16 chars');
    assert.match(secret, /^[A-Z2-7]+$/, 'Secret should be base32');
  });

  it('generates a 6-digit TOTP code', () => {
    const secret = generateSecret();
    const code = totp(secret);
    assert.match(code, /^\d{6}$/, 'TOTP code should be 6 digits');
  });

  it('verifies current TOTP code', () => {
    const secret = generateSecret();
    const code = totp(secret);
    assert.ok(verifyTotp(secret, code), 'Current TOTP should verify');
  });

  it('rejects wrong TOTP code', () => {
    const secret = generateSecret();
    assert.ok(!verifyTotp(secret, '000000'), 'Wrong code should not verify');
  });

  it('HOTP is deterministic', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const c1 = hotp(secret, 0n);
    const c2 = hotp(secret, 0n);
    assert.strictEqual(c1, c2);
    assert.strictEqual(c1.length, 6);
  });
});
