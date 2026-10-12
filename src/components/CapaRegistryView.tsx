import React, { useState } from 'react';
import { ShieldAlert, FileText, CheckCircle2, Clock, User, ArrowRight, Plus, Download } from 'lucide-react';
import { Report8D } from '../types/inspection';

interface CapaRegistryViewProps {
  reports: Report8D[];
  onOpenReport: (report: Report8D) => void;
  onCreateNew8D: () => void;
}

export const CapaRegistryView: React.FC<CapaRegistryViewProps> = ({
  reports,
  onOpenReport,
  onCreateNew8D,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'CLOSED' | 'DRAFT'>('ALL');

  const filteredReports = reports.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  // Calculate high-level CAPA action metrics
  const totalActions = reports.reduce((acc, r) => acc + (r.d5PermanentActions?.length || 0), 0);
  const openReportsCount = reports.filter(r => r.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active 8D Dossiers Under Containment
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {openReportsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Interim lot quarantines active</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Permanent Corrective Actions (PCA)
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            {totalActions}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Assigned across plant engineering teams</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quality Audit Compliance (IATF 16949)
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            100%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Full 5-Why root cause traceability</p>
        </div>
      </div>

      {/* Main Registry Dossier List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100">8D Problem Solving & CAPA Repository</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Formal non-conformance dossiers, containment logs, and systemic poka-yoke tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              {(['ALL', 'ACTIVE', 'CLOSED'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    filter === s
                      ? 'bg-slate-800 text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={onCreateNew8D}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Initiate Manual 8D
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredReports.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No 8D dossiers recorded in current category. Trigger defect inspection to generate an automated report.
            </div>
          ) : (
            filteredReports.map(report => (
              <div
                key={report.reportId}
                onClick={() => onOpenReport(report)}
                className="p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/60">
                      {report.reportId}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        report.status === 'ACTIVE'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {report.dateCreated}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {report.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>Part: <strong className="text-slate-300">{report.partName}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">SN: {report.partSerialNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>Ishikawa: <strong className="text-slate-300">{report.d4RootCause.fishboneCategory}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Containment Lot: <strong className="text-amber-400 font-mono">{report.d3Containment.quarantineLotNumber}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden md:block">
                    <div className="text-[11px] text-slate-400">PCA Corrective Actions</div>
                    <div className="font-mono text-xs font-bold text-slate-200">
                      {report.d5PermanentActions?.length || 0} Actions Logged
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-700 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
