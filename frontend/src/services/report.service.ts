import { apiRequest } from './api';
import { CreateReportPayload, ProblemReport, ReportStatus } from '../types/report';

export const reportService = {
  async submitReportByQr(qrToken: string, payload: CreateReportPayload): Promise<ProblemReport> {
    const res = await apiRequest<{ success: boolean; data: ProblemReport }>(
      `/public/dogs/${qrToken}/reports`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return res.data;
  },

  async submitGeneralReport(payload: CreateReportPayload): Promise<ProblemReport> {
    const res = await apiRequest<{ success: boolean; data: ProblemReport }>('/public/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async getAllReports(status?: ReportStatus): Promise<ProblemReport[]> {
    const queryString = status ? `?status=${status}` : '';
    const res = await apiRequest<{ success: boolean; data: ProblemReport[] }>(
      `/reports${queryString}`
    );
    return res.data || [];
  },

  async updateReportStatus(id: string, status: ReportStatus): Promise<ProblemReport> {
    const res = await apiRequest<{ success: boolean; data: ProblemReport }>(
      `/reports/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
    return res.data;
  },
};
