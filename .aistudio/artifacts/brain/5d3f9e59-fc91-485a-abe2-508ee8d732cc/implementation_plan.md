# QualityForge: Manufacturing Quality Inspection AI Agent & 8D/CAPA Engine

An industrial-grade computer vision and automated QA inspection console designed for modern manufacturing plants. It identifies quality anomalies in real time, marks pinpoint bounding boxes on visual feeds, calculates yield and PPM defect rates, and automatically synthesizes 8D Problem Solving and Corrective & Preventive Action (CAPA) non-conformance reports powered by multimodal AI.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural parameters have been established based on your selections:

- **Confirmed Manufacturing Scope**: Customizable multi-sector manufacturing lines with instant presets for Precision Metal Machining/Automotive, PCB & Surface Mount Electronics, Pharmaceutical Packaging & Blister Packs, and Custom Part Lines.
- **Confirmed Vision & Defect Detection**: Dual-mode inspection featuring a simulated continuous conveyor line stream (with real-time pause, frame capture, and speed adjustment) and high-resolution image upload & camera capture, with visual bounding box overlays, confidence metrics, and defect severity classification.
- **Confirmed Quality Standard & Corrective Action**: Automotive & aerospace-standard 8D Problem Solving (Disciplines D1 through D8) coupled with formal CAPA ticketing, root-cause classification (Ishikawa 5M+E), containment procedures, and printable/exportable QA audit sheets.

---

## 1. Overview & Core Concept

### What It Does
QualityForge serves as an AI Quality Inspection Agent operating at the edge of manufacturing production lines. Plant operators, Quality Engineers (QE), and Plant Quality Managers can:
1. **Monitor Real-Time Inspection Feeds**: Watch parts transit an optical inspection line simulator with live defect triggers (cracks, burrs, cold solder joints, missing components, seal breaches, voids).
2. **Inspect Custom Visual Assets**: Upload macro photos or snapshot camera captures of physical components for sub-millimeter visual anomaly analysis.
3. **Automated Defect Bounding Boxes**: Detect anomalies with calibrated coordinates `[ymin, xmin, ymax, xmax]`, severity grading (Critical, Major, Minor), defect taxonomy, and confidence scoring.
4. **Generate 8D Problem Solving Reports**: Trigger automated AI generation of complete 8D dossiers with D1 (Team), D2 (Problem Description), D3 (Interim Containment), D4 (Root Cause / 5-Why), D5 (Permanent Corrective Action), D6 (Validation), D7 (Recurrence Prevention), and D8 (Recognition).
5. **Manage CAPA Action Items**: Track open non-conformances, assign owners, set verification target dates, and download professional PDF/print-ready inspection certificates.

### Target Audience & Persona
- **Quality Assurance & Control Engineers (QA/QC)**: Running statistical process control, tagging non-conformances, and documenting defect signatures.
- **Plant Operations & Line Supervisors**: Monitoring first-pass yield (FPY), parts-per-million (PPM) defect rates, and line stoppage triggers.
- **Supplier Quality Managers**: Auditing vendor component batches and transmitting formal 8D corrective action demands.

### Key Value
Eliminates manual defect logging lag, prevents defective parts from escaping to downstream assembly, standardizes root-cause discovery through rigorous 8D methodology, and provides immediate visual evidence with pinpoint coordinates.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Inspection Control Center (Main View)**:
   - Top HUD bar displays current Line Status, Active Sector Preset (e.g., Automotive Machining), First-Pass Yield (98.4%), Inspected Count, and Defect Counter.
   - Dual inspection canvas:
     - *Mode A: Simulated Conveyor Stream*: Animated optical conveyor passing industrial workpieces with variable transit speeds (Slow, Nominal, High-Speed), automated optical trigger, and instant "Inspect Frame" action.
     - *Mode B: High-Res Upload & Camera*: Drag-and-drop file uploader with sample defect test library (cracked cylinder head, bridged PCB solder, blister foil puncture, warped stamp plate) or direct camera capture.
2. **Detection & Anomaly Analysis HUD**:
   - The captured frame renders with interactive SVG bounding boxes.
   - Hovering or selecting a bounding box highlights the defect metadata: defect label, confidence rating (e.g., 96.8%), severity badge (Critical / Major / Minor), and dimensional location.
   - Inspection summary checklist indicates Conformance Status: **PASS**, **REJECT / HOLD**, or **REWORK**.
3. **8D Problem Solving Dossier & CAPA Generator**:
   - One-click trigger: "Generate 8D CAPA Dossier".
   - The AI Agent generates a comprehensive 8-Discipline engineering report tailored to the detected defect signature, including 5-Why analysis, containment protocols (quarantine lots, halt line, 100% sort), and preventative poka-yoke recommendations.
   - Operators can edit any discipline, update team members, assign corrective action owners, and export the document (Print / PDF format / JSON export).
4. **Statistical Process Control (SPC) & Defect Log**:
   - Tabular audit log of all inspected parts with timestamps, part serials, defect types, and dispositions.
   - Pareto defect distribution breakdown and yield trend telemetry.

### Visual Identity & Theme
- **Aesthetic Direction**: High-precision industrial avionics and quality laboratory workstation. Utilitarian, clean, sharp, and data-dense without clutter.
- **Color Palette (60-30-10 Rule)**:
  - *Dominant Canvas (60%)*: Deep slate neutral `#090D16` / `#0F172A` with cool high-contrast text `#F8FAFC`.
  - *Structural Surfaces (30%)*: Precision milled panels `#1E293B`, crisp hairline borders `#334155` (1px clean outlines), slate-900 data grids.
  - *Accent Budget (10%)*: Industrial Safety Amber `#F59E0B` for warnings, High-Vis Emerald `#10B981` for nominal pass states, Crimson `#EF4444` for critical defects, and Precision Cyan `#06B6D4` for bounding box crosshairs and scan lines.
- **Typography & Tabular Discipline**:
  - Display & Headings: `Plus Jakarta Sans` (weights 600, 700) with balanced headlines.
  - Body & Form Controls: `Plus Jakarta Sans` (14px–15px) for maximum readability.
  - Telemetry & Measurements: Monospace tabular numerals (`font-mono tabular-nums`, `JetBrains Mono`) for coordinate readouts `[X: 412, Y: 180]`, PPM rates, and serial codes.
- **Component Styling & Layout**:
  - Single-elevation depth with hairline dividers.
  - Anti-slop restraint: No decorative pill islands, no fake latency tickers, no arbitrary single-digit novelty scores. Real industrial parameters only.
  - Full 1440px desktop responsive presence with clear 3-zone Top Bar Contract.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Engine Vision Analysis (Real Gemini 3.8 Flash + High-Fidelity Local Heuristic Fallback)**
  - *Chosen Approach*: Server-side Gemini 3.8 Flash multimodal API endpoint (`/api/inspect`) analyzes uploaded images and snapshot frames, extracting structured JSON bounding boxes `[ymin, xmin, ymax, xmax]` and defect taxonomies. A built-in high-precision optical simulation engine guarantees zero-downtime testing even when offline or before API key injection.
  - *Why*: Allows instant out-of-the-box testing with realistic industrial parts while unlocking deep multimodal visual AI upon user testing.
- **Decision 2: 8D Discipline Framework as First-Class Schema**
  - *Chosen Approach*: Standardize reporting on AIAG / VDA 8D Problem Solving structure (D1 through D8) rather than generic text summaries.
  - *Why*: 8D is the universally recognized gold standard in automotive, aerospace, and medical device manufacturing. Every field is actionable, auditable, and directly usable by plant quality managers.
- **Decision 3: Multi-Sector Line Configurator**
  - *Chosen Approach*: Provide hot-swappable line presets:
    1. *Automotive & Powertrain*: Cylinder heads, transmission gears, welded brackets (cracks, porosity, burrs, spatter).
    2. *PCB & Electronics Assembly*: SMT boards (solder bridging, tombstoning, missing IC, misaligned capacitors).
    3. *Pharmaceutical & Medical Packaging*: Foil blister packs, vials, seal integrity (pierced foil, missing capsule, unsealed margin).
    4. *Custom Machined Components*: Allows operators to configure custom inspection tolerances (tolerance threshold, minimum confidence).
  - *Why*: Accommodates any manufacturing plant environment as requested.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   QUALITYFORGE CLIENT (React 19 + Vite)                │
│                                                                        │
│  ┌────────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │   Top HUD & KPI    │  │  Line Selector   │  │   8D / CAPA Tab    │  │
│  │ (Yield, PPM, FPY)  │  │(Auto/PCB/Pharma) │  │  (Full D1 - D8)    │  │
│  └─────────┬──────────┘  └────────┬─────────┘  └─────────┬──────────┘  │
│            │                      │                      │             │
│  ┌─────────▼──────────────────────▼──────────────────────▼──────────┐  │
│  │              Inspection Canvas & Optical Viewport                │  │
│  │  • Conveyor Motion Simulator (HTML5 Canvas / SVG Stream)          │  │
│  │  • Upload / Camera Macro Capture Controller                      │  │
│  │  • Bounding Box & Defect Layer (Coordinates, Labels, Confidence)  │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
│                                    │                                   │
│  ┌─────────────────────────────────▼────────────────────────────────┐  │
│  │    Inspection Store & Defect Registry (History, SPC Trends)      │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ POST /api/inspect
                                     │ POST /api/generate-8d-report
┌────────────────────────────────────▼───────────────────────────────────┐
│              EXPRESS / VITE SERVER-SIDE RUNTIME                        │
│                                                                        │
│  • Express Router & Body Parser (/api/*)                               │
│  • Shared Gemini Client Utility: GoogleGenAI SDK (User-Agent: aistudio)│
│  • Multimodal Model: gemini-3.8-flash                                  │
│  • Structured JSON Extraction via responseSchema & Type.OBJECT         │
│  • 8D Corrective Action AI Synthesizer                                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Entities
- **InspectionPart**: `{ id, serialNumber, sector, partName, timestamp, status: 'PASS' | 'DEFECT' | 'REWORK', defects: DefectItem[], confidence: number, imageUrl: string }`
- **DefectItem**: `{ id, type, label, severity: 'CRITICAL' | 'MAJOR' | 'MINOR', box: [ymin, xmin, ymax, xmax], confidence: number, rootCauseHypothesis: string, recommendation: string }`
- **Report8D**: `{ reportId, partSerialNumber, defectId, dateCreated, status: 'DRAFT' | 'ACTIVE' | 'CLOSED', d1Team: TeamMember[], d2Problem: string, d3Containment: string, d4RootCause: { fiveWhys: string[], fishboneCategory: string }, d5PermanentActions: ActionItem[], d6Validation: string, d7Prevention: string, d8Recognition: string }`
- **LineMetrics**: `{ totalInspected, passCount, defectCount, yieldPercentage, ppmDefectRate, activeSector }`

### Verification Plan
- Verify full TypeScript compilation via `compile_applet`.
- Test real-time conveyor animation, pause, and trigger snapshot.
- Test high-res image upload and defect bounding box rendering.
- Test automated 8D report generation and interactive discipline editing.
- Test printable / exportable CAPA non-conformance docket.
