import { Link } from 'react-router-dom';
import { useDogStats } from '../hooks/useDog';
import { useAllSightings } from '../hooks/useSightings';
import { StatsCard } from '../components/common/StatsCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { QrCode, Eye, AlertTriangle, ShieldCheck, Plus, FileText, Activity, ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Badge } from '../components/ui/Badge';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDogStats();
  const { data: sightings = [] } = useAllSightings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
            Admin & Volunteer Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of registered community animals, health logs, and pending reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/dogs/new">
            <Button variant="primary" size="md" className="gap-2 font-bold shadow-sm">
              <Plus className="w-4 h-4" />
              Register New Dog
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatsCard
          label="Total Dogs"
          value={stats?.totalDogs}
          icon={<QrCode className="w-5 h-5" />}
        />
        <StatsCard
          label="Active Dogs"
          value={stats?.activeDogs}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          label="Sightings"
          value={stats?.totalSightings}
          icon={<Eye className="w-5 h-5 text-amber-golden" />}
        />
        <StatsCard
          label="Pending Reports"
          value={stats?.pendingReports}
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
        />
        <StatsCard
          label="Vaccinated"
          value={stats?.vaccinated}
          icon={<Activity className="w-5 h-5 text-teal-600" />}
        />
        <StatsCard
          label="Sterilized"
          value={stats?.sterilized}
          icon={<FileText className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      {/* Admin Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/dashboard/dogs">
          <Card className="p-5 hover:border-forest-300 transition-all cursor-pointer flex items-center justify-between bg-white">
            <div>
              <h4 className="font-extrabold text-forest-900 text-sm">Manage Dogs</h4>
              <p className="text-[11px] text-slate-500">Edit profiles & QR tags</p>
            </div>
            <QrCode className="w-6 h-6 text-forest-800" />
          </Card>
        </Link>

        <Link to="/dashboard/reports">
          <Card className="p-5 hover:border-forest-300 transition-all cursor-pointer flex items-center justify-between bg-white">
            <div>
              <h4 className="font-extrabold text-forest-900 text-sm">Review Reports</h4>
              <p className="text-[11px] text-slate-500">Triage problem alerts</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </Card>
        </Link>

        <Link to="/dashboard/sightings">
          <Card className="p-5 hover:border-forest-300 transition-all cursor-pointer flex items-center justify-between bg-white">
            <div>
              <h4 className="font-extrabold text-forest-900 text-sm">Moderate Sightings</h4>
              <p className="text-[11px] text-slate-500">Verify public locations</p>
            </div>
            <Eye className="w-6 h-6 text-amber-golden" />
          </Card>
        </Link>

        <Link to="/dashboard/health-records">
          <Card className="p-5 hover:border-forest-300 transition-all cursor-pointer flex items-center justify-between bg-white">
            <div>
              <h4 className="font-extrabold text-forest-900 text-sm">Health Records</h4>
              <p className="text-[11px] text-slate-500">Log rabies & surgeries</p>
            </div>
            <Activity className="w-6 h-6 text-teal-600" />
          </Card>
        </Link>
      </div>

      {/* Recent Activity Table */}
      <Card className="p-6 bg-white border border-forest-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-forest-900">
            Recent Community Sightings Activity
          </h3>
          <Link to="/dashboard/sightings" className="text-xs font-bold text-forest-900 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {sightings.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No recent community sightings to display.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Location Area</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sightings.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium">{formatDate(item.reportedAt)}</td>
                    <td className="py-2.5 px-3 font-bold text-forest-900">
                      {item.location.areaName || 'Community Location'}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant={item.condition === 'Healthy' ? 'success' : 'warning'}>
                        {item.condition}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px]">{item.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
