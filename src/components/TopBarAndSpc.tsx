import React from 'react';
import { ShieldCheck, AlertTriangle, Play, Pause, Activity, Sliders, ChevronDown } from 'lucide-react';
import { LineMetrics } from '../types/inspection';
import { MANUFACTURING_SECTORS, SectorDef } from '../data/manufacturingSectors';

interface TopBarAndSpcProps {
  activeView: 'inspect' | 'log' | 'capa' | 'analytics';
  onSelectView: (view: 'inspect' | 'log' | 'capa' | 'analytics') => void;
  metrics: LineMetrics;
  currentSector: SectorDef;
  onSelectSector: (sector: SectorDef) => void;
  onToggleLineState: () => void;
  onOpenSettings: () => void;
}

export const TopBarAndSpc: React.FC<TopBarAndSpcProps> = ({
  activeView,
  onSelectView,
  metrics,
  currentSector,
  onSelectSector,
  onToggleLineState,
  onOpenSettings,
}) => {
  return (
    <div className="w-full bg-slate-950 border-b border-slate-800">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-850">
        {/* Zone 1: Wordmark */}
        <a
          href="/"
          onClick={e => {
            e.preventDefault();
            onSelectView('inspect');
          }}
          className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 rotate-45" />
          QualityForge AI
        </a>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectView('inspect')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeView === 'inspect' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Live Inspection Station
          </button>
          <button
            onClick={() => onSelectView('log')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeView === 'log' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Defect Audit Log
          </button>
          <button
            onClick={() => onSelectView('capa')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeView === 'capa' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            8D & CAPA Registry
          </button>
          <button
            onClick={() => onSelectView('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeView === 'analytics' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            SPC Yield Analytics
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Line Safety Control) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors border border-slate-800"
            title="Configure Line Tolerance Parameters"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleLineState}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors shadow-sm ${
              metrics.lineStatus === 'RUNNING'
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {metrics.lineStatus === 'RUNNING' ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Emergency Line Halt
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Resume Production Line
              </>
            )}
          </button>
        </div>
      </header>

      {/* Full-Width Telemetry & Statistical Process Control (SPC) Strip */}
      <div className="px-6 py-2.5 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Sector Configurator Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Sector:</span>
          <div className="relative inline-block">
            <select
              value={currentSector.id}
              onChange={e => {
                const found = MANUFACTURING_SECTORS.find(s => s.id === e.target.value);
                if (found) onSelectSector(found);
              }}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold py-1 px-2.5 rounded-lg appearance-none pr-7 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {MANUFACTURING_SECTORS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.shortCode})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>
          <span className="hidden lg:inline text-[11px] text-slate-500 font-mono">
            {currentSector.nominalToleranceMm}
          </span>
        </div>

        {/* 4-Item Statistical Process Control Strip */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[11px]">First-Pass Yield: </span>
            <span
              className={`font-bold tabular-nums ${
                metrics.firstPassYield >= 98
                  ? 'text-emerald-400'
                  : metrics.firstPassYield >= 95
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {metrics.firstPassYield.toFixed(1)}%
            </span>
          </div>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <div>
            <span className="text-slate-400 text-[11px]">Total Inspected: </span>
            <span className="font-bold text-slate-200 tabular-nums">
              {metrics.totalInspected.toLocaleString()}
            </span>
          </div>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <div>
            <span className="text-slate-400 text-[11px]">Defects Flagged: </span>
            <span className="font-bold text-rose-400 tabular-nums">
              {metrics.rejectedCount}
            </span>
          </div>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <div className="hidden sm:block">
            <span className="text-slate-400 text-[11px]">PPM Defect Rate: </span>
            <span className="font-bold text-slate-200 tabular-nums">
              {Math.round(metrics.ppmRate).toLocaleString()} PPM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
