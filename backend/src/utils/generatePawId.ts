import crypto from 'crypto';

/**
 * Generates an unpredictable, human-readable PawID.
 * Format: PAW-NP-XXXXXX where X is uppercase alphanumeric (avoiding ambiguous chars like O, 0, I, 1).
 * Example: PAW-NP-A8F42K
 */
export const generatePawId = (countryCode: string = 'NP'): string => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const length = 6;
  const bytes = crypto.randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % chars.length;
    result += chars[randomIndex];
  }

  return `PAW-${countryCode.toUpperCase()}-${result}`;
};
