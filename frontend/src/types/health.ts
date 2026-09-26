export type HealthRecordType =
  | 'Vaccination'
  | 'Sterilization'
  | 'Checkup'
  | 'Treatment'
  | 'Injury'
  | 'Other';

export interface HealthRecord {
  id: string;
  dogId: string;
  recordType: HealthRecordType;
  title: string;
  date: string;
  description?: string;
  veterinarian?: string;
  clinic?: string;
  isVerified: boolean;
  verifiedBy?: string;
  createdAt?: string;
}

export interface CreateHealthRecordPayload {
  dogId: string;
  recordType: HealthRecordType;
  title: string;
  date: string;
  description?: string;
  veterinarian?: string;
  clinic?: string;
}
