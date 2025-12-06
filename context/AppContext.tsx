
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Role, Status, User, Country, ExpenseType, Category } from '../types';
import { SUBSIDIARIES, INITIAL_PLANNING_ROW, INITIAL_FINANCE_SCHEDULE } from '../constants';
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
  getProject: (id: string) => Project | undefined;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateStatus: (projectId: string, newStatus: Status) => void;
  addComment: (projectId: string, text: string, parentId?: string) => void;
  generateProjectCode: (country: Country, year: string) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Users matching the requirements
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'John Doe', role: Role.ProjectLead, country: Country.BR },
  { id: 'u2', name: 'Carlos Silva', role: Role.ProjectLead, country: Country.BR },
  { id: 'u3', name: 'Elena Rodriguez', role: Role.CountryManager, country: Country.BR },
  { id: 'u4', name: 'Ahmed Mansour', role: Role.ProjectLead, country: Country.GQ },
  { id: 'u5', name: 'Sarah Conner', role: Role.CountryManager, country: Country.GQ },
  { id: 'u6', name: 'Jean-Luc Picard', role: Role.ProjectLead, country: Country.CG },
  { id: 'u7', name: 'Ellen Ripley', role: Role.CountryManager, country: Country.CG },
  { id: 'u8', name: 'James T. Kirk', role: Role.CEO, country: Country.BR }, // CEO country doesn't restrict view
  { id: 'u9', name: 'Admin User', role: Role.Admin, country: Country.BR },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme Management
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

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Initialize Data from Service
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

  // User Management
  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) setCurrentUser(updatedUser);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  const generateProjectCode = (country: Country, yearStr: string) => {
     return projectService.generateCode(country, yearStr, projects);
  };

  const saveProject = (projectToSave: Project) => {
    // Optimistic Update
    const exists = projects.find(p => p.id === projectToSave.id);
    
    // Audit Log Generation
    const logs = generateAuditLogs(exists || null, projectToSave, currentUser.name);
    
    const updatedProject = {
      ...projectToSave,
      auditTrail: [...(exists?.auditTrail || []), ...logs],
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => {
      if (exists) {
        return prev.map(p => p.id === projectToSave.id ? updatedProject : p);
      }
      return [...prev, updatedProject];
    });

    // Call API in background
    projectService.save(updatedProject).catch(err => console.error("Save failed", err));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    projectService.delete(id).catch(err => console.error("Delete failed", err));
  };

  const updateStatus = (projectId: string, newStatus: Status) => {
    const project = getProject(projectId);
    if (!project) return;

    const updatedProject = { ...project, status: newStatus };
    saveProject(updatedProject);
    console.log(`Notification: Project ${project.code} moved to ${newStatus}`);
  };

  const addComment = (projectId: string, text: string, parentId?: string) => {
    const project = getProject(projectId);
    if (!project) return;

    const newComment = {
      id: generateUUID(),
      author: currentUser.name,
      role: currentUser.role,
      text,
      timestamp: new Date().toISOString(),
      parentId
    };
    
    const updatedProject = { ...project, comments: [...project.comments, newComment] };
    saveProject(updatedProject);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      switchUser,
      users,
      addUser,
      updateUser,
      deleteUser,
      projects,
      getProject,
      saveProject,
      deleteProject,
      updateStatus,
      addComment,
      generateProjectCode,
      theme,
      toggleTheme
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
