
import { Project, Status, Country, ExpenseType, Role } from '../types';
import { INITIAL_PLANNING_ROW, INITIAL_FINANCE_SCHEDULE, SUBSIDIARIES, CATEGORIES, AVAILABLE_USERS, PRIORITIES, PROJECT_CLASSES } from '../constants';
import { generateUUID } from '../utils';

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    budgetYear: 2025,
    country: Country.BR,
    code: 'BR-2025-TEdB-001',
    name: 'Pampo Platform Upgrade',
    startDate: '2025-01-15',
    endDate: '2025-11-30',
    concession: 'Pampo – Bicudo',
    category: 'Maintenance',
    projectClass: 'Baseline',
    priority: 'Essential',
    owner: 'Carlos Silva',
    reviewers: ['John Doe', 'Elena Rodriguez'],
    additionalReserves: false,
    multiYear: 'Single',
    expenseType: ExpenseType.CAPEX,
    description: 'Structural reinforcement of the main deck.',
    justification: 'Safety critical maintenance required by regulation.',
    planEngineering: { ...INITIAL_PLANNING_ROW, prior: true, q1: true },
    planProcurement: { ...INITIAL_PLANNING_ROW, q1: true, q2: true },
    planExecution: { ...INITIAL_PLANNING_ROW, q3: true, q4: true },
    initiatedBefore: false,
    prevBudgetRef: '',
    afeNumber: 'AFE-BR-2025-001',
    expenditures: { ...INITIAL_FINANCE_SCHEDULE, q1: 500, q2: 1200, q3: 800 },
    prevTotalCost: 0,
    prevExpenditures: 0,
    prevComments: '',
    status: Status.Draft,
    comments: [],
    auditTrail: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    budgetYear: 2025,
    country: Country.GQ,
    code: 'GQ-2025-TEGI-001',
    name: 'Zafiro Well Intervention',
    startDate: '2025-03-01',
    endDate: '2025-06-30',
    concession: 'Ceiba', 
    category: 'Wells',
    projectClass: 'Productive',
    priority: 'Important',
    owner: 'Ahmed Mansour',
    reviewers: ['John Doe'],
    additionalReserves: true,
    multiYear: 'Single',
    expenseType: ExpenseType.SOPEX,
    description: 'Routine intervention for well Z-12 to restore production levels.',
    justification: 'Well production has declined by 15% over the last quarter.',
    planEngineering: { ...INITIAL_PLANNING_ROW, q1: true },
    planProcurement: { ...INITIAL_PLANNING_ROW, q1: true },
    planExecution: { ...INITIAL_PLANNING_ROW, q2: true },
    initiatedBefore: false,
    prevBudgetRef: '',
    afeNumber: '',
    expenditures: { ...INITIAL_FINANCE_SCHEDULE, q1: 200, q2: 1500 },
    prevTotalCost: 0,
    prevExpenditures: 0,
    prevComments: '',
    status: Status.Submitted,
    comments: [],
    auditTrail: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    budgetYear: 2025,
    country: Country.CG,
    code: 'CG-2025-TEC-001',
    name: 'Nkossa Digital Twin Pilot',
    startDate: '2025-02-01',
    endDate: '2026-06-01',
    concession: 'Nkossa',
    category: 'Other',
    projectClass: 'Other',
    priority: 'Optional',
    owner: 'Jean-Luc Picard',
    reviewers: ['Sarah Conner', 'Elena Rodriguez'],
    additionalReserves: false,
    multiYear: 'Multi',
    expenseType: ExpenseType.SOPEX,
    description: 'Implementation of a digital twin for the Nkossa floating production unit.',
    justification: 'Optimization of maintenance schedules and reduction of POB.',
    planEngineering: { ...INITIAL_PLANNING_ROW, q1: true, q2: true },
    planProcurement: { ...INITIAL_PLANNING_ROW, q2: true, q3: true },
    planExecution: { ...INITIAL_PLANNING_ROW, q4: true, subsequent: true },
    initiatedBefore: false,
    prevBudgetRef: '',
    afeNumber: 'AFE-CG-NK-2025',
    expenditures: { ...INITIAL_FINANCE_SCHEDULE, q1: 150, q2: 300, q3: 300, q4: 400, y1: 1200 },
    prevTotalCost: 0,
    prevExpenditures: 0,
    prevComments: '',
    status: Status.CMApproved,
    comments: [],
    auditTrail: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper to generate bulk projects
const generateBulkData = (existing: Project[]): Project[] => {
  const result = [...existing];
  const countries = [Country.BR, Country.GQ, Country.CG];
  const years = [2026, 2027];
  
  const titles: Record<Country, string[]> = {
    [Country.BR]: ['Pampo Compressor Fix', 'Bicudo Subsea Survey', 'P65 Painting Phase', 'Enchova Water Injection', 'P08 Life Extension'],
    [Country.GQ]: ['Zafiro Power Mod', 'Ceiba Pigging Campaign', 'Okume Flare Tip', 'Aseng Umbilical Fix', 'Zafiro Deck Repair'],
    [Country.CG]: ['Nkossa Gas Lift', 'Moho Living Quarters', 'Lianzi Pump Replacement', 'Nkossa Security Link', 'Moho Crane Refurb']
  };

  const statuses = [Status.Draft, Status.Submitted, Status.CMApproved, Status.HQApproved];

  years.forEach(year => {
    countries.forEach(country => {
      for (let i = 0; i < 5; i++) {
        const id = generateUUID();
        const sub = SUBSIDIARIES[country];
        const seq = (i + 1).toString().padStart(3, '0');
        const code = `${country}-${year}-${sub}-${seq}`;
        
        result.push({
          id,
          budgetYear: year,
          country,
          code,
          name: `${titles[country][i]} ${year}`,
          startDate: `${year}-02-01`,
          endDate: `${year}-10-30`,
          concession: country === Country.BR ? 'Pampo – Bicudo' : (country === Country.GQ ? 'Ceiba' : 'Nkossa'),
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          projectClass: PROJECT_CLASSES[Math.floor(Math.random() * PROJECT_CLASSES.length)],
          priority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
          owner: AVAILABLE_USERS[Math.floor(Math.random() * AVAILABLE_USERS.length)],
          reviewers: [],
          additionalReserves: i % 3 === 0,
          multiYear: i % 4 === 0 ? 'Multi' : 'Single',
          expenseType: i % 2 === 0 ? ExpenseType.CAPEX : ExpenseType.SOPEX,
          description: `Standard infrastructure maintenance and upgrade works for ${year} cycle.`,
          justification: 'Necessary for continued operations and compliance.',
          planEngineering: { ...INITIAL_PLANNING_ROW, q1: true },
          planProcurement: { ...INITIAL_PLANNING_ROW, q2: true },
          planExecution: { ...INITIAL_PLANNING_ROW, q3: true, q4: true },
          initiatedBefore: false,
          prevBudgetRef: '',
          expenditures: { 
            ...INITIAL_FINANCE_SCHEDULE, 
            q1: Math.floor(Math.random() * 500) + 100,
            q2: Math.floor(Math.random() * 1000) + 200,
            q3: Math.floor(Math.random() * 1000) + 200,
            q4: Math.floor(Math.random() * 500) + 100,
            y1: i % 4 === 0 ? 2000 : 0
          },
          prevTotalCost: 0, prevExpenditures: 0, prevComments: '',
          status: statuses[Math.floor(Math.random() * statuses.length)],
          comments: [],
          auditTrail: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });
  });

  return result;
};

let mockProjects = generateBulkData(INITIAL_PROJECTS);

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...mockProjects]), 300);
    });
  },

  getById: async (id: string): Promise<Project | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockProjects.find(p => p.id === id)), 200);
    });
  },

  save: async (project: Project): Promise<Project> => {
    return new Promise((resolve) => {
        const index = mockProjects.findIndex(p => p.id === project.id);
        if (index >= 0) {
            mockProjects[index] = project;
        } else {
            mockProjects.push(project);
        }
        setTimeout(() => resolve(project), 400);
    });
  },

  delete: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        mockProjects = mockProjects.filter(p => p.id !== id);
        setTimeout(resolve, 300);
    });
  },
  
  generateCode: (country: Country, yearStr: string, currentProjects: Project[]) => {
    const year = yearStr ? yearStr.substring(0, 4) : new Date().getFullYear().toString();
    const subsidiary = SUBSIDIARIES[country];
    const count = currentProjects.filter(p => p.code.startsWith(`${country}-${year}-${subsidiary}`)).length;
    const sequence = (count + 1).toString().padStart(3, '0');
    return `${country}-${year}-${subsidiary}-${sequence}`;
  }
};
