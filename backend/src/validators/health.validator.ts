import { z } from 'zod';
import { HEALTH_RECORD_TYPE } from '../config/constants';

export const createHealthRecordSchema = z.object({
  body: z.object({
    dogId: z.string().min(1, 'Dog ID is required'),
    type: z.nativeEnum(HEALTH_RECORD_TYPE),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    veterinarianName: z.string().optional(),
    clinicName: z.string().optional(),
  }),
});

export const updateHealthRecordSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Health record ID is required'),
  }),
  body: z.object({
    type: z.nativeEnum(HEALTH_RECORD_TYPE).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    veterinarianName: z.string().optional(),
    clinicName: z.string().optional(),
    verified: z.boolean().optional(),
  }),
});
