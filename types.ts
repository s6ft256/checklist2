
export enum InspectionStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  NA = 'NA',
  PENDING = 'PENDING'
}

export enum CraneType {
  ROUGH_TERRAIN = 'ROUGH TERRAIN',
  CRAWLER_LATTICE = 'CRAWLER LATTICE BOOM',
  ALL_TERRAIN = 'ALL TERRAIN',
  CRAWLER_TELESCOPIC = 'CRAWLER TELESCOPIC',
  SPIDER_CRANE = 'SPIDER CRANE',
  LORRY_MOUNTED = 'LORRY MOUNTED CRANE'
}

export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export interface ShiftEntry {
  status: InspectionStatus;
  remark?: string;
  photo?: string; // Base64 encoded image string
}

export interface DayEntry {
  dayShift: ShiftEntry;
  nightShift: ShiftEntry;
}

export interface ChecklistItemData {
  id: string;
  label: string;
  category: string;
  checks: Record<DayOfWeek, DayEntry>;
}

export interface CraneMetadata {
  make: string;
  plateNo: string;
  dateFrom: string;
  dateTo: string;
  craneType: CraneType | '';
  refNo: string;
  thirdPartyExpiry: string;
  registrationExpiry: string;
  operatorCertExpiry: string;
}

export interface SignatureData {
  dayOperatorName: string;
  dayOperatorSignature: string;
  dayCertExpiry: string;
  nightOperatorName: string;
  nightOperatorSignature: string;
  nightCertExpiry: string;
  inspectedBy: string;
  timestamp: string;
}
