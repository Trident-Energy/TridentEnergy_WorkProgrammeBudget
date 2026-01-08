
export enum Role {
  ProjectLead = 'Project Lead',
  CountryManager = 'Country Manager',
  Admin = 'Admin'
}

export enum Country {
  BR = 'BR',
  GQ = 'GQ',
  CG = 'CG'
}

export enum Status {
  Draft = 'Draft',
  Submitted = 'Submitted',
  CMApproved = 'Country Manager Approved',
  HQApproved = 'Approved by HQ',
  Revision = 'Returned for Revision',
  Rejected = 'Rejected'
}

export enum ExpenseType {
  CAPEX = 'CAPEX',
  SOPEX = 'SOPEX',
  ABEX = 'ABEX'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  country: Country;
}

export interface Comment {
  id: string;
  author: string;
  role: Role;
  text: string;
  timestamp: string;
  parentId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  field: string;
  oldValue: string;
  newValue: string;
  stage: Status;
}

export interface PlanningRow {
  prior: boolean;
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  subsequent: boolean;
}

export interface FinanceSchedule {
  prior: number;
  current: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  y1: number;
  y2: number;
  y3: number;
  y4: number;
}

export interface Project {
  id: string;
  // Header
  budgetYear: number;
  country: Country;
  code: string;
  manualCodeOverride?: boolean;
  name: string;
  startDate: string;
  endDate: string;
  concession: string;
  category: string; 
  subcategory?: string;
  projectClass: string; 
  priority: string; 
  owner: string;
  reviewers: string[];
  additionalReserves: boolean;
  multiYear: 'Single' | 'Multi';
  expenseType: ExpenseType;

  // Description
  description: string;
  justification: string;

  // Planning (displayed in Finance tab)
  planEngineering: PlanningRow;
  planProcurement: PlanningRow;
  planExecution: PlanningRow;

  // Finance
  initiatedBefore: boolean;
  prevBudgetRef: string;
  afeNumber?: string;
  estimateClass?: string;
  expenditures: FinanceSchedule;

  // Production & Economics (Visible when additionalReserves is true)
  oilPriceScenario?: string;
  expectedFirstOilDate?: string;
  grossInvestment?: string;
  grossReserves?: string;
  netNPV10?: string;
  netInvestmentPerBoe?: string;
  netNpvPerInvestment?: string;
  netIRR?: string;
  paybackMonths?: string;
  breakevenOilPrice?: string;

  // Previous Budget (if applicable)
  prevTotalCost: number;
  prevExpenditures: number;
  prevComments: string;

  // System
  status: Status;
  comments: Comment[];
  auditTrail: AuditLog[];
  createdAt: string;
  updatedAt: string;
}

export interface GlobalSettings {
  activeBudgetYear: number;
  isReadOnly: boolean;
  systemMessage: string;
  lockDates: Record<string, string | null>;
  thresholds: {
    ceoApprovalLimit: number;
  };
}

export interface MasterData {
  categories: string[];
  subcategories: string[];
  concessions: Record<string, string[]>;
}
