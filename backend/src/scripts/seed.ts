import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/User';
import { Dog } from '../models/Dog';
import { Sighting } from '../models/Sighting';
import { HealthRecord } from '../models/HealthRecord';
import { Report } from '../models/Report';
import {
  DOG_SEX,
  DOG_SPECIES,
  DOG_STATUS,
  HEALTH_RECORD_TYPE,
  LOCATION_SOURCE,
  REPORT_STATUS,
  REPORT_TYPE,
  ROLES,
  SIGHTING_CONDITION,
  STERILIZATION_STATUS,
  VACCINATION_STATUS,
} from '../config/constants';
import { generatePawId } from '../utils/generatePawId';
import { generateQrToken } from '../utils/generateQrToken';
import { env } from '../config/env';

const seed = async () => {
  console.log('Starting seed process...');

  let mongoServer: MongoMemoryServer | null = null;
  const mongoUri = env.MONGODB_URI || 'mongodb://localhost:27017/pawid';

  try {
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to MongoDB database.');
  } catch (err) {
    console.log('Local MongoDB server not detected. Starting in-memory MongoMemoryServer (v7.0.3)...');
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.3',
      },
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB at ${uri}`);
  }

  // Clean existing collections
  await Promise.all([
    User.deleteMany({}),
    Dog.deleteMany({}),
    Sighting.deleteMany({}),
    HealthRecord.deleteMany({}),
    Report.deleteMany({}),
  ]);

  console.log('Cleared existing database collections.');

  // Create Users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.test',
    passwordHash,
    role: ROLES.ADMIN,
    phone: '+977-9800000001',
    isActive: true,
  });

  const volunteer = await User.create({
    name: 'Volunteer Caregiver',
    email: 'volunteer@example.test',
    passwordHash,
    role: ROLES.VOLUNTEER,
    phone: '+977-9800000002',
    isActive: true,
  });

  console.log('✅ Seeded Users:');
  console.log('   - Admin: admin@example.test (Password123!)');
  console.log('   - Volunteer: volunteer@example.test (Password123!)');

  // Create 5 Sample Dogs
  const sampleDogsData = [
    {
      name: 'Rocky',
      sex: DOG_SEX.MALE,
      approximateAge: 3,
      color: 'Brown and white',
      distinctiveFeatures: 'White patch on left ear',
      status: DOG_STATUS.ACTIVE,
      sterilizationStatus: STERILIZATION_STATUS.STERILIZED,
      vaccinationStatus: VACCINATION_STATUS.VACCINATED,
      registrationLocation: {
        type: 'Point' as const,
        coordinates: [85.324, 27.7172] as [number, number], // Kathmandu
      },
      registrationLocationName: 'Durbar Marg, Kathmandu',
      publicLocationName: 'Durbar Marg',
    },
    {
      name: 'Kali',
      sex: DOG_SEX.FEMALE,
      approximateAge: 2,
      color: 'Black',
      distinctiveFeatures: 'Bushy tail, very friendly',
      status: DOG_STATUS.ACTIVE,
      sterilizationStatus: STERILIZATION_STATUS.STERILIZED,
      vaccinationStatus: VACCINATION_STATUS.VACCINATED,
      registrationLocation: {
        type: 'Point' as const,
        coordinates: [85.3123, 27.7006] as [number, number], // Ratna Park
      },
      registrationLocationName: 'Ratna Park, Kathmandu',
      publicLocationName: 'Ratna Park',
    },
    {
      name: 'Bruno',
      sex: DOG_SEX.MALE,
      approximateAge: 5,
      color: 'Golden tan',
      distinctiveFeatures: 'Limping slightly on back leg',
      status: DOG_STATUS.MISSING,
      sterilizationStatus: STERILIZATION_STATUS.NOT_STERILIZED,
      vaccinationStatus: VACCINATION_STATUS.VACCINATED,
      registrationLocation: {
        type: 'Point' as const,
        coordinates: [85.3188, 27.671] as [number, number], // Patan
      },
      registrationLocationName: 'Patan Durbar Square, Lalitpur',
      publicLocationName: 'Patan Durbar Square',
    },
    {
      name: 'Lucy',
      sex: DOG_SEX.FEMALE,
      approximateAge: 1,
      color: 'White and tan',
      distinctiveFeatures: 'Red collar tag',
      status: DOG_STATUS.ACTIVE,
      sterilizationStatus: STERILIZATION_STATUS.UNKNOWN,
      vaccinationStatus: VACCINATION_STATUS.UNKNOWN,
      registrationLocation: {
        type: 'Point' as const,
        coordinates: [85.342, 27.705] as [number, number], // Baneshwor
      },
      registrationLocationName: 'New Baneshwor, Kathmandu',
      publicLocationName: 'New Baneshwor',
    },
    {
      name: 'Sheru',
      sex: DOG_SEX.MALE,
      approximateAge: 4,
      color: 'Dark brown',
      distinctiveFeatures: 'Scared of loud noises',
      status: DOG_STATUS.ACTIVE,
      sterilizationStatus: STERILIZATION_STATUS.STERILIZED,
      vaccinationStatus: VACCINATION_STATUS.VACCINATED,
      registrationLocation: {
        type: 'Point' as const,
        coordinates: [85.281, 27.712] as [number, number], // Swayambhu
      },
      registrationLocationName: 'Swayambhunath Stupa area',
      publicLocationName: 'Swayambhu',
    },
  ];

  const dogs = [];
  for (const dogData of sampleDogsData) {
    const dog = await Dog.create({
      ...dogData,
      pawId: generatePawId(),
      qrToken: generateQrToken(),
      species: DOG_SPECIES.DOG,
      createdBy: volunteer._id,
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
          publicId: 'sample_dog_photo',
        },
      ],
    });
    dogs.push(dog);
  }

  console.log(`✅ Seeded ${dogs.length} dogs with PawIDs & QR tokens:`);
  dogs.forEach((d) => console.log(`   - ${d.name} (PAWID: ${d.pawId}, QR: ${d.qrToken})`));

  // Create Sample Sightings
  await Sighting.create([
    {
      dogId: dogs[0]._id,
      location: {
        type: 'Point',
        coordinates: [85.3245, 27.7175],
      },
      locationName: 'Near Annapurna Hotel',
      condition: SIGHTING_CONDITION.HEALTHY,
      description: 'Rocky was resting peacefully near the coffee shop.',
      locationSource: LOCATION_SOURCE.CURRENT_LOCATION,
      voluntarilySharedLocation: true,
      submittedByUserId: volunteer._id,
    },
    {
      dogId: dogs[1]._id,
      location: {
        type: 'Point',
        coordinates: [85.3125, 27.701],
      },
      locationName: 'Ratna Park Bus Stop',
      condition: SIGHTING_CONDITION.HEALTHY,
      description: 'Spotted Kali drinking clean water provided by community.',
      locationSource: LOCATION_SOURCE.MAP_SELECTION,
      voluntarilySharedLocation: true,
    },
  ]);

  console.log('✅ Seeded 2 sample community sightings.');

  // Create Sample Health Records
  await HealthRecord.create([
    {
      dogId: dogs[0]._id,
      type: HEALTH_RECORD_TYPE.VACCINATION,
      title: 'Rabies Vaccination 2026',
      description: 'Annual anti-rabies vaccination administered.',
      date: new Date('2026-01-15'),
      veterinarianName: 'Dr. Sharma',
      clinicName: 'Central Animal Clinic',
      verified: true,
      createdBy: admin._id,
    },
    {
      dogId: dogs[0]._id,
      type: HEALTH_RECORD_TYPE.STERILIZATION,
      title: 'ABC Sterilization Program',
      description: 'Ear tipped left ear, successful procedure.',
      date: new Date('2025-08-10'),
      veterinarianName: 'Dr. Adhikari',
      clinicName: 'City Humane Clinic',
      verified: true,
      createdBy: admin._id,
    },
    {
      dogId: dogs[1]._id,
      type: HEALTH_RECORD_TYPE.CHECKUP,
      title: 'Routine Health Checkup',
      description: 'Overall healthy condition and clean fur.',
      date: new Date('2026-02-01'),
      veterinarianName: 'Dr. Thapa',
      clinicName: 'Community Vet Mobile Unit',
      verified: false,
      createdBy: volunteer._id,
    },
  ]);

  console.log('✅ Seeded 3 sample health records.');

  // Create Sample Reports
  await Report.create([
    {
      dogId: dogs[2]._id,
      type: REPORT_TYPE.MISSING,
      description: 'Bruno has not been seen at his usual spot for 3 days.',
      status: REPORT_STATUS.PENDING,
      location: {
        type: 'Point',
        coordinates: [85.3188, 27.671],
      },
    },
  ]);

  console.log('✅ Seeded sample problem reports.');
  console.log('🎉 Seeding completed successfully!');

  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
