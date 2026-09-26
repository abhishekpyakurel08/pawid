import { z } from 'zod';

export const nearbyDogsQuerySchema = z.object({
  query: z.object({
    lat: z.string().transform((val) => parseFloat(val)),
    lng: z.string().transform((val) => parseFloat(val)),
    radius: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : 2000)), // default 2000m (2km)
  }),
});
