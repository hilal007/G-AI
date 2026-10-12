import React from 'react';
import { AlertOctagon, CheckCircle2, AlertTriangle, FileText, ShieldAlert, Sparkles, Crosshair, ArrowRight, Layers } from 'lucide-react';
import { DefectItem, InspectionResult } from '../types/inspection';

interface DefectDetailsPanelProps {
  result: InspectionResult | null;
  selectedDefect: DefectItem | null;
  onSelectDefect: (defect: DefectItem | null) => void;
  onOpen8DModal: (defect: DefectItem) => void;
  isGenerating8D: boolean;
}

export const DefectDetailsPanel: React.FC<DefectDetailsPanelProps> = ({
  result,
  selectedDefect,
  onSelectDefect,
  onOpen8DModal,
  isGenerating8D,
}) => {
  if (!result) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[460px]">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-4">
          <Crosshair className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">Awaiting Optical Inspection</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
          Trigger an inspection frame from the conveyor stream or upload a macro component photo to detect quality issues and pinpoint defects.
        </p>
      </div>
    );
  }

  const isPass = result.conformance === 'PASS';
  const isReject = result.conformance === 'REJECT';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Top Conformance Verdict Banner */}
      <div
        className={`p-4 border-b flex items-start justify-between gap-4 ${
          isPass
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : isReject
            ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
            : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isPass
                ? 'bg-emerald-500/20 text-emerald-400'
                : isReject
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isPass ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isReject ? (
              <AlertOctagon className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                {result.conformance === 'PASS'
                  ? 'CONFORMANCE VERIFIED'
                  : result.conformance === 'REJECT'
                  ? 'NON-CONFORMANCE / HOLD'
                  : 'REWORK REQUIRED'}
              </span>
            </div>
            <p className="text-xs font-medium mt-0.5 text-slate-300">
              {result.partName} · <span className="font-mono text-slate-400">{result.partSerialNumber}</span>
            </p>
          </div>
        </div>

        {/* Confidence metric */}
        <div className="text-right shrink-0">
          <div className="text-[11px] text-slate-400">Confidence</div>
          <div className="font-mono text-sm font-bold text-slate-100">
            {Math.round(result.overallConfidence * 100)}%
          </div>
        </div>
      </div>

      {/* Inspection Summary Notes */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Vision Agent Assessment</span>
          <span className="font-mono text-slate-500 text-[10px]">{result.timestamp}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {result.inspectionNotes}
        </p>
      </div>

      {/* Defect List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Flagged Anomalies ({result.defects.length})
          </span>
          <span className="text-[11px]">Select to inspect</span>
        </div>

        {result.defects.length === 0 ? (
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-emerald-300">Zero Critical Anomalies Detected</p>
            <p className="text-[11px] text-slate-400 mt-1">Part satisfies dimensional and surface tolerance criteria.</p>
          </div>
        ) : (
          result.defects.map(defect => {
            const isSelected = selectedDefect?.id === defect.id;
            const severityColor =
              defect.severity === 'CRITICAL'
                ? 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                : defect.severity === 'MAJOR'
                ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                : 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300';

            return (
              <div
                key={defect.id}
                onClick={() => onSelectDefect(defect)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-800/90 shadow-lg'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${severityColor}`}
                    >
                      {defect.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{defect.label}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-400">
                    {Math.round(defect.confidence * 100)}%
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mt-2 space-y-1">
                  {defect.dimensionsEstimate && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Dimensions:</span>
                      <span className="text-slate-300 font-mono">{defect.dimensionsEstimate}</span>
                    </div>
                  )}
                  {defect.rootCauseHypothesis && (
                    <div className="text-slate-300">
                      <span className="text-slate-500">Root Cause Hypothesis: </span>
                      {defect.rootCauseHypothesis}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    Calibrated Box: [{defect.box.join(', ')}]
                  </div>
                </div>

                {/* Generate 8D Button directly from defect card */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">ISO 9001 / IATF Standard</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onOpen8DModal(defect);
                    }}
                    disabled={isGenerating8D}
                    className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-md shadow flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {isGenerating8D ? 'Synthesizing...' : 'Generate 8D Report'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Global 8D / CAPA Call to Action at Bottom */}
      {result.defects.length > 0 && (
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => onOpen8DModal(selectedDefect || result.defects[0])}
            disabled={isGenerating8D}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            {isGenerating8D ? 'Generating 8D CAPA Dossier...' : 'Open Full 8D Problem Solving Dossier'}
          </button>
        </div>
      )}
    </div>
  );
};
