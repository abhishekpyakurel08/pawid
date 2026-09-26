import { describe, it, expect } from 'vitest';
import { createDogSchema, queryDogSchema } from '../src/validators/dog.validator';

describe('Dog Validation', () => {
  it('should validate valid dog registration input', async () => {
    const input = {
      body: {
        name: 'Rocky',
        sex: 'MALE',
        approximateAge: 3,
        color: 'Brown',
        registrationLocation: {
          type: 'Point',
          coordinates: [85.324, 27.7172],
        },
        publicLocationName: 'Kathmandu Central',
      },
    };

    const parsed = await createDogSchema.parseAsync(input);
    expect(parsed.body.name).toBe('Rocky');
    expect(parsed.body.sex).toBe('MALE');
  });

  it('should reject invalid coordinates format', async () => {
    const invalidInput = {
      body: {
        name: 'Rocky',
        registrationLocation: {
          type: 'Point',
          coordinates: ['invalid', 'coords'],
        },
      },
    };

    await expect(createDogSchema.parseAsync(invalidInput as any)).rejects.toThrow();
  });
});
