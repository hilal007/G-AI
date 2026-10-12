import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Camera, Upload, RefreshCw, Zap, Crosshair, AlertTriangle, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { SamplePartDef, SectorDef } from '../data/manufacturingSectors';
import { DefectItem, InspectionResult } from '../types/inspection';
import { generateWorkpieceSvg, svgToImageDataUrl } from '../utils/workpieceRenderer';

interface InspectionCanvasProps {
  currentSector: SectorDef;
  onInspectFrame: (dataUrl: string, part: SamplePartDef) => Promise<void>;
  isAnalyzing: boolean;
  currentResult: InspectionResult | null;
  selectedDefect: DefectItem | null;
  onSelectDefect: (defect: DefectItem | null) => void;
}

export const InspectionCanvas: React.FC<InspectionCanvasProps> = ({
  currentSector,
  onInspectFrame,
  isAnalyzing,
  currentResult,
  selectedDefect,
  onSelectDefect,
}) => {
  // Input modes: 'conveyor' | 'upload' | 'camera'
  const [inputMode, setInputMode] = useState<'conveyor' | 'upload' | 'camera'>('conveyor');

  // Conveyor state
  const [conveyorRunning, setConveyorRunning] = useState(true);
  const [conveyorSpeed, setConveyorSpeed] = useState<number>(1);
  const [conveyorPosition, setConveyorPosition] = useState<number>(50); // 0 to 100%
  const [autoInspect, setAutoInspect] = useState<boolean>(false);
  const [injectDefect, setInjectDefect] = useState<boolean>(true);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(0);

  // Upload & Camera state
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentPart = currentSector.sampleParts[selectedPartIndex] || currentSector.sampleParts[0];

  // Conveyor animation loop
  useEffect(() => {
    if (inputMode !== 'conveyor' || !conveyorRunning) return;

    const interval = setInterval(() => {
      setConveyorPosition(prev => {
        const next = prev + conveyorSpeed * 0.8;
        if (next >= 100) {
          // Cycled through: optionally change part
          return 0;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [inputMode, conveyorRunning, conveyorSpeed]);

  // Optical sensor auto-trigger check
  useEffect(() => {
    if (inputMode === 'conveyor' && autoInspect && !isAnalyzing) {
      // Trigger when part enters the exact 48-52% trigger zone
      if (conveyorPosition >= 48 && conveyorPosition <= 52) {
        handleTriggerConveyorInspection();
      }
    }
  }, [conveyorPosition, autoInspect, isAnalyzing, inputMode]);

  // Handle webcam stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (inputMode === 'camera' && webcamActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 1280, height: 720 } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.warn('Camera access unavailable:', err);
          setWebcamActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [inputMode, webcamActive]);

  const handleTriggerConveyorInspection = async () => {
    if (isAnalyzing) return;
    const svgStr = generateWorkpieceSvg(currentPart, injectDefect);
    const dataUrl = await svgToImageDataUrl(svgStr);
    await onInspectFrame(dataUrl, currentPart);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      const dataUrl = event.target?.result as string;
      setUploadedImageUrl(dataUrl);
      const customPart: SamplePartDef = {
        id: `upload-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        serialNumber: `UP-${Math.floor(10000 + Math.random() * 90000)}`,
        nominalSpecs: 'User Uploaded Industrial Specimen',
        hasDefect: true,
        visualType: 'cylinder_bore',
      };
      await onInspectFrame(dataUrl, customPart);
    };
    reader.readAsDataURL(file);
  };

  const handleCaptureWebcam = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setUploadedImageUrl(dataUrl);

    const cameraPart: SamplePartDef = {
      id: `cam-${Date.now()}`,
      name: 'Optical Camera Snapshot',
      serialNumber: `CAM-${Math.floor(10000 + Math.random() * 90000)}`,
      nominalSpecs: 'Real-Time Vision Stream Capture',
      hasDefect: true,
      visualType: 'cylinder_bore',
    };
    await onInspectFrame(dataUrl, cameraPart);
  };

  const handleLoadSample = async (part: SamplePartDef) => {
    const svgStr = generateWorkpieceSvg(part, part.hasDefect);
    const dataUrl = await svgToImageDataUrl(svgStr);
    setUploadedImageUrl(dataUrl);
    await onInspectFrame(dataUrl, part);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Mode Selector Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setInputMode('conveyor')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              inputMode === 'conveyor' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Conveyor Simulator
          </button>
          <button
            onClick={() => setInputMode('upload')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              inputMode === 'upload' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Macro Image Upload
          </button>
          <button
            onClick={() => {
              setInputMode('camera');
              setWebcamActive(true);
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              inputMode === 'camera' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Camera Frame
          </button>
        </div>

        {/* Status indicator unboxed text */}
        <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Station: OPT-01</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Res: 1000×1000 Calibrated</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className={isAnalyzing ? 'text-cyan-400 animate-pulse' : 'text-emerald-400'}>
            {isAnalyzing ? 'Processing Frame...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Main Optical Canvas Frame */}
      <div className="relative w-full h-[460px] sm:h-[500px] bg-slate-950 overflow-hidden flex items-center justify-center">
        {/* Engineering Viewfinder Grid & Reticle Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Laser Caliper Crosshair Center lines */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-[1px] bg-cyan-500/20" />
          <div className="absolute h-full w-[1px] bg-cyan-500/20" />
          <div className="absolute w-24 h-24 border border-cyan-500/30 rounded-full" />
          <div className="absolute w-12 h-12 border border-cyan-500/50 rounded-full" />
        </div>

        {/* Viewfinder Corner Brackets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-500/60 pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-500/60 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-500/60 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-500/60 pointer-events-none" />

        {/* Content Layer A: Conveyor Mode */}
        {inputMode === 'conveyor' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Conveyor Bed Belt Pattern */}
            <div
              className={`absolute bottom-6 w-full h-16 border-y border-slate-700/60 ${
                conveyorRunning ? 'conveyor-pattern' : 'conveyor-pattern-paused'
              }`}
            />

            {/* Optical Inspection Trigger Sensor Beam */}
            <div className="absolute top-0 bottom-6 w-1 bg-gradient-to-b from-cyan-400 via-cyan-500/40 to-transparent pointer-events-none shadow-[0_0_12px_rgba(6,182,212,0.8)]">
              <div className="absolute -top-1 -left-2 w-5 h-2 bg-cyan-400 rounded-b shadow-[0_0_8px_#22d3ee]" />
            </div>

            {/* Moving Workpiece on Conveyor */}
            <div
              className="absolute w-64 h-64 transition-transform duration-75 flex items-center justify-center"
              style={{
                left: `calc(${conveyorPosition}% - 128px)`,
                bottom: '48px',
              }}
            >
              <div
                className="w-full h-full p-2"
                dangerouslySetInnerHTML={{
                  __html: generateWorkpieceSvg(currentPart, injectDefect),
                }}
              />
            </div>
          </div>
        )}

        {/* Content Layer B: Uploaded Image Mode */}
        {inputMode === 'upload' && (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {uploadedImageUrl ? (
              <img
                src={uploadedImageUrl}
                alt="Uploaded inspection specimen"
                className="max-h-full max-w-full object-contain rounded-lg border border-slate-700 shadow-xl"
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-cyan-500/60 p-8 rounded-xl text-center flex flex-col items-center gap-3 transition-colors max-w-md"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Drop high-res macro photo here</p>
                  <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP up to 25MB</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Content Layer C: Live Camera Mode */}
        {inputMode === 'camera' && (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {webcamActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-h-full max-w-full object-contain rounded-lg border border-slate-700"
              />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Camera className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm">Camera Stream Inactive</p>
                <button
                  onClick={() => setWebcamActive(true)}
                  className="mt-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg"
                >
                  Activate Webcam
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scanning Laser Animation during Analysis */}
        {isAnalyzing && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scan" />
            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
          </div>
        )}

        {/* Computer Vision Bounding Box Overlay Layer (Scaled to 1000x1000 space) */}
        {currentResult && currentResult.defects.length > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-auto z-10"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            {currentResult.defects.map(defect => {
              const [ymin, xmin, ymax, xmax] = defect.box;
              const width = Math.max(20, xmax - xmin);
              const height = Math.max(20, ymax - ymin);
              const isSelected = selectedDefect?.id === defect.id;

              const strokeColor =
                defect.severity === 'CRITICAL'
                  ? '#ef4444'
                  : defect.severity === 'MAJOR'
                  ? '#f59e0b'
                  : '#06b6d4';

              return (
                <g
                  key={defect.id}
                  onClick={() => onSelectDefect(defect)}
                  className="cursor-pointer group"
                >
                  {/* Outer Bounding Box Rectangle */}
                  <rect
                    x={xmin}
                    y={ymin}
                    width={width}
                    height={height}
                    fill={isSelected ? `${strokeColor}25` : `${strokeColor}10`}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 5 : 3}
                    strokeDasharray={isSelected ? 'none' : '6 3'}
                    className="transition-all duration-150"
                  />

                  {/* Corner Calibration Crosshair Brackets */}
                  <line x1={xmin} y1={ymin} x2={xmin + 20} y2={ymin} stroke={strokeColor} strokeWidth="6" />
                  <line x1={xmin} y1={ymin} x2={xmin} y2={ymin + 20} stroke={strokeColor} strokeWidth="6" />

                  <line x1={xmax} y1={ymin} x2={xmax - 20} y2={ymin} stroke={strokeColor} strokeWidth="6" />
                  <line x1={xmax} y1={ymin} x2={xmax} y2={ymin + 20} stroke={strokeColor} strokeWidth="6" />

                  <line x1={xmin} y1={ymax} x2={xmin + 20} y2={ymax} stroke={strokeColor} strokeWidth="6" />
                  <line x1={xmin} y1={ymax} x2={xmin} y2={ymax - 20} stroke={strokeColor} strokeWidth="6" />

                  <line x1={xmax} y1={ymax} x2={xmax - 20} y2={ymax} stroke={strokeColor} strokeWidth="6" />
                  <line x1={xmax} y1={ymax} x2={xmax} y2={ymax - 20} stroke={strokeColor} strokeWidth="6" />

                  {/* Center reticle */}
                  <circle
                    cx={xmin + width / 2}
                    cy={ymin + height / 2}
                    r="4"
                    fill={strokeColor}
                  />

                  {/* Defect Label Tag */}
                  <rect
                    x={xmin}
                    y={Math.max(10, ymin - 38)}
                    width={Math.max(160, defect.label.length * 11 + 60)}
                    height="32"
                    rx="4"
                    fill="#0f172a"
                    stroke={strokeColor}
                    strokeWidth="2"
                  />
                  <text
                    x={xmin + 8}
                    y={Math.max(10, ymin - 38) + 21}
                    fill="#f8fafc"
                    fontFamily="monospace"
                    fontSize="16"
                    fontWeight="700"
                  >
                    {defect.label} · {Math.round(defect.confidence * 100)}%
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Bottom Canvas Control HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 border-t border-slate-800">
        {/* Left: Conveyor Controls (if in conveyor mode) */}
        {inputMode === 'conveyor' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConveyorRunning(!conveyorRunning)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              title={conveyorRunning ? 'Pause Conveyor' : 'Resume Conveyor'}
            >
              {conveyorRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Speed segmented buttons */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              {[0.5, 1, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setConveyorSpeed(speed)}
                  className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
                    conveyorSpeed === speed ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Defect injection switch */}
            <button
              onClick={() => setInjectDefect(!injectDefect)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                injectDefect
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {injectDefect ? 'Defect Active' : 'Conforming Part'}
            </button>

            {/* Auto-inspect toggle */}
            <button
              onClick={() => setAutoInspect(!autoInspect)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                autoInspect
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Auto-Trigger {autoInspect ? 'ON' : 'OFF'}
            </button>
          </div>
        ) : inputMode === 'camera' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCaptureWebcam}
              disabled={!webcamActive || isAnalyzing}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              Capture & Inspect Snapshot
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Different Image
            </button>
          </div>
        )}

        {/* Right Primary Inspection Trigger Action */}
        <div className="flex items-center gap-2">
          {inputMode === 'conveyor' && (
            <button
              onClick={handleTriggerConveyorInspection}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all whitespace-nowrap shrink-0"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              {isAnalyzing ? 'Scanning Part...' : 'Inspect Current Frame'}
            </button>
          )}
        </div>
      </div>

      {/* Preset Test Workpiece Library Strip */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-850">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Standard Specimen Library ({currentSector.name})
          </span>
          <span className="text-[11px] text-slate-500">
            Click to load & analyze
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {currentSector.sampleParts.map((part, index) => (
            <button
              key={part.id}
              onClick={() => {
                setSelectedPartIndex(index);
                if (inputMode === 'conveyor') {
                  // align position
                  setConveyorPosition(50);
                } else {
                  handleLoadSample(part);
                }
              }}
              className={`p-2 rounded-lg border text-left transition-colors flex items-start gap-2.5 ${
                selectedPartIndex === index
                  ? 'bg-slate-800/80 border-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  part.hasDefect ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{part.name}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                  <span>{part.serialNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span className={part.hasDefect ? 'text-rose-400' : 'text-emerald-400'}>
                    {part.hasDefect ? 'Defect' : 'Pass'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
