
import { Country, Status } from './types';

export const CONCESSIONS = {
  [Country.BR]: [
    'PPM1',
    'PCE1',
    'P08',
    'P65',
    'General',
    'Other',
    'Decom',
    'PPM1/PCE1',
    'PPM1/P08',
    'PCE1/P08',
    'PPM1/PCE1/P08',
    'All assets'
  ],
  [Country.GQ]: [
    'Okume & Ceiba',
    'Okume',
    'Ceiba',
    'General',
    'Other'
  ],
  [Country.CG]: [
    'Nkossa',
    'Lianzi',
    'Moho',
    'General',
    'Other',
    'Nkossa/Nsoko',
    'Nkossa/Lianzi'
  ]
};

export const SUBSIDIARIES = {
  [Country.BR]: 'TEdB',
  [Country.GQ]: 'TEGI',
  [Country.CG]: 'TEC'
};

export const SUBCATEGORIES = [
  'N/A',
  'P&A',
  'Productive',
  'Reliability',
  'P65',
  'SGIP',
  'SGSO',
  'SGSS',
  'Studies',
  'HSE'
];

export const AVAILABLE_USERS = [
  'John Doe',
  'Carlos Silva',
  'Elena Rodriguez',
  'Ahmed Mansour',
  'Jean-Luc Picard',
  'Sarah Conner',
  'Elena Ripley',
  'James T. Kirk'
];

export const CATEGORIES = [
  'Drilling',
  'Wells',
  'Geosciences',
  'Topside',
  'Subsea',
  'Marine',
  'Maintenance',
  'Integrity',
  'Decom',
  'Other'
];

export const PROJECT_CLASSES = [
  'Baseline',
  'Regulatory',
  'Productive',
  'Other'
];

export const PRIORITIES = [
  'Essential',
  'Important',
  'Optional'
];

export const EXPENSE_TYPES = [
  'CAPEX',
  'SOPEX',
  'ABEX'
];

export const ESTIMATE_CLASSES = [
  { value: 'Class 5', label: 'Class 5 (Concept Screening)', tooltip: 'Definition: 0% to 2%. Accuracy: L: -20% to -50%, H: +30% to +100%' },
  { value: 'Class 4', label: 'Class 4 (Study or Feasibility)', tooltip: 'Definition: 1% to 15%. Accuracy: L: -15% to -30%, H: +20% to +50%' },
  { value: 'Class 3', label: 'Class 3 (Budget/Control)', tooltip: 'Definition: 10% to 40%. Accuracy: L: -10% to -20%, H: +10% to +30%' },
  { value: 'Class 2', label: 'Class 2 (Control or Bid/Tender)', tooltip: 'Definition: 30% to 70%. Accuracy: L: -5% to -15%, H: +5% to +20%' },
  { value: 'Class 1', label: 'Class 1 (Check Estimate)', tooltip: 'Definition: 50% to 100%. Accuracy: L: -3% to -10%, H: +3% to +15%' }
];

export const STATUS_COLORS = {
  [Status.Draft]: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  [Status.Submitted]: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  [Status.CMApproved]: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
  [Status.HQApproved]: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  [Status.Revision]: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  [Status.Rejected]: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
};

export const INITIAL_PLANNING_ROW = {
  prior: false, q1: false, q2: false, q3: false, q4: false, subsequent: false
};

export const INITIAL_FINANCE_SCHEDULE = {
  prior: 0, current: 0, q1: 0, q2: 0, q3: 0, q4: 0, y1: 0, y2: 0, y3: 0, y4: 0
};
