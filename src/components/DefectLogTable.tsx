import React, { useState } from 'react';
import { Search, Download, ExternalLink, Filter, AlertOctagon, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { InspectionResult } from '../types/inspection';

interface DefectLogTableProps {
  history: InspectionResult[];
  onSelectResult: (result: InspectionResult) => void;
  onOpen8DForResult: (result: InspectionResult) => void;
}

export const DefectLogTable: React.FC<DefectLogTableProps> = ({
  history,
  onSelectResult,
  onOpen8DForResult,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'REJECT' | 'REWORK'>('ALL');

  const filteredHistory = history.filter(item => {
    const matchesStatus = statusFilter === 'ALL' || item.conformance === statusFilter;
    const matchesSearch =
      item.partSerialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.defects.some(d => d.label.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Serial Number', 'Part Name', 'Sector', 'Conformance', 'Confidence', 'Defects'];
    const rows = history.map(item => [
      `"${item.timestamp}"`,
      `"${item.partSerialNumber}"`,
      `"${item.partName}"`,
      `"${item.sector}"`,
      `"${item.conformance}"`,
      `"${(item.overallConfidence * 100).toFixed(1)}%"`,
      `"${item.defects.map(d => `${d.label} (${d.severity})`).join('; ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Plant_Defect_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header and Controls */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100">Quality Inspection Audit Log</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical trace of optical inspections, defect classifications, and lot records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status filter buttons */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            {(['ALL', 'REJECT', 'REWORK', 'PASS'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search serial or defect..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-medium font-mono text-[11px]">
              <th className="py-3 px-4">TIMESTAMP</th>
              <th className="py-3 px-4">SERIAL NUMBER</th>
              <th className="py-3 px-4">PART NAME</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4">FLAGGED DEFECTS</th>
              <th className="py-3 px-4 text-right">CONFIDENCE</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No inspection logs match current filter criteria.
                </td>
              </tr>
            ) : (
              filteredHistory.map(item => {
                const isPass = item.conformance === 'PASS';
                const isReject = item.conformance === 'REJECT';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectResult(item)}
                  >
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200 whitespace-nowrap">
                      {item.partSerialNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {item.partName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold ${
                          isPass
                            ? 'text-emerald-400'
                            : isReject
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {isPass ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isReject ? (
                          <AlertOctagon className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        {item.conformance}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {item.defects.length === 0 ? (
                        <span className="text-slate-500 font-mono">None (Conforming)</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {item.defects.map(d => (
                            <span
                              key={d.id}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {d.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-300">
                      {(item.overallConfidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {item.defects.length > 0 && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onOpen8DForResult(item);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded border border-rose-800/80 transition-colors flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            8D Dossier
                          </button>
                        )}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectResult(item);
                          }}
                          className="px-2 py-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          View Frame
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
