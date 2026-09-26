import { z } from 'zod';
import {
  DOG_SEX,
  DOG_STATUS,
  STERILIZATION_STATUS,
  VACCINATION_STATUS,
} from '../config/constants';

const coordinatesSchema = z
  .tuple([
    z.number().min(-180, 'Longitude must be between -180 and 180').max(180),
    z.number().min(-90, 'Latitude must be between -90 and 90').max(90),
  ])
  .describe('[longitude, latitude]');

export const createDogSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    sex: z.nativeEnum(DOG_SEX).optional().default(DOG_SEX.UNKNOWN),
    approximateAge: z.number().min(0).max(30).optional(),
    color: z.string().optional(),
    distinctiveFeatures: z.string().optional(),
    photos: z
      .array(
        z.object({
          url: z.string().url(),
          publicId: z.string().optional(),
        })
      )
      .optional()
      .default([]),
    status: z.nativeEnum(DOG_STATUS).optional().default(DOG_STATUS.ACTIVE),
    sterilizationStatus: z
      .nativeEnum(STERILIZATION_STATUS)
      .optional()
      .default(STERILIZATION_STATUS.UNKNOWN),
    vaccinationStatus: z
      .nativeEnum(VACCINATION_STATUS)
      .optional()
      .default(VACCINATION_STATUS.UNKNOWN),
    registrationLocation: z.object({
      type: z.literal('Point').default('Point'),
      coordinates: coordinatesSchema,
    }),
    registrationLocationName: z.string().optional(),
    publicLocationName: z.string().optional(),
  }),
});

export const updateDogSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Dog ID is required'),
  }),
  body: z.object({
    name: z.string().optional(),
    sex: z.nativeEnum(DOG_SEX).optional(),
    approximateAge: z.number().min(0).max(30).optional(),
    color: z.string().optional(),
    distinctiveFeatures: z.string().optional(),
    photos: z
      .array(
        z.object({
          url: z.string().url(),
          publicId: z.string().optional(),
        })
      )
      .optional(),
    status: z.nativeEnum(DOG_STATUS).optional(),
    sterilizationStatus: z.nativeEnum(STERILIZATION_STATUS).optional(),
    vaccinationStatus: z.nativeEnum(VACCINATION_STATUS).optional(),
    registrationLocation: z
      .object({
        type: z.literal('Point').default('Point'),
        coordinates: coordinatesSchema,
      })
      .optional(),
    registrationLocationName: z.string().optional(),
    publicLocationName: z.string().optional(),
  }),
});

export const queryDogSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.nativeEnum(DOG_STATUS).optional(),
    sex: z.nativeEnum(DOG_SEX).optional(),
    vaccinationStatus: z.nativeEnum(VACCINATION_STATUS).optional(),
    sterilizationStatus: z.nativeEnum(STERILIZATION_STATUS).optional(),
    q: z.string().optional(),
  }),
});
