import { describe, it, expect } from 'vitest';
import { createHealthRecordSchema, updateHealthRecordSchema } from '../src/validators/health.validator';

describe('Health Record Validation & Verification Rules', () => {
  it('should validate health record creation schema', async () => {
    const input = {
      body: {
        dogId: '507f1f77bcf86cd799439011',
        type: 'VACCINATION',
        title: 'Rabies Vaccine 2026',
        description: 'Annual anti-rabies vaccination',
        veterinarianName: 'Dr. Sharma',
        clinicName: 'Animal Care Clinic',
      },
    };

    const parsed = await createHealthRecordSchema.parseAsync(input);
    expect(parsed.body.title).toBe('Rabies Vaccine 2026');
    expect(parsed.body.type).toBe('VACCINATION');
  });

  it('should validate health record update schema', async () => {
    const updateInput = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: {
        verified: true,
      },
    };

    const parsed = await updateHealthRecordSchema.parseAsync(updateInput);
    expect(parsed.body.verified).toBe(true);
  });
});
