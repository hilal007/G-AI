import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle,
  AlertOctagon,
  Users,
  Search,
  Shield,
  FileCheck,
  CheckCheck,
  Award,
  Plus,
  Trash2,
  Edit2,
  Save,
  Clock,
} from 'lucide-react';
import { Report8D, ActionItem } from '../types/inspection';

interface Report8DModalProps {
  report: Report8D | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateReport: (updated: Report8D) => void;
}

export const Report8DModal: React.FC<Report8DModalProps> = ({
  report,
  isOpen,
  onClose,
  onUpdateReport,
}) => {
  if (!isOpen || !report) return null;

  const [activeTab, setActiveTab] = useState<string>('all');
  const [editing, setEditing] = useState<boolean>(false);
  const [editedReport, setEditedReport] = useState<Report8D>(report);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.reportId}_CAPA_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveEdits = () => {
    onUpdateReport(editedReport);
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print-card">
        {/* Header HUD (No print hidden) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-100">
                  8D Problem Solving & CAPA Dossier
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-slate-700">
                  {report.reportId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Standard: IATF 16949 / ISO 9001 · Serial: <span className="font-mono">{report.partSerialNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (editing) {
                  handleSaveEdits();
                } else {
                  setEditing(true);
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                editing
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {editing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
              {editing ? 'Save Dossier' : 'Edit Fields'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Print or Save to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / PDF
            </button>
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Export JSON"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Header (visible only during print) */}
        <div className="hidden print-only p-6 border-b border-slate-300">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-slate-900">FORMAL 8D NON-CONFORMANCE REPORT & CAPA</h1>
              <p className="text-sm text-slate-600">Plant Quality Assurance & Engineering Council</p>
            </div>
            <div className="text-right text-sm font-mono">
              <div>Report ID: {report.reportId}</div>
              <div>Date: {report.dateCreated}</div>
              <div>Status: {report.status}</div>
            </div>
          </div>
        </div>

        {/* Discipline Navigation Tabs (No print) */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs overflow-x-auto no-print">
          {[
            { id: 'all', label: 'Complete 8D' },
            { id: 'd1', label: 'D1 Team' },
            { id: 'd2', label: 'D2 Problem' },
            { id: 'd3', label: 'D3 Containment' },
            { id: 'd4', label: 'D4 Root Cause' },
            { id: 'd5', label: 'D5 Actions' },
            { id: 'd6', label: 'D6 Validate' },
            { id: 'd7', label: 'D7 Prevent' },
            { id: 'd8', label: 'D8 Close' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dossier Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-xs">
          {/* D1: Team Formation */}
          {(activeTab === 'all' || activeTab === 'd1') && (
            <section className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">D1: Cross-Functional Problem Solving Team</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.d1Team.map((member, i) => (
                  <div key={i} className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg">
                    <div className="text-[11px] font-semibold text-cyan-400">{member.role}</div>
                    <div className="text-xs font-bold text-slate-100 mt-0.5">{member.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{member.department}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* D2: Problem Description */}
          {(activeTab === 'all' || activeTab === 'd2') && (
            <section className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-slate-100">D2: Problem Description (5W2H Standard)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">What</span>
                  <p className="text-xs font-medium text-slate-200 mt-1">{report.d2Problem.what}</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Where</span>
                  <p className="text-xs font-medium text-slate-200 mt-1">{report.d2Problem.where}</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">When</span>
                  <p className="text-xs font-medium text-slate-200 mt-1">{report.d2Problem.when}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Comprehensive QA Defect Narrative</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {report.d2Problem.defectDescription}
                </p>
              </div>
            </section>
          )}

          {/* D3: Containment Actions */}
          {(activeTab === 'all' || activeTab === 'd3') && (
            <section className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-100">D3: Interim Containment Actions (ICA)</h3>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Quarantine Lot: {report.d3Containment.quarantineLotNumber}
                </span>
              </div>
              <div className="space-y-2">
                {report.d3Containment.actions.map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-900 border border-slate-800/80 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">{act}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* D4: Root Cause Analysis (Ishikawa & 5-Why) */}
          {(activeTab === 'all' || activeTab === 'd4') && (
            <section className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">D4: Root Cause Analysis (5-Why & Ishikawa)</h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Ishikawa Category: {report.d4RootCause.fishboneCategory}
                </span>
              </div>

              {/* 5-Why Progression Tree */}
              <div className="space-y-2 p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  5-Why Causal Logic Chain
                </span>
                {report.d4RootCause.fiveWhys.map((why, i) => (
                  <div key={i} className="flex items-start gap-2 pl-2 border-l-2 border-cyan-500/40 py-1">
                    <span className="font-mono text-cyan-400 text-xs font-bold shrink-0">W{i + 1}:</span>
                    <span className="text-xs text-slate-300">{why}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Point of Escape (Why was it not detected sooner?)</span>
                <p className="text-xs mt-1">{report.d4RootCause.escapePoint}</p>
              </div>
            </section>
          )}

          {/* D5: Permanent Corrective Actions (PCA) */}
          {(activeTab === 'all' || activeTab === 'd5') && (
            <section className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100">D5: Permanent Corrective Actions (PCA)</h3>
                </div>
              </div>
              <div className="space-y-2.5">
                {report.d5PermanentActions.map((pca, i) => (
                  <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{pca.id}</span>
                      <span className="text-[11px] font-mono text-slate-400">Target: {pca.targetDate}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 mt-1">{pca.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span>Owner: <strong className="text-slate-300">{pca.owner}</strong></span>
                      <span>Metric: <strong className="text-emerald-400">{pca.verificationMetric}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* D6: Validation & Verification */}
          {(activeTab === 'all' || activeTab === 'd6') && (
            <section className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">D6: Implement & Validate PCA</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Trial Batch Results</span>
                  <p className="text-xs font-medium text-slate-200 mt-1">{report.d6Validation.trialRunResults}</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Process Capability (Cpk)</span>
                  <p className="text-xs font-bold text-emerald-400 mt-1">{report.d6Validation.cpkImprovement}</p>
                </div>
              </div>
            </section>
          )}

          {/* D7: Prevent Recurrence */}
          {(activeTab === 'all' || activeTab === 'd7') && (
            <section className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">D7: Prevent Recurrence (Poka-Yoke & FMEA)</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Error-Proofing / Poka-Yoke Device</span>
                  <p className="text-xs font-medium text-slate-200 mt-1">{report.d7Prevention.pokaYokeImplemented}</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Systemic Management Revisions</span>
                  <p className="text-xs text-slate-300 mt-1">{report.d7Prevention.systemicFixes}</p>
                </div>
              </div>
            </section>
          )}

          {/* D8: Team Recognition & Sign-Off */}
          {(activeTab === 'all' || activeTab === 'd8') && (
            <section className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">D8: Congratulate Team & Formal Sign-Off</h3>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg mb-3">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Key Contributors Recognized</span>
                <p className="text-xs font-semibold text-slate-100 mt-1">{report.d8Recognition.leadContributor}</p>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Executive QA Closure Notes</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{report.d8Recognition.closureNotes}</p>
              </div>

              {/* Sign-off Stamps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-center font-mono text-[11px]">
                <div className="p-2 border border-slate-800 rounded bg-slate-900/50">
                  <div className="text-slate-500">Plant Quality Manager</div>
                  <div className="text-emerald-400 font-bold mt-1">APPROVED · SIGNED</div>
                </div>
                <div className="p-2 border border-slate-800 rounded bg-slate-900/50">
                  <div className="text-slate-500">Process Engineering Lead</div>
                  <div className="text-emerald-400 font-bold mt-1">APPROVED · SIGNED</div>
                </div>
                <div className="p-2 border border-slate-800 rounded bg-slate-900/50">
                  <div className="text-slate-500">IATF Compliance Auditor</div>
                  <div className="text-emerald-400 font-bold mt-1">VERIFIED CONFORMING</div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
