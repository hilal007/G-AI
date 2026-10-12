export type ConformanceStatus = 'PASS' | 'REJECT' | 'REWORK';
export type DefectSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';

export interface DefectItem {
  id: string;
  label: string;
  type: string;
  severity: DefectSeverity;
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  dimensionsEstimate?: string;
  rootCauseHypothesis?: string;
  recommendedContainment?: string;
}

export interface InspectionResult {
  id: string;
  partSerialNumber: string;
  partName: string;
  sector: string;
  timestamp: string;
  conformance: ConformanceStatus;
  overallConfidence: number;
  defectCount: number;
  inspectionNotes: string;
  defects: DefectItem[];
  imageUrl: string;
  hasAssociated8D?: boolean;
  associated8DId?: string;
}

export interface TeamMember {
  role: string;
  name: string;
  department: string;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  targetDate: string;
  verificationMetric: string;
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface Report8D {
  reportId: string;
  partSerialNumber: string;
  title: string;
  dateCreated: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  sector: string;
  partName: string;
  defectSnapshotUrl?: string;
  d1Team: TeamMember[];
  d2Problem: {
    what: string;
    where: string;
    when: string;
    who: string;
    howMany: string;
    defectDescription: string;
  };
  d3Containment: {
    actions: string[];
    quarantineLotNumber: string;
    stockPurgeCompleted: boolean;
    containmentDate: string;
  };
  d4RootCause: {
    fishboneCategory: string; // Man, Machine, Material, Method, Measurement, Environment
    fiveWhys: string[];
    escapePoint: string;
  };
  d5PermanentActions: ActionItem[];
  d6Validation: {
    trialRunResults: string;
    cpkImprovement: string;
    validationStatus: string;
  };
  d7Prevention: {
    fmeaUpdated: boolean;
    sopUpdated: boolean;
    pokaYokeImplemented: string;
    systemicFixes: string;
  };
  d8Recognition: {
    leadContributor: string;
    closureNotes: string;
  };
}

export interface LineMetrics {
  totalInspected: number;
  passedCount: number;
  rejectedCount: number;
  reworkCount: number;
  firstPassYield: number; // percentage e.g. 97.4
  ppmRate: number; // Parts per million
  lineStatus: 'RUNNING' | 'PAUSED' | 'EMERGENCY_HOLD';
  consecutiveDefectCount: number;
}
