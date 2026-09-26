import { z } from 'zod';
import { LOCATION_SOURCE, SIGHTING_CONDITION } from '../config/constants';

const coordinatesSchema = z.tuple([
  z.number().min(-180, 'Longitude must be between -180 and 180').max(180),
  z.number().min(-90, 'Latitude must be between -90 and 90').max(90),
]);

export const createSightingSchema = z.object({
  body: z.object({
    location: z.object({
      type: z.literal('Point').default('Point'),
      coordinates: coordinatesSchema,
    }),
    locationName: z.string().optional(),
    condition: z.nativeEnum(SIGHTING_CONDITION).optional().default(SIGHTING_CONDITION.UNKNOWN),
    photoUrl: z.string().url().optional(),
    description: z.string().optional(),
    locationSource: z.nativeEnum(LOCATION_SOURCE),
    voluntarilySharedLocation: z.literal(true, {
      errorMap: () => ({
        message: 'voluntarilySharedLocation must be true to record location',
      }),
    }),
  }),
});

export const publicSightingSchema = z.object({
  params: z.object({
    qrToken: z.string().min(1, 'QR Token is required'),
  }),
  body: createSightingSchema.shape.body,
});

export const dogSightingSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Dog ID is required'),
  }),
  body: createSightingSchema.shape.body,
});
