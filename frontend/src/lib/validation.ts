import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const sightingSchema = z.object({
  longitude: z.number({ required_error: 'Please select a location on the map or use current location' }),
  latitude: z.number({ required_error: 'Please select a location on the map or use current location' }),
  areaName: z.string().optional(),
  condition: z.enum(['Healthy', 'Injured', 'Sick', 'Unknown']),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
  consentAgreed: z.boolean().refine((val) => val === true, {
    message: 'You must agree that you are voluntarily sharing this location',
  }),
});

export const reportProblemSchema = z.object({
  problemType: z.enum([
    'Injured',
    'Sick',
    'Missing',
    'Deceased',
    'Abuse',
    'WrongInfo',
    'Other',
  ]),
  description: z.string().min(10, 'Please provide a description of at least 10 characters'),
  photoUrl: z.string().optional(),
  locationName: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
});

export const dogRegistrationSchema = z.object({
  name: z.string().optional(),
  sex: z.enum(['Male', 'Female', 'Unknown']),
  approximateAge: z.string().optional(),
  color: z.string().optional(),
  distinctiveFeatures: z.string().optional(),
  area: z.string().min(2, 'Area is required (e.g. Kathmandu, Thamel)'),
  status: z.enum(['Active', 'Deactivated', 'Missing', 'Deceased']).default('Active'),
  vaccinationStatus: z.enum(['Vaccinated', 'Unvaccinated', 'Unknown']).default('Unknown'),
  sterilizationStatus: z.enum(['Sterilized', 'Unsterilized', 'Unknown']).default('Unknown'),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
});

export const healthRecordSchema = z.object({
  dogId: z.string().min(1, 'Dog is required'),
  recordType: z.enum(['Vaccination', 'Sterilization', 'Checkup', 'Treatment', 'Injury', 'Other']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  veterinarian: z.string().optional(),
  clinic: z.string().optional(),
});

export const volunteerApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  area: z.string().min(2, 'Area/City is required'),
  roleInterest: z.string().min(1, 'Please select a volunteer role'),
  experience: z.string().optional(),
});
