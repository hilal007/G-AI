export interface SectorDef {
  id: string;
  name: string;
  shortCode: string;
  iconName: string;
  nominalToleranceMm: string;
  typicalDefects: string[];
  inspectionStandard: string;
  sampleParts: SamplePartDef[];
}

export interface SamplePartDef {
  id: string;
  name: string;
  serialNumber: string;
  nominalSpecs: string;
  hasDefect: boolean;
  defectLabel?: string;
  defectType?: string;
  defectSeverity?: 'CRITICAL' | 'MAJOR' | 'MINOR';
  defectBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  defectDescription?: string;
  rootCausePreset?: string;
  visualType: 'cylinder_bore' | 'gear_wheel' | 'pcb_smt' | 'blister_foil' | 'flange_bracket';
}

export const MANUFACTURING_SECTORS: SectorDef[] = [
  {
    id: 'automotive',
    name: 'Automotive & Precision Machining',
    shortCode: 'AUTO-MACH',
    iconName: 'Wrench',
    nominalToleranceMm: '±0.025 mm (ISO 2768-m)',
    inspectionStandard: 'IATF 16949 / VDA 6.3',
    typicalDefects: [
      'Micro-fissure radial crack',
      'Flange machining burr',
      'Porosity casting inclusion',
      'Tool chatter surface marks',
      'Chamfer dimensional warpage',
    ],
    sampleParts: [
      {
        id: 'auto-part-01',
        name: 'Cast Alloy Cylinder Bore Liner',
        serialNumber: 'AL-90214-X',
        nominalSpecs: 'Inner Ø 82.500mm · Surface Roughness Ra 0.4µm',
        hasDefect: true,
        defectLabel: 'Radial Thermal Crack',
        defectType: 'Surface Structural Fissure',
        defectSeverity: 'CRITICAL',
        defectBox: [310, 360, 470, 580],
        defectDescription: '3.4mm linear fracture extending from chamfer rim into compression zone.',
        rootCausePreset: 'Thermal shock during quench induction cycling combined with fixture over-torque.',
        visualType: 'cylinder_bore',
      },
      {
        id: 'auto-part-02',
        name: 'Dual-Clutch Transmission Helical Gear',
        serialNumber: 'HG-55102-B',
        nominalSpecs: 'Module 2.5 · 32 Teeth · Case Hardened 58 HRC',
        hasDefect: true,
        defectLabel: 'Tooth Root Chipping & Burr',
        defectType: 'Gear Involute Profile Damage',
        defectSeverity: 'MAJOR',
        defectBox: [220, 610, 380, 780],
        defectDescription: '0.42mm chipped spur tooth edge with un-deburred secondary flash.',
        rootCausePreset: 'Carbide hobbing cutter flank wear exceeding limit after cycle count 400.',
        visualType: 'gear_wheel',
      },
      {
        id: 'auto-part-03',
        name: 'Cold-Stamped Suspension Bracket',
        serialNumber: 'SB-88319-M',
        nominalSpecs: 'High-Strength Steel Grade DP600 · 3.0mm Gauge (Nominal Conformance)',
        hasDefect: false,
        visualType: 'flange_bracket',
      },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & SMT Assembly',
    shortCode: 'PCB-SMT',
    iconName: 'Cpu',
    nominalToleranceMm: '±0.05 mm (IPC-A-610 Class 3)',
    inspectionStandard: 'IPC-A-610 Class 3 / ISO 9001',
    typicalDefects: [
      'Solder bridge short circuit',
      'Tombstoned SMD capacitor',
      'Missing IC component',
      'Cold solder joint / voiding',
      'Skewed QFP lead pitch',
    ],
    sampleParts: [
      {
        id: 'pcb-part-01',
        name: 'Telemetry Processing Motherboard (Rev 4)',
        serialNumber: 'PCB-4029-C',
        nominalSpecs: '6-Layer FR4 · ENIG Finish · QFP-64 IC Pitch 0.5mm',
        hasDefect: true,
        defectLabel: 'QFP Pin Solder Bridge',
        defectType: 'Micro-Short Spurious Solder Bridge',
        defectSeverity: 'CRITICAL',
        defectBox: [270, 420, 420, 570],
        defectDescription: 'Solder fillet bridged between pins 18 and 19 on micro-controller MCU1.',
        rootCausePreset: 'Stencil aperture misalignment of 42µm and excess solder paste squeegee velocity.',
        visualType: 'pcb_smt',
      },
      {
        id: 'pcb-part-02',
        name: 'High-Efficiency DC-DC Stepdown Module',
        serialNumber: 'PCB-1180-E',
        nominalSpecs: 'SMD 0603 passives · 12V to 3.3V Stepdown',
        hasDefect: true,
        defectLabel: 'SMD 0603 Capacitor Tombstone',
        defectType: 'Wetting Imbalance Lift',
        defectSeverity: 'MAJOR',
        defectBox: [590, 630, 730, 780],
        defectDescription: 'Capacitor C14 lifted 60 degrees off cathode pad, causing open circuit.',
        rootCausePreset: 'Uneven heat distribution in reflow zone 3 preheating curve.',
        visualType: 'pcb_smt',
      },
      {
        id: 'pcb-part-03',
        name: 'Optical Sensor Receiver Board',
        serialNumber: 'PCB-9941-A',
        nominalSpecs: 'Nominal solder volume verified · All components aligned',
        hasDefect: false,
        visualType: 'pcb_smt',
      },
    ],
  },
  {
    id: 'pharma',
    name: 'Pharmaceutical & Medical Packaging',
    shortCode: 'MED-PACK',
    iconName: 'ShieldAlert',
    nominalToleranceMm: '±0.01 mm Hermetic Barrier Seal',
    inspectionStandard: 'FDA 21 CFR Part 211 / GMP Annex 1',
    typicalDefects: [
      'Blister foil perforation',
      'Missing tablet / empty pocket',
      'Heat-seal channel breach',
      'Crushed tablet foreign particulate',
      'Blurry lot barcode matrix',
    ],
    sampleParts: [
      {
        id: 'pharma-part-01',
        name: '10-Count Alu-PVC Blister Card',
        serialNumber: 'BL-8812-V',
        nominalSpecs: '20µm Hard Temper Aluminium Foil · 250µm PVC',
        hasDefect: true,
        defectLabel: 'Hermetic Foil Micro-Puncture',
        defectType: 'Barrier Compromise / Pinhole',
        defectSeverity: 'CRITICAL',
        defectBox: [330, 310, 510, 500],
        defectDescription: '1.4mm puncture across pocket #4 edge causing atmosphere breach.',
        rootCausePreset: 'Foreign metal debris on sealing drum cylinder tooth #6.',
        visualType: 'blister_foil',
      },
      {
        id: 'pharma-part-02',
        name: 'Analgesic 500mg Blister Sheet',
        serialNumber: 'BL-4402-K',
        nominalSpecs: '100% Hermetic seal verified · Complete 10/10 fill count',
        hasDefect: false,
        visualType: 'blister_foil',
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Machined Components & Castings',
    shortCode: 'CUST-ENG',
    iconName: 'Cog',
    nominalToleranceMm: 'Configurable (Plant Master Spec)',
    inspectionStandard: 'ISO 9001 / Six Sigma DMAIC',
    typicalDefects: [
      'Dimensional tolerance breach',
      'Surface oxidation staining',
      'Excess weld spatter',
      'Sub-surface porosity pore',
      'Thread pitch stripping',
    ],
    sampleParts: [
      {
        id: 'custom-part-01',
        name: 'Titanium Hydraulic Manifold Block',
        serialNumber: 'TI-0914-Z',
        nominalSpecs: 'Grade 5 Ti-6Al-4V · Port Tolerance ±0.015mm',
        hasDefect: true,
        defectLabel: 'Fluid Port Flange Burr',
        defectType: 'Secondary Machining Burring',
        defectSeverity: 'MINOR',
        defectBox: [610, 480, 770, 660],
        defectDescription: '0.38mm burr ridge blocking hydraulic O-ring seating surface.',
        rootCausePreset: 'Drilling cycle reamer feed rate was 15% too high during rough pass.',
        visualType: 'cylinder_bore',
      },
    ],
  },
];
