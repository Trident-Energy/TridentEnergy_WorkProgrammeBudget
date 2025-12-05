export enum Role {
  ProjectLead = 'Project Lead',
  CountryManager = 'Country Manager',
  CEO = 'CEO',
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
  CEOApproved = 'CEO Approved',
  Revision = 'Returned for Revision',
  Rejected = 'Rejected'
}

export enum ExpenseType {
  CAPEX = 'CAPEX',
  OPEX = 'OPEX',
  MIX = 'MIX OPEX/CAPEX'
}

export enum Category {
  WellServices = 'Well services',
  TopsideProject = 'Topside Project',
  Maintenance = 'Maintenance',
  MarineStructure = 'Marine and Structure',
  AutomationControls = 'Automation & Controls',
  Decommissioning = 'Decommissioning',
  SubseaProjects = 'Subsea Projects',
  Geoscience = 'Geoscience',
  Integrity = 'Integrity',
  WellIntegrity = 'Well Integrity',
  SpecialProjects = 'Special Projects',
  Drilling = 'Drilling',
  Studies = 'Studies',
  Other = 'Other'
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
  category: Category;
  subcategory?: string;
  priority: number; // 1-5
  owner: string;
  reviewers: string[];
  additionalReserves: boolean;
  multiYear: 'Single' | 'Multi';
  expenseType: ExpenseType;

  // Description
  description: string;
  justification: string;

  // Planning
  planEngineering: PlanningRow;
  planProcurement: PlanningRow;
  planExecution: PlanningRow;

  // Finance
  initiatedBefore: boolean;
  prevBudgetRef: string;
  afeNavRef: string;
  expenditures: FinanceSchedule;

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