import { AuditLog, Project, Status } from '../types';
import { generateUUID } from '../utils';

export const generateAuditLogs = (
  oldProject: Project | null,
  newProject: Project,
  user: string
): AuditLog[] => {
  const logs: AuditLog[] = [];
  const timestamp = new Date().toISOString();
  
  // If new creation
  if (!oldProject) {
    logs.push({
      id: generateUUID(),
      timestamp,
      user,
      field: 'Project',
      oldValue: 'N/A',
      newValue: 'Created',
      stage: newProject.status
    });
    return logs;
  }

  // Compare fields (Simplified deep compare for key fields)
  const compare = (field: string, oldVal: any, newVal: any) => {
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      logs.push({
        id: generateUUID(),
        timestamp,
        user,
        field,
        oldValue: String(oldVal),
        newValue: String(newVal),
        stage: newProject.status // Capture status at time of change
      });
    }
  };

  // Header Fields
  compare('Name', oldProject.name, newProject.name);
  compare('Start Date', oldProject.startDate, newProject.startDate);
  compare('End Date', oldProject.endDate, newProject.endDate);
  compare('Concession', oldProject.concession, newProject.concession);
  compare('Priority', oldProject.priority, newProject.priority);
  compare('Expense Type', oldProject.expenseType, newProject.expenseType);
  compare('Status', oldProject.status, newProject.status);

  // Financials - check totals for brevity in audit
  const oldTotal = Object.values(oldProject.expenditures).reduce((a, b) => a + b, 0);
  const newTotal = Object.values(newProject.expenditures).reduce((a, b) => a + b, 0);
  if (oldTotal !== newTotal) {
    compare('Total Expenditures', oldTotal, newTotal);
  }

  return logs;
};