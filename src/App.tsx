import React, { useState, useEffect } from 'react';
import { MANUFACTURING_SECTORS, SectorDef, SamplePartDef } from './data/manufacturingSectors';
import { InspectionResult, DefectItem, Report8D, LineMetrics } from './types/inspection';
import { TopBarAndSpc } from './components/TopBarAndSpc';
import { InspectionCanvas } from './components/InspectionCanvas';
import { DefectDetailsPanel } from './components/DefectDetailsPanel';
import { DefectLogTable } from './components/DefectLogTable';
import { CapaRegistryView } from './components/CapaRegistryView';
import { SpcAnalyticsView } from './components/SpcAnalyticsView';
import { Report8DModal } from './components/Report8DModal';
import { LineSettingsModal } from './components/LineSettingsModal';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentSector, setCurrentSector] = useState<SectorDef>(MANUFACTURING_SECTORS[0]);
  const [activeView, setActiveView] = useState<'inspect' | 'log' | 'capa' | 'analytics'>('inspect');

  // Inspection states
  const [currentResult, setCurrentResult] = useState<InspectionResult | null>(null);
  const [selectedDefect, setSelectedDefect] = useState<DefectItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating8D, setIsGenerating8D] = useState<boolean>(false);

  // 8D Modal states
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [activeReport8D, setActiveReport8D] = useState<Report8D | null>(null);
  const [reportsList, setReportsList] = useState<Report8D[]>([]);

  // Settings modal
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  // Line metrics
  const [metrics, setMetrics] = useState<LineMetrics>({
    totalInspected: 1240,
    passedCount: 1208,
    rejectedCount: 28,
    reworkCount: 4,
    firstPassYield: 97.4,
    ppmRate: 22580,
    lineStatus: 'RUNNING',
    consecutiveDefectCount: 0,
  });

  // Historical inspection log
  const [inspectionHistory, setInspectionHistory] = useState<InspectionResult[]>([]);

  // Initialize with initial sample inspection and 8D report on mount
  useEffect(() => {
    const initialPart = currentSector.sampleParts[0];
    const initialResult: InspectionResult = {
      id: 'insp-init-01',
      partSerialNumber: initialPart.serialNumber,
      partName: initialPart.name,
      sector: currentSector.name,
      timestamp: new Date().toLocaleTimeString(),
      conformance: 'REJECT',
      overallConfidence: 0.96,
      defectCount: 1,
      inspectionNotes: 'Optical inspection identified surface fissure crack exceeding engineering allowable limit (ISO 2768-m). Immediate quarantine initiated.',
      defects: [
        {
          id: 'def-01',
          label: initialPart.defectLabel || 'Radial Surface Crack',
          type: initialPart.defectType || 'Surface Structural Fissure',
          severity: initialPart.defectSeverity || 'CRITICAL',
          confidence: 0.96,
          box: initialPart.defectBox || [310, 360, 470, 580],
          dimensionsEstimate: '3.4mm linear fracture extending into compression zone',
          rootCauseHypothesis: initialPart.rootCausePreset || 'Thermal quenching shock during induction cycling.',
          recommendedContainment: 'Quarantine CNC Station 4 pallet. Freeze downstream line feeder.',
        },
      ],
      imageUrl: '',
    };

    const initialReport: Report8D = {
      reportId: '8D-2026-9021',
      partSerialNumber: initialPart.serialNumber,
      title: `8D Dossier: ${initialPart.defectLabel || 'Radial Crack'} on ${initialPart.name}`,
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      sector: currentSector.name,
      partName: initialPart.name,
      d1Team: [
        { role: 'Champion / QA Director', name: 'Dr. Marcus Vance', department: 'Quality Assurance' },
        { role: 'Team Leader / Quality Engineer', name: 'Elena Rostova', department: 'Supplier Quality' },
        { role: 'Process Engineer', name: 'Kenji Takahashi', department: 'Manufacturing Ops' },
        { role: 'Production Supervisor', name: 'David Miller', department: 'Line 2 Machining' },
      ],
      d2Problem: {
        what: `${initialPart.defectLabel || 'Radial Crack'} with measured length 3.4mm along chamfer rim.`,
        where: 'Plant Cell B, Station OPT-01. Sector: Automotive & Precision Machining.',
        when: 'Identified on Shift 1 during continuous conveyor transit.',
        who: 'Flagged by QualityForge Vision Agent.',
        howMany: `1 confirmed defective unit on Part #${initialPart.serialNumber}; 150 units under quarantine hold.`,
        defectDescription: 'Optical surface profilometer flagged linear surface crack exceeding allowable tolerance of 0.025mm. Component represents structural fatigue risk.',
      },
      d3Containment: {
        actions: [
          `Immediate red-tag quarantine of lot batch associated with Part #${initialPart.serialNumber}.`,
          'Halt automated parts feed to downstream assembly station until 100% sort is verified.',
          'Perform manual 20-point gauge and visual re-inspection on last 150 manufactured parts.',
          'Apply certified green sticker on verified conforming units prior to release.',
        ],
        quarantineLotNumber: 'HOLD-2026-0419',
        stockPurgeCompleted: true,
        containmentDate: new Date().toISOString().split('T')[0],
      },
      d4RootCause: {
        fishboneCategory: 'Machine & Tooling',
        fiveWhys: [
          'Why 1: Why did radial crack occur? -> Tooling fixture experienced excessive mechanical chatter.',
          'Why 2: Why was there excessive chatter? -> Carbide cutting insert blade chipped on primary relief angle.',
          'Why 3: Why was the insert chipped? -> Tool life exceeded standard 350-cycle threshold by 85 cycles.',
          'Why 4: Why did it exceed the threshold? -> Automated tool cycle counter reset was missed during shift handover.',
          'Why 5: Root Cause: Shift handover checklist lacked mandatory tool counter verification sign-off.',
        ],
        escapePoint: 'Optical sensor sensitivity threshold was set to coarse mode during morning calibration.',
      },
      d5PermanentActions: [
        {
          id: 'PCA-01',
          description: 'Implement automated CNC tool wear interlock that halts machine at 300 cycles automatically.',
          owner: 'Kenji Takahashi',
          targetDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
          verificationMetric: 'Zero tool over-run incidents across 10,000 cycles.',
          status: 'IN_PROGRESS',
        },
        {
          id: 'PCA-02',
          description: 'Integrate pre-shift optical sensor auto-calibration check.',
          owner: 'Elena Rostova',
          targetDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          verificationMetric: '100% daily calibration check compliance.',
          status: 'PENDING',
        },
      ],
      d6Validation: {
        trialRunResults: 'Trial run of 300 machined parts under revised interlock showed 0 defect instances.',
        cpkImprovement: 'Process capability Cpk increased from 1.18 to 1.62.',
        validationStatus: 'VALIDATED_IN_TEST',
      },
      d7Prevention: {
        fmeaUpdated: true,
        sopUpdated: true,
        pokaYokeImplemented: 'Hardware interlock prevents spindle startup if tool usage counter exceeds threshold.',
        systemicFixes: 'Updated Plant FMEA Section 8.3 (Tool Wear Risk Priority Number reduced from 240 to 36). Standard Work Instruction SWI-449 published to all operators.',
      },
      d8Recognition: {
        leadContributor: 'Elena Rostova & CNC Team Shift A',
        closureNotes: 'Formal 8D completed with verified containment and systemic poka-yoke fixture.',
      },
    };

    setCurrentResult(initialResult);
    setSelectedDefect(initialResult.defects[0]);
    setReportsList([initialReport]);
    setActiveReport8D(initialReport);
    setInspectionHistory([
      initialResult,
      {
        id: 'insp-hist-02',
        partSerialNumber: 'SB-88319-M',
        partName: 'Cold-Stamped Suspension Bracket',
        sector: currentSector.name,
        timestamp: '10:14:02',
        conformance: 'PASS',
        overallConfidence: 0.99,
        defectCount: 0,
        inspectionNotes: 'All dimensional chamfers and holes conforming to ISO 2768-m.',
        defects: [],
        imageUrl: '',
      },
      {
        id: 'insp-hist-03',
        partSerialNumber: 'HG-55102-B',
        partName: 'Transmission Helical Gear',
        sector: currentSector.name,
        timestamp: '10:11:45',
        conformance: 'REJECT',
        overallConfidence: 0.94,
        defectCount: 1,
        inspectionNotes: 'Involute tooth profile chipped along pitch line.',
        defects: [
          {
            id: 'def-02',
            label: 'Tooth Root Chipping',
            type: 'Gear Profile Damage',
            severity: 'MAJOR',
            confidence: 0.94,
            box: [220, 610, 380, 780],
            dimensionsEstimate: '0.42mm chipped spur tooth edge',
            rootCauseHypothesis: 'Carbide hobbing cutter flank wear.',
            recommendedContainment: 'Quarantine gear batch.',
          },
        ],
        imageUrl: '',
      },
    ]);
  }, [currentSector]);

  // Handle optical frame inspection via /api/inspect
  const handleInspectFrame = async (dataUrl: string, part: SamplePartDef) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          sector: currentSector.name,
          partName: part.name,
          nominalSpecs: part.nominalSpecs,
        }),
      });

      const data = await response.json();

      const newDefects: DefectItem[] = (data.defects || []).map((d: any, idx: number) => ({
        id: `def-${Date.now()}-${idx}`,
        label: d.label || 'Defect Anomaly',
        type: d.type || 'Surface Anomaly',
        severity: d.severity || 'MAJOR',
        confidence: d.confidence || 0.92,
        box: d.box || [200, 200, 400, 400],
        dimensionsEstimate: d.dimensionsEstimate,
        rootCauseHypothesis: d.rootCauseHypothesis,
        recommendedContainment: d.recommendedContainment,
      }));

      const conformance = (data.conformance as 'PASS' | 'REJECT' | 'REWORK') || (newDefects.length > 0 ? 'REJECT' : 'PASS');

      const result: InspectionResult = {
        id: `insp-${Date.now()}`,
        partSerialNumber: part.serialNumber,
        partName: part.name,
        sector: currentSector.name,
        timestamp: new Date().toLocaleTimeString(),
        conformance,
        overallConfidence: data.overallConfidence || 0.95,
        defectCount: newDefects.length,
        inspectionNotes: data.inspectionNotes || (conformance === 'PASS' ? 'Part conforms to nominal engineering specification.' : 'Visual non-conformance flagged by AI vision agent.'),
        defects: newDefects,
        imageUrl: dataUrl,
      };

      setCurrentResult(result);
      setSelectedDefect(newDefects.length > 0 ? newDefects[0] : null);
      setInspectionHistory(prev => [result, ...prev]);

      // Update metrics
      setMetrics(prev => {
        const total = prev.totalInspected + 1;
        const passed = conformance === 'PASS' ? prev.passedCount + 1 : prev.passedCount;
        const rejected = conformance === 'REJECT' ? prev.rejectedCount + 1 : prev.rejectedCount;
        const rework = conformance === 'REWORK' ? prev.reworkCount + 1 : prev.reworkCount;
        const yieldPct = (passed / total) * 100;
        const ppm = (rejected / total) * 1000000;
        const consecutive = conformance === 'REJECT' ? prev.consecutiveDefectCount + 1 : 0;
        const lineStatus = consecutive >= 3 ? 'EMERGENCY_HOLD' : prev.lineStatus;

        return {
          totalInspected: total,
          passedCount: passed,
          rejectedCount: rejected,
          reworkCount: rework,
          firstPassYield: yieldPct,
          ppmRate: ppm,
          consecutiveDefectCount: consecutive,
          lineStatus,
        };
      });
    } catch (err) {
      console.error('Frame inspection error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate 8D Problem Solving Dossier via /api/generate-8d
  const handleGenerate8D = async (defect: DefectItem) => {
    setIsGenerating8D(true);
    try {
      const response = await fetch('/api/generate-8d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defect,
          partSerialNumber: currentResult?.partSerialNumber,
          partName: currentResult?.partName,
          sector: currentSector.name,
        }),
      });

      const data = await response.json();
      const generatedReport: Report8D = {
        ...data.report,
        sector: currentSector.name,
        partName: currentResult?.partName || 'Inspected Workpiece',
      };

      setActiveReport8D(generatedReport);
      setReportsList(prev => [generatedReport, ...prev]);
      setReportModalOpen(true);
    } catch (err) {
      console.error('8D generation error:', err);
    } finally {
      setIsGenerating8D(false);
    }
  };

  const handleUpdateReport = (updated: Report8D) => {
    setActiveReport8D(updated);
    setReportsList(prev => prev.map(r => (r.reportId === updated.reportId ? updated : r)));
  };

  const handleToggleLineState = () => {
    setMetrics(prev => ({
      ...prev,
      lineStatus: prev.lineStatus === 'RUNNING' ? 'PAUSED' : 'RUNNING',
      consecutiveDefectCount: 0,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar with 3-Zone Contract & Statistical Process Control (SPC) Strip */}
      <TopBarAndSpc
        activeView={activeView}
        onSelectView={setActiveView}
        metrics={metrics}
        currentSector={currentSector}
        onSelectSector={sector => {
          setCurrentSector(sector);
          // clear previous defect focus
          setSelectedDefect(null);
        }}
        onToggleLineState={handleToggleLineState}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Emergency Line Stoppage Alert Banner (if triggered) */}
      {metrics.lineStatus === 'EMERGENCY_HOLD' && (
        <div className="bg-rose-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>EMERGENCY CONVEYOR INTERLOCK ACTIVE: 3 Consecutive Critical Defects Flagged. Line frozen to prevent scrap escalation.</span>
          </div>
          <button
            onClick={handleToggleLineState}
            className="px-3 py-1 bg-white text-rose-700 hover:bg-slate-100 rounded font-semibold text-xs transition-colors"
          >
            Acknowledge & Resume
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeView === 'inspect' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Optical Inspection Canvas */}
            <div className="lg:col-span-7 xl:col-span-8">
              <InspectionCanvas
                currentSector={currentSector}
                onInspectFrame={handleInspectFrame}
                isAnalyzing={isAnalyzing}
                currentResult={currentResult}
                selectedDefect={selectedDefect}
                onSelectDefect={setSelectedDefect}
              />
            </div>

            {/* Right 5 Columns: Anomaly Assessment & 8D Actions HUD */}
            <div className="lg:col-span-5 xl:col-span-4">
              <DefectDetailsPanel
                result={currentResult}
                selectedDefect={selectedDefect}
                onSelectDefect={setSelectedDefect}
                onOpen8DModal={handleGenerate8D}
                isGenerating8D={isGenerating8D}
              />
            </div>
          </div>
        )}

        {activeView === 'log' && (
          <DefectLogTable
            history={inspectionHistory}
            onSelectResult={res => {
              setCurrentResult(res);
              setSelectedDefect(res.defects[0] || null);
              setActiveView('inspect');
            }}
            onOpen8DForResult={res => {
              if (res.defects.length > 0) {
                handleGenerate8D(res.defects[0]);
              }
            }}
          />
        )}

        {activeView === 'capa' && (
          <CapaRegistryView
            reports={reportsList}
            onOpenReport={rep => {
              setActiveReport8D(rep);
              setReportModalOpen(true);
            }}
            onCreateNew8D={() => {
              if (currentResult?.defects[0]) {
                handleGenerate8D(currentResult.defects[0]);
              } else if (currentSector.sampleParts[0].hasDefect) {
                const sampleDef: DefectItem = {
                  id: 'def-manual-01',
                  label: currentSector.sampleParts[0].defectLabel || 'Machining Non-Conformance',
                  type: currentSector.sampleParts[0].defectType || 'Surface Anomaly',
                  severity: currentSector.sampleParts[0].defectSeverity || 'CRITICAL',
                  confidence: 0.95,
                  box: [300, 300, 500, 500],
                  dimensionsEstimate: 'Exceeds tolerance standard',
                  rootCauseHypothesis: 'Process parameter shift',
                };
                handleGenerate8D(sampleDef);
              }
            }}
          />
        )}

        {activeView === 'analytics' && (
          <SpcAnalyticsView
            metrics={metrics}
            history={inspectionHistory}
            currentSector={currentSector}
          />
        )}
      </main>

      {/* 8D Problem Solving Dossier & CAPA Modal */}
      <Report8DModal
        report={activeReport8D}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onUpdateReport={handleUpdateReport}
      />

      {/* Line & Sensor Settings Modal */}
      <LineSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentSector={currentSector}
        onSaveSettings={({ stationName }) => {
          console.log(`Updated station to: ${stationName}`);
        }}
      />
    </div>
  );
}
