import { apiRequest } from './api';
import { CreateHealthRecordPayload, HealthRecord } from '../types/health';

export const healthService = {
  async getPublicHealthRecords(qrToken: string): Promise<HealthRecord[]> {
    const res = await apiRequest<{ success: boolean; data: HealthRecord[] }>(
      `/public/dogs/${qrToken}/health`
    );
    return res.data || [];
  },

  async addHealthRecord(payload: CreateHealthRecordPayload): Promise<HealthRecord> {
    const res = await apiRequest<{ success: boolean; data: HealthRecord }>('/health', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async verifyHealthRecord(id: string): Promise<HealthRecord> {
    const res = await apiRequest<{ success: boolean; data: HealthRecord }>(`/health/${id}/verify`, {
      method: 'PATCH',
    });
    return res.data;
  },

  async getHealthRecordsByDogId(dogId: string): Promise<HealthRecord[]> {
    const res = await apiRequest<{ success: boolean; data: HealthRecord[] }>(`/health/dog/${dogId}`);
    return res.data || [];
  }
};
