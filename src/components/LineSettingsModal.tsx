import React, { useState } from 'react';
import { X, Sliders, Save, Check } from 'lucide-react';
import { SectorDef } from '../data/manufacturingSectors';

interface LineSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSector: SectorDef;
  onSaveSettings: (settings: { sensitivity: number; haltThreshold: number; stationName: string }) => void;
}

export const LineSettingsModal: React.FC<LineSettingsModalProps> = ({
  isOpen,
  onClose,
  currentSector,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const [sensitivity, setSensitivity] = useState<number>(85);
  const [haltThreshold, setHaltThreshold] = useState<number>(3);
  const [stationName, setStationName] = useState<string>('Station OPT-01 (Conveyor Line 2)');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSave = () => {
    onSaveSettings({ sensitivity, haltThreshold, stationName });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Quality Line & Sensor Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-200">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Station Identifier & Location
            </label>
            <input
              type="text"
              value={stationName}
              onChange={e => setStationName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-300">
                Optical Defect Sensitivity Threshold
              </label>
              <span className="font-mono text-cyan-400 font-bold">{sensitivity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={sensitivity}
              onChange={e => setSensitivity(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Anomalies with visual confidence below this threshold are flagged for secondary human verification rather than automatic rejection.
            </p>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Emergency Conveyor Halt Threshold (Consecutive Critical Defects)
            </label>
            <select
              value={haltThreshold}
              onChange={e => setHaltThreshold(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value={1}>1 Defect (Zero Tolerance / Immediate Halt)</option>
              <option value={2}>2 Consecutive Defects</option>
              <option value={3}>3 Consecutive Defects (Standard IATF 16949)</option>
              <option value={5}>5 Consecutive Defects</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Conveyor halts automatically if consecutive defect count reaches this value, preventing catastrophic batch scrap.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block uppercase">Active Quality Standard:</span>
            <p>Inspection Domain: <strong>{currentSector.name}</strong></p>
            <p>Compliance Framework: <strong>{currentSector.inspectionStandard}</strong></p>
            <p>Nominal Tolerance: <strong>{currentSector.nominalToleranceMm}</strong></p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-colors"
          >
            {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedNotice ? 'Saved!' : 'Save Line Parameters'}
          </button>
        </div>
      </div>
    </div>
  );
};
