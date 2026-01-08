import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { STATUS_COLORS, PRIORITIES } from '../constants';
import { Country, Status, Role, Project } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, MessageSquare, ChevronRight, Download, ChevronLeft, Calendar, PlusCircle, Trash2, MapPin, Briefcase, Database, Activity, AlertCircle, User, ChevronUp, ChevronDown, Check, CheckSquare, History, CopyPlus } from 'lucide-react';

// --- MultiSelect Component ---
const MultiSelect = ({ label, options, selected, onChange, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const isSelected = selected.includes(option);
    if (isSelected) {
      onChange(selected.filter((item: string) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const isAllSelected = selected.length === 0;

  return (
    <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white cursor-pointer hover:border-slate-400 transition-colors"
      >
        <Icon size={16} className="text-slate-400 shrink-0" />
        <span className="truncate flex-1">
          {isAllSelected ? `All ${label}s` : `${selected.length} selected`}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 space-y-1">
            <button 
              onClick={() => onChange([])}
              className={`w-full text-left px-3 py-1.5 rounded text-xs font-bold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isAllSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
            >
              All {label}s
              {isAllSelected && <Check size={14} />}
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
            {options.map((opt: string) => (
              <button 
                key={opt}
                onClick={() => toggleOption(opt)}
                className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${selected.includes(opt) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
              >
                {opt}
                {selected.includes(opt) && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Flag Components
const FlagBR = ({ size = "w-8 h-8" }: { size?: string }) => (
  <svg viewBox="0 0 32 32" className={`${size} rounded-full shadow-sm object-cover border border-slate-100 dark:border-slate-700`}>
    <rect width="32" height="32" fill="#009c3b" />
    <path d="M16 4 L28 16 L16 28 L4 16 Z" fill="#ffdf00" />
    <circle cx="16" cy="16" r="6" fill="#002776" />
    <path d="M10 16 Q 16 20 22 16" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.8" />
  </svg>
);

const FlagGQ = ({ size = "w-8 h-8" }: { size?: string }) => (
  <svg viewBox="0 0 32 32" className={`${size} rounded-full shadow-sm object-cover border border-slate-100 dark:border-slate-700`}>
    <rect y="0" width="32" height="11" fill="#3e9a00" />
    <rect y="11" width="32" height="10" fill="#ffffff" />
    <rect y="21" width="32" height="10" fill="#e32118" />
    <path d="M0 0 L10 16 L0 32 Z" fill="#0073ce" />
    <path d="M13 12 H19 V16 C19 18.5 16 19.5 16 19.5 C16 19.5 13 18.5 13 16 V12 Z" fill="#e2e8f0" />
    <path d="M16 13 L17 16 H16.5 V17.5 H15.5 V16 H15 L16 13 Z" fill="#3e9a00" />
  </svg>
);

const FlagCG = ({ size = "w-8 h-8" }: { size?: string }) => (
  <svg viewBox="0 0 32 32" className={`${size} rounded-full shadow-sm object-cover border border-slate-100 dark:border-slate-700`}>
    <rect width="32" height="32" fill="#fbde4a" />
    <path d="M0 0 L22 0 L0 22 Z" fill="#009543" />
    <path d="M32 32 L10 32 L32 10 Z" fill="#dc241f" />
  </svg>
);

export const Dashboard = () => {
  const { projects, currentUser, masterData, settings, deleteProject } = useApp();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const isAdmin = currentUser.role === Role.Admin;
  
  // Filter States (Multi-select)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState<string[]>([]);
  const [filterBudgetYear, setFilterBudgetYear] = useState<number>(settings.activeBudgetYear);
  const [filterDiscipline, setFilterDiscipline] = useState<string[]>([]);
  const [filterAsset, setFilterAsset] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [searchOwner, setSearchOwner] = useState('');

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project | 'budgetYearVal'; direction: 'asc' | 'desc' } | null>({ key: 'code', direction: 'asc' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const calculateBudgetYearGross = (p: Project) => {
    const e = p.expenditures;
    return (Number(e.q1) || 0) + (Number(e.q2) || 0) + (Number(e.q3) || 0) + (Number(e.q4) || 0);
  };

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCountry, filterBudgetYear, filterDiscipline, filterAsset, filterStatus, filterPriority, searchOwner]);

  // Accessible Projects based on roles
  const accessibleProjects = useMemo(() => {
    return projects.filter(p => {
      if (isAdmin) return true;
      // Fixed: Removed non-existent Role.CEO and Status.CEOApproved logic as it was deprecated
      return p.country === currentUser.country;
    });
  }, [projects, currentUser, isAdmin]);

  // Filtering & Sorting Logic
  const filteredProjects = useMemo(() => {
    let result = accessibleProjects.filter(p => {
      const matchesGeneralSearch = !searchTerm || 
        [p.name, p.code, p.description, p.concession, p.category, p.owner, p.afeNumber].some(field => 
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesOwnerSearch = !searchOwner || p.owner.toLowerCase().includes(searchOwner.toLowerCase());
      const matchesCountry = filterCountry.length === 0 || filterCountry.includes(p.country);
      const matchesYear = p.budgetYear === filterBudgetYear;
      const matchesDiscipline = filterDiscipline.length === 0 || filterDiscipline.includes(p.category);
      const matchesAsset = filterAsset.length === 0 || filterAsset.includes(p.concession);
      const matchesStatus = filterStatus.length === 0 || filterStatus.includes(p.status);
      const matchesPriority = filterPriority.length === 0 || filterPriority.includes(p.priority);

      return matchesGeneralSearch && matchesOwnerSearch && matchesCountry && matchesYear && 
             matchesDiscipline && matchesAsset && matchesStatus && matchesPriority;
    });

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'budgetYearVal') {
          aValue = calculateBudgetYearGross(a);
          bValue = calculateBudgetYearGross(b);
        } else {
          aValue = a[sortConfig.key as keyof Project] || '';
          bValue = b[sortConfig.key as keyof Project] || '';
        }

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [accessibleProjects, searchTerm, searchOwner, filterCountry, filterBudgetYear, filterDiscipline, filterAsset, filterStatus, filterPriority, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const assetOptions = useMemo(() => {
    if (filterCountry.length === 0) {
      const allAssets = Object.values(masterData.concessions).flat();
      return Array.from(new Set(allAssets)).sort();
    }
    const assets = filterCountry.flatMap(c => masterData.concessions[c as Country] || []);
    return Array.from(new Set(assets)).sort();
  }, [filterCountry, masterData.concessions]);

  const handleSort = (key: keyof Project | 'budgetYearVal') => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <div className="w-4 h-4 opacity-0 group-hover:opacity-40"><ChevronUp size={14} /></div>;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-blue-500" />;
  };

  const handleExportExcel = () => {
    if (filteredProjects.length === 0) return;

    const headers = [
      'Code', 'Project Name', 'Status', 'Country', 'Category', 'Asset', 'Priority', 'Owner', 'AFE Number', `Budget ${filterBudgetYear} (kUSD)`, 'Total Project Cost (kUSD)'
    ];

    const rows = filteredProjects.map(p => {
      const budgetYearVal = calculateBudgetYearGross(p);
      const totalCost = Object.values(p.expenditures).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
      return [
        p.code,
        `"${p.name.replace(/"/g, '""')}"`,
        p.status,
        p.country,
        p.category,
        p.concession,
        p.priority,
        p.owner,
        p.afeNumber || 'N/A',
        budgetYearVal,
        totalCost
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                   (now.getMonth() + 1).toString().padStart(2, '0') + 
                   now.getDate().toString().padStart(2, '0') + '_' + 
                   now.getHours().toString().padStart(2, '0') + 
                   now.getMinutes().toString().padStart(2, '0');
    link.setAttribute("href", url);
    link.setAttribute("download", `WPB_Export_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFlag = (country: Country) => {
    switch (country) {
      case Country.BR: return <FlagBR size="w-6 h-6" />;
      case Country.GQ: return <FlagGQ size="w-6 h-6" />;
      case Country.CG: return <FlagCG size="w-6 h-6" />;
      default: return null;
    }
  };

  const handleDeleteProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (window.confirm(`CRITICAL ACTION: Are you absolutely sure you want to PERMANENTLY DELETE project ${project.code} (${project.name})? This cannot be undone.`)) {
      deleteProject(project.id);
    }
  };

  const handleGoToApproval = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    navigate(`/project/${projectId}?tab=Approval`);
  };

  return (
    <div className="space-y-6">
      {/* Comprehensive Filter Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Project Filters</h2>
           </div>
           <button 
             onClick={() => {
                setSearchTerm('');
                setSearchOwner('');
                setFilterCountry([]);
                setFilterBudgetYear(settings.activeBudgetYear);
                setFilterDiscipline([]);
                setFilterAsset([]);
                setFilterStatus([]);
                setFilterPriority([]);
             }}
             className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
           >
             Reset All Filters
           </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MultiSelect label="Location" options={Object.values(Country)} selected={filterCountry} onChange={setFilterCountry} icon={MapPin} />
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget Year</label>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <select 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                value={filterBudgetYear}
                onChange={(e) => setFilterBudgetYear(Number(e.target.value))}
              >
                {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <MultiSelect label="Discipline" options={masterData.categories} selected={filterDiscipline} onChange={setFilterDiscipline} icon={Briefcase} />
          <MultiSelect label="Asset / Field" options={assetOptions} selected={filterAsset} onChange={setFilterAsset} icon={Database} />
          <MultiSelect label="Status" options={Object.values(Status)} selected={filterStatus} onChange={setFilterStatus} icon={Activity} />
          <MultiSelect label="Priority" options={PRIORITIES} selected={filterPriority} onChange={setFilterPriority} icon={AlertCircle} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Owner</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Owner name..." 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-sm py-2 pl-9 pr-4 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                value={searchOwner}
                onChange={(e) => setSearchOwner(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">General Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search code, name, AFE..." 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-sm py-2 pl-9 pr-4 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center">
            <div className="text-xs text-slate-500 font-medium">
               Found <span className="text-slate-800 dark:text-slate-200 font-bold">{filteredProjects.length}</span> projects
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-bold uppercase transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Download size={14} /> Export CSV
                </button>
                <Link to="/new" className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-bold uppercase shadow-sm hover:bg-blue-700 transition-all">
                  <PlusCircle size={14} /> New Project
                </Link>
            </div>
        </div>
      </div>

      {/* Table Component */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-widest border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 cursor-pointer group" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">Status {renderSortIcon('status')}</div>
                </th>
                <th className="px-6 py-4 text-center">Appr.</th>
                <th className="px-6 py-4 cursor-pointer group" onClick={() => handleSort('country')}>
                  <div className="flex items-center gap-1">Country {renderSortIcon('country')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer group" onClick={() => handleSort('code')}>
                  <div className="flex items-center gap-1">Code {renderSortIcon('code')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer group" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Project Name {renderSortIcon('name')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer group" onClick={() => handleSort('owner')}>
                  <div className="flex items-center gap-1">Owner {renderSortIcon('owner')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer group" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">Discipline {renderSortIcon('category')}</div>
                </th>
                <th className="px-6 py-4 text-right cursor-pointer group" onClick={() => handleSort('budgetYearVal')}>
                  <div className="flex items-center justify-end gap-1">Budget {filterBudgetYear} (kUSD) {renderSortIcon('budgetYearVal')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer group" onClick={() => handleSort('afeNumber')}>
                  <div className="flex items-center gap-1">AFE Number {renderSortIcon('afeNumber')}</div>
                </th>
                <th className="px-6 py-4 text-center">Comments</th>
                <th className="px-6 py-4 text-center">History</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedProjects.map((project) => (
                <tr 
                  key={project.id} 
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${STATUS_COLORS[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={(e) => handleGoToApproval(e, project.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="Quick Approval Access"
                    >
                      <CheckSquare size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center" title={project.country}>
                        {renderFlag(project.country)}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{project.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{project.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {project.owner.charAt(0)}
                       </div>
                       <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{project.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {calculateBudgetYearGross(project).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                    {project.afeNumber || '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={(e) => handleGoToApproval(e, project.id)}
                      className="relative inline-block hover:scale-110 transition-transform p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="View Comments"
                    >
                      <MessageSquare size={16} className={project.comments.length > 0 ? "text-slate-600 dark:text-slate-400" : "text-slate-200 dark:text-slate-700"} />
                      {project.comments.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 flex items-center justify-center text-[8px] font-black bg-blue-600 text-white rounded-full px-1 shadow-sm border border-white dark:border-slate-900">
                          {project.comments.length}
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={(e) => handleGoToApproval(e, project.id)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="View History"
                    >
                      <History size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       {isAdmin && (
                         <button 
                            onClick={(e) => handleDeleteProject(e, project)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors z-10"
                            title="Delete Project Permanently"
                         >
                           <Trash2 size={16} />
                         </button>
                       )}
                       <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedProjects.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-6 py-20 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                       <Search size={48} className="opacity-10" />
                       <p className="font-medium">No projects found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {filteredProjects.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
             <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
               <div className="flex items-center gap-2">
                 <span className="uppercase tracking-tighter">Rows:</span>
                 <select 
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-transparent border-none focus:ring-0 cursor-pointer text-slate-800 dark:text-slate-200"
                 >
                   <option value={25}>25</option>
                   <option value={50}>50</option>
                   <option value={100}>100</option>
                 </select>
               </div>
               <span className="hidden sm:inline-block uppercase tracking-tighter">
                 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProjects.length)} OF {filteredProjects.length}
               </span>
             </div>

             <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1 text-[10px] font-black mx-4 uppercase">
                   <span className="text-slate-800 dark:text-slate-200">PAGE {currentPage}</span>
                   <span className="text-slate-400">/ {totalPages}</span>
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};