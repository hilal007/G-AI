import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { LineMetrics, InspectionResult } from '../types/inspection';
import { SectorDef } from '../data/manufacturingSectors';

interface SpcAnalyticsViewProps {
  metrics: LineMetrics;
  history: InspectionResult[];
  currentSector: SectorDef;
}

export const SpcAnalyticsView: React.FC<SpcAnalyticsViewProps> = ({
  metrics,
  history,
  currentSector,
}) => {
  // Compute defect Pareto distribution
  const defectCounts: Record<string, number> = {};
  history.forEach(item => {
    item.defects.forEach(d => {
      defectCounts[d.label] = (defectCounts[d.label] || 0) + 1;
    });
  });

  const sortedDefects = Object.entries(defectCounts).sort((a, b) => b[1] - a[1]);
  const totalDefects = sortedDefects.reduce((acc, curr) => acc + curr[1], 0);

  return (
    <div className="space-y-6">
      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            First-Pass Yield (FPY)
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {metrics.firstPassYield.toFixed(2)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Target benchmark: $\ge 98.0\%$</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Process Capability Index (Cpk)
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            1.54
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Six Sigma Capable ($Cpk \gt 1.33$)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            PPM Defect Density
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {Math.round(metrics.ppmRate).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Defects per million opportunities</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Optical Vision Precision
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
            96.8%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sub-pixel edge caliper confidence</p>
        </div>
      </div>

      {/* Pareto Analysis & Root Cause Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pareto Defect Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Pareto Defect Distribution (80/20 Rule)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Frequency rank of non-conformance types across line batches.
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="flex-1 space-y-3.5">
            {sortedDefects.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No defect records logged yet.</p>
            ) : (
              sortedDefects.map(([label, count], idx) => {
                const percentage = totalDefects > 0 ? (count / totalDefects) * 100 : 0;
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {idx + 1}. {label}
                      </span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {count} incidents ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Statistical Process Control & Tolerance Envelope */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">SPC Control Limits & Tolerance Envelope</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upper Control Limit (UCL) and Lower Control Limit (LCL) standard deviation limits.
              </p>
            </div>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2.5">
            <div className="flex justify-between items-center text-rose-400">
              <span>UCL (+3σ Limit):</span>
              <span className="font-bold">+0.045 mm</span>
            </div>
            <div className="w-full h-[1px] bg-rose-500/30" />

            <div className="flex justify-between items-center text-slate-400">
              <span>Nominal Target Specification:</span>
              <span className="font-bold text-slate-200">0.000 mm ({currentSector.nominalToleranceMm})</span>
            </div>
            <div className="w-full h-[1px] bg-cyan-500/50" />

            <div className="flex justify-between items-center text-rose-400">
              <span>LCL (-3σ Limit):</span>
              <span className="font-bold">-0.045 mm</span>
            </div>
            <div className="w-full h-[1px] bg-rose-500/30" />
          </div>

          <div className="mt-4 text-xs text-slate-400 leading-relaxed space-y-2">
            <p>
              • <strong>Automated Line Interlock:</strong> If 3 consecutive critical defects are flagged, the vision agent triggers an emergency conveyor halt and alerts the Shift Supervisor.
            </p>
            <p>
              • <strong>Audit Standard:</strong> Enforced under <strong>{currentSector.inspectionStandard}</strong> with automated ISO-traceable batch serialization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
