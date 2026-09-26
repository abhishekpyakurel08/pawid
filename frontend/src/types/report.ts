export type ProblemType =
  | 'Injured'
  | 'Sick'
  | 'Missing'
  | 'Deceased'
  | 'Abuse'
  | 'WrongInfo'
  | 'Other';

export type ReportStatus = 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'REJECTED';

export interface ProblemReport {
  id: string;
  qrToken?: string;
  dogId?: string | { id: string; pawId: string; name?: string };
  problemType: ProblemType;
  description: string;
  photoUrl?: string;
  locationName?: string;
  longitude?: number;
  latitude?: number;
  status: ReportStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReportPayload {
  problemType: ProblemType;
  description: string;
  photoUrl?: string;
  locationName?: string;
  longitude?: number;
  latitude?: number;
}
