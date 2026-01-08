
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Project, Role, Status, User, Country, ExpenseType, GlobalSettings, MasterData } from '../types';
import { SUBSIDIARIES, INITIAL_PLANNING_ROW, INITIAL_FINANCE_SCHEDULE, CONCESSIONS, CATEGORIES, SUBCATEGORIES } from '../constants';
import { generateAuditLogs } from '../services/auditService';
import { generateUUID } from '../utils';
import { projectService } from '../services/projectService';

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  
  projects: Project[];
  isLoading: boolean;
  getProject: (id: string) => Project | undefined;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => string | undefined;
  updateStatus: (projectId: string, newStatus: Status) => void;
  addComment: (projectId: string, text: string, parentId?: string) => void;
  generateProjectCode: (country: Country, year: string) => string;
  
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Admin Features
  settings: GlobalSettings;
  updateSettings: (newSettings: GlobalSettings) => void;
  masterData: MasterData;
  updateMasterData: (newData: MasterData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'John Doe', role: Role.ProjectLead, country: Country.BR },
  { id: 'u2', name: 'Carlos Silva', role: Role.ProjectLead, country: Country.BR },
  { id: 'u3', name: 'Elena Rodriguez', role: Role.CountryManager, country: Country.BR },
  { id: 'u4', name: 'Ahmed Mansour', role: Role.ProjectLead, country: Country.GQ },
  { id: 'u5', name: 'Sarah Conner', role: Role.CountryManager, country: Country.GQ },
  { id: 'u6', name: 'Jean-Luc Picard', role: Role.ProjectLead, country: Country.CG },
  { id: 'u7', name: 'Ellen Ripley', role: Role.CountryManager, country: Country.CG },
  { id: 'u9', name: 'Admin User', role: Role.Admin, country: Country.BR },
];

const INITIAL_SETTINGS: GlobalSettings = {
  activeBudgetYear: new Date().getFullYear() + 1,
  isReadOnly: false,
  systemMessage: '',
  lockDates: {
    [Country.BR]: null,
    [Country.GQ]: null,
    [Country.CG]: null
  },
  thresholds: {
    ceoApprovalLimit: 0
  }
};

const INITIAL_MASTER_DATA: MasterData = {
  categories: CATEGORIES,
  subcategories: SUBCATEGORIES,
  concessions: CONCESSIONS
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [settings, setSettings] = useState<GlobalSettings>(INITIAL_SETTINGS);
  const [masterData, setMasterData] = useState<MasterData>(INITIAL_MASTER_DATA);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);

  useEffect(() => {
    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const data = await projectService.getAll();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchProjects();
  }, []);

  const switchUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  }, [users]);

  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(prev => prev.id === updatedUser.id ? updatedUser : prev);
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const getProject = useCallback((id: string) => projects.find(p => p.id === id), [projects]);

  const generateProjectCode = useCallback((country: Country, yearStr: string) => {
     return projectService.generateCode(country, yearStr, projects);
  }, [projects]);

  const saveProject = useCallback((projectToSave: Project) => {
    setProjects(prev => {
      const exists = prev.find(p => p.id === projectToSave.id);
      const logs = generateAuditLogs(exists || null, projectToSave, currentUser.name);
      const updatedProject = {
        ...projectToSave,
        auditTrail: [...(exists?.auditTrail || []), ...logs],
        updatedAt: new Date().toISOString()
      };
      
      const newProjects = exists 
        ? prev.map(p => p.id === projectToSave.id ? updatedProject : p)
        : [...prev, updatedProject];
        
      projectService.save(updatedProject).catch(err => console.error("Save failed", err));
      return newProjects;
    });
  }, [currentUser.name]);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    projectService.delete(id).catch(err => console.error("Delete failed", err));
  }, []);

  const duplicateProject = useCallback((id: string): string | undefined => {
    let newId: string | undefined;
    
    setProjects(prev => {
      const original = prev.find(p => p.id === id);
      if (!original) {
        console.error("Duplication failed: Project not found", id);
        return prev;
      }

      newId = generateUUID();
      const nextYear = original.budgetYear + 1;
      // Generate code using current project list inside state update for accuracy
      const nextYearCode = projectService.generateCode(original.country, nextYear.toString(), prev);

      const newProject: Project = {
        ...original,
        id: newId,
        budgetYear: nextYear,
        code: nextYearCode,
        manualCodeOverride: false, 
        status: Status.Draft,
        initiatedBefore: true,
        prevBudgetRef: original.code,
        planEngineering: { ...INITIAL_PLANNING_ROW },
        planProcurement: { ...INITIAL_PLANNING_ROW },
        planExecution: { ...INITIAL_PLANNING_ROW },
        expenditures: {
          ...INITIAL_FINANCE_SCHEDULE,
          prior: (Number(original.expenditures.prior) || 0) + 
                 (Number(original.expenditures.q1) || 0) + 
                 (Number(original.expenditures.q2) || 0) + 
                 (Number(original.expenditures.q3) || 0) + 
                 (Number(original.expenditures.q4) || 0),
          y1: original.expenditures.y2 || 0,
          y2: original.expenditures.y3 || 0,
          y3: original.expenditures.y4 || 0,
          y4: 0
        },
        comments: [],
        auditTrail: [{
          id: generateUUID(),
          timestamp: new Date().toISOString(),
          user: currentUser.name,
          field: 'Project',
          oldValue: 'N/A',
          newValue: `Duplicated/Carried over from budget year ${original.budgetYear} (Ref: ${original.code})`,
          stage: Status.Draft
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      projectService.save(newProject).catch(err => console.error("Service persistence failed", err));
      return [...prev, newProject];
    });

    return newId;
  }, [currentUser.name]);

  const updateStatus = useCallback((projectId: string, newStatus: Status) => {
    setProjects(prev => {
      const project = prev.find(p => p.id === projectId);
      if (!project) return prev;
      const updatedProject = { ...project, status: newStatus, updatedAt: new Date().toISOString() };
      projectService.save(updatedProject).catch(err => console.error("Update failed", err));
      return prev.map(p => p.id === projectId ? updatedProject : p);
    });
  }, []);

  const addComment = useCallback((projectId: string, text: string, parentId?: string) => {
    setProjects(prev => {
      const project = prev.find(p => p.id === projectId);
      if (!project) return prev;

      const newComment = {
        id: generateUUID(),
        author: currentUser.name,
        role: currentUser.role,
        text,
        timestamp: new Date().toISOString(),
        parentId
      };
      
      const updatedProject = { 
        ...project, 
        comments: [...project.comments, newComment],
        updatedAt: new Date().toISOString() 
      };
      projectService.save(updatedProject).catch(err => console.error("Comment failed", err));
      return prev.map(p => p.id === projectId ? updatedProject : p);
    });
  }, [currentUser.name, currentUser.role]);

  const updateSettings = useCallback((newSettings: GlobalSettings) => setSettings(newSettings), []);
  const updateMasterData = useCallback((newData: MasterData) => setMasterData(newData), []);

  return (
    <AppContext.Provider value={{
      currentUser,
      switchUser,
      users,
      addUser,
      updateUser,
      deleteUser,
      projects,
      isLoading,
      getProject,
      saveProject,
      deleteProject,
      duplicateProject,
      updateStatus,
      addComment,
      generateProjectCode,
      theme,
      toggleTheme,
      settings,
      updateSettings,
      masterData,
      updateMasterData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
