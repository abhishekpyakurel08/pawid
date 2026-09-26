import { describe, it, expect, vi } from 'vitest';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../src/utils/jwt';
import { generatePawId } from '../src/utils/generatePawId';
import { generateQrToken } from '../src/utils/generateQrToken';
import { ROLES } from '../src/config/constants';

describe('Auth & Token Business Logic', () => {
  it('should generate and verify access tokens containing only sub and role', () => {
    const userId = '507f1f77bcf86cd799439011';
    const role = ROLES.VOLUNTEER;

    const token = generateAccessToken(userId, role);
    expect(token).toBeDefined();

    const decoded = verifyAccessToken(token);
    expect(decoded.sub).toBe(userId);
    expect(decoded.role).toBe(role);
    expect((decoded as any).password).toBeUndefined();
    expect((decoded as any).email).toBeUndefined();
  });

  it('should generate unique, unpredictable, human-readable PawIDs', () => {
    const pawId1 = generatePawId('NP');
    const pawId2 = generatePawId('NP');

    expect(pawId1).toMatch(/^PAW-NP-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
    expect(pawId2).toMatch(/^PAW-NP-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
    expect(pawId1).not.toBe(pawId2);
  });

  it('should generate cryptographically random QR tokens separate from PawID', () => {
    const qrToken1 = generateQrToken();
    const qrToken2 = generateQrToken();

    expect(qrToken1).toHaveLength(48); // 24 bytes hex
    expect(qrToken2).toHaveLength(48);
    expect(qrToken1).not.toBe(qrToken2);
  });
});
