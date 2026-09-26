import { z } from 'zod';
import { REPORT_STATUS, REPORT_TYPE } from '../config/constants';

const coordinatesSchema = z.tuple([
  z.number().min(-180, 'Longitude must be between -180 and 180').max(180),
  z.number().min(-90, 'Latitude must be between -90 and 90').max(90),
]);

export const createReportSchema = z.object({
  params: z.object({
    qrToken: z.string().optional(),
  }),
  body: z.object({
    dogId: z.string().optional(),
    type: z.nativeEnum(REPORT_TYPE),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    photoUrl: z.string().url().optional(),
    location: z
      .object({
        type: z.literal('Point').default('Point'),
        coordinates: coordinatesSchema,
      })
      .optional(),
  }),
});

export const updateReportStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Report ID is required'),
  }),
  body: z.object({
    status: z.nativeEnum(REPORT_STATUS),
  }),
});
