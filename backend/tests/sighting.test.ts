import { describe, it, expect } from 'vitest';
import { createSightingSchema } from '../src/validators/sighting.validator';

describe('Sighting Validation & Privacy Rules', () => {
  it('should pass validation when voluntarilySharedLocation is true', async () => {
    const validData = {
      body: {
        location: {
          type: 'Point',
          coordinates: [85.324, 27.7172],
        },
        locationName: 'Ratna Park',
        condition: 'HEALTHY',
        locationSource: 'CURRENT_LOCATION',
        voluntarilySharedLocation: true,
      },
    };

    const parsed = await createSightingSchema.parseAsync(validData);
    expect(parsed.body.voluntarilySharedLocation).toBe(true);
    expect(parsed.body.location.coordinates).toEqual([85.324, 27.7172]);
  });

  it('should reject sighting when voluntarilySharedLocation is false', async () => {
    const invalidData = {
      body: {
        location: {
          type: 'Point',
          coordinates: [85.324, 27.7172],
        },
        locationSource: 'CURRENT_LOCATION',
        voluntarilySharedLocation: false,
      },
    };

    await expect(createSightingSchema.parseAsync(invalidData)).rejects.toThrow();
  });

  it('should reject coordinates outside valid ranges', async () => {
    const invalidCoords = {
      body: {
        location: {
          type: 'Point',
          coordinates: [200, 95], // Invalid longitude and latitude
        },
        locationSource: 'CURRENT_LOCATION',
        voluntarilySharedLocation: true,
      },
    };

    await expect(createSightingSchema.parseAsync(invalidCoords)).rejects.toThrow();
  });
});
