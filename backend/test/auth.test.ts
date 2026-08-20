import { describe, it, expect, vi } from 'vitest';
import argon2 from 'argon2';

describe('Authentication Unit & Cryptographic Security', () => {
  it('should hash passwords using Argon2id with high entropy', async () => {
    const password = 'Password123!';
    const hash = await argon2.hash(password);

    expect(hash).toBeDefined();
    expect(hash.startsWith('$argon2')).toBe(true);

    const isValid = await argon2.verify(hash, password);
    expect(isValid).toBe(true);

    const isInvalid = await argon2.verify(hash, 'WrongPassword');
    expect(isInvalid).toBe(false);
  });

  it('should validate email format and reject malformed inputs', () => {
    const validEmails = ['demo@buglens.ai', 'developer@corp.io', 'alex.mercer@gmail.com'];
    const invalidEmails = ['invalid-email', '@no-local.com', 'spaces in@mail.com'];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    validEmails.forEach((email) => expect(emailRegex.test(email)).toBe(true));
    invalidEmails.forEach((email) => expect(emailRegex.test(email)).toBe(false));
  });
});
