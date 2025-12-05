import { Category, Country, Status } from './types';

export const CONCESSIONS = {
  [Country.BR]: [
    'General',
    'Badejo – Linguado',
    'Bonito – Enchova – Enchova Oeste – Trilha',
    'Marimba – Pirauna',
    'Pampo – Bicudo'
  ],
  [Country.GQ]: [
    'Okume',
    'Ceiba',
    'General',
    'Block G',
    'Block S'
  ],
  [Country.CG]: [
    'Nkossa',
    'Nsoko',
    'Moho Likouf (non-op)',
    'Moho Alima (non-op)',
    'Lianzi'
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
  'Ellen Ripley',
  'James T. Kirk'
];

export const CATEGORIES = Object.values(Category);

export const STATUS_COLORS = {
  [Status.Draft]: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  [Status.Submitted]: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  [Status.CMApproved]: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
  [Status.CEOApproved]: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  [Status.Revision]: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  [Status.Rejected]: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
};

export const INITIAL_PLANNING_ROW = {
  prior: false, q1: false, q2: false, q3: false, q4: false, subsequent: false
};

export const INITIAL_FINANCE_SCHEDULE = {
  prior: 0, current: 0, q1: 0, q2: 0, q3: 0, q4: 0, y1: 0, y2: 0, y3: 0, y4: 0
};