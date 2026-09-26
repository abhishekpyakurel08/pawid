import { describe, it, expect } from 'vitest';
import { nearbyDogsQuerySchema } from '../src/validators/public.validator';

describe('Public Nearby Query Validation', () => {
  it('should parse latitude and longitude query parameters correctly', async () => {
    const query = {
      query: {
        lat: '27.7172',
        lng: '85.3240',
        radius: '3000',
      },
    };

    const parsed = await nearbyDogsQuerySchema.parseAsync(query);
    expect(parsed.query.lat).toBe(27.7172);
    expect(parsed.query.lng).toBe(85.324);
    expect(parsed.query.radius).toBe(3000);
  });

  it('should use default 2000m radius if omitted', async () => {
    const query = {
      query: {
        lat: '27.7172',
        lng: '85.3240',
      },
    };

    const parsed = await nearbyDogsQuerySchema.parseAsync(query);
    expect(parsed.query.radius).toBe(2000);
  });
});
