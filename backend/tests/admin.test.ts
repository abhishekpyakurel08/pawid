import { describe, it, expect } from 'vitest';
import { updateReportStatusSchema } from '../src/validators/report.validator';

describe('Admin Report Moderation Rules', () => {
  it('should validate valid report status transitions', async () => {
    const input = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { status: 'RESOLVED' },
    };

    const parsed = await updateReportStatusSchema.parseAsync(input);
    expect(parsed.body.status).toBe('RESOLVED');
  });

  it('should reject invalid report status values', async () => {
    const input = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { status: 'INVALID_STATUS' },
    };

    await expect(updateReportStatusSchema.parseAsync(input as any)).rejects.toThrow();
  });
});
