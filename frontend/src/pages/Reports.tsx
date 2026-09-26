import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '../services/report.service';
import { ProblemReport, ReportStatus } from '../types/report';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate } from '../lib/utils';

export function Reports() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ReportStatus>('PENDING');

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['adminReports', activeTab],
    queryFn: () => reportService.getAllReports(activeTab),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReportStatus }) =>
      reportService.updateReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
    },
  });

  const handleUpdateStatus = (id: string, status: ReportStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const tabs: { label: string; value: ReportStatus }[] = [
    { label: 'Pending Triage', value: 'PENDING' },
    { label: 'Under Review', value: 'REVIEWING' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
            Problem Report Triage
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review community incident alerts, missing dog notifications, and injury reports.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.value
                ? 'bg-forest-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {isLoading ? (
        <LoadingState message="Fetching problem reports..." />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={<CheckCircle className="w-8 h-8 text-emerald-600" />}
          title={`No ${activeTab.toLowerCase()} reports`}
          description="There are currently no reports filed under this category."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report: ProblemReport) => (
            <Card key={report.id} className="p-6 bg-white border border-forest-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={report.status === 'PENDING' ? 'danger' : 'neutral'}>
                    {report.problemType}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-forest-900">
                    ID: {report.id}
                  </span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Reported on {formatDate(report.createdAt)}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-charcoal font-medium">
                  {report.description}
                </p>
                {report.locationName && (
                  <p className="text-xs text-slate-500">
                    Location: <strong>{report.locationName}</strong>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {report.status !== 'REVIEWING' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(report.id, 'REVIEWING')}
                  >
                    Mark Reviewing
                  </Button>
                )}
                {report.status !== 'RESOLVED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                    className="bg-emerald-700 hover:bg-emerald-800"
                  >
                    Mark Resolved
                  </Button>
                )}
                {report.status !== 'REJECTED' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(report.id, 'REJECTED')}
                    className="text-rose-600 hover:bg-rose-50"
                  >
                    Reject
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
