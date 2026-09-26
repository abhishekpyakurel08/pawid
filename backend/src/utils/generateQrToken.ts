import crypto from 'crypto';

/**
 * Generates a cryptographically secure random QR token.
 */
export const generateQrToken = (): string => {
  return crypto.randomBytes(24).toString('hex');
};
