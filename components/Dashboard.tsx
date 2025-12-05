import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { STATUS_COLORS, CATEGORIES } from '../constants';
import { Country, Status, Role } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, MessageSquare, ChevronRight, Download, UserCircle, ChevronLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Flag Components - Defined outside to prevent re-renders
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
    <rect y="21" width="32" height="11" fill="#e32118" />
    <path d="M0 0 L10 16 L0 32 Z" fill="#0073ce" />
    {/* Coat of Arms */}
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
  const { projects, currentUser } = useApp();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterBudgetYear, setFilterBudgetYear] = useState<number>(currentYear + 1);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCountry, filterCategory, filterBudgetYear]);

  // Logic: Total Cost Calculation
  const calculateTotalCost = (p: any) => {
    return Object.values(p.expenditures).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
  };
  
  const calculateBudgetYearGross = (p: any) => {
    const e = p.expenditures;
    return (Number(e.q1) || 0) + (Number(e.q2) || 0) + (Number(e.q3) || 0) + (Number(e.q4) || 0);
  };

  // 1. Permission Based Filtering
  const accessibleProjects = projects.filter(p => {
    if (currentUser.role === Role.Admin || currentUser.role === Role.CEO) return true;
    return p.country === currentUser.country;
  });

  // 2. User Controls Filtering
  const filteredProjects = accessibleProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = filterCountry === 'All' || p.country === filterCountry;
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesYear = p.budgetYear === filterBudgetYear;
    return matchesSearch && matchesCountry && matchesCategory && matchesYear;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const getRoleTag = (project: any) => {
    if (project.owner === currentUser.name) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">OWNER</span>;
    }
    if (project.reviewers.includes(currentUser.name)) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">REVIEWER</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">VIEWER</span>;
  };

  const renderFlag = (country: Country) => {
    switch (country) {
      case Country.BR: return <FlagBR size="w-6 h-6" />;
      case Country.GQ: return <FlagGQ size="w-6 h-6" />;
      case Country.CG: return <FlagCG size="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm items-center transition-colors">
        
        {/* Location Filter Bar */}
        <div className="flex items-center gap-6 pr-6 border-r border-slate-200 dark:border-slate-700 mr-2">
            <button 
                onClick={() => setFilterCountry('All')}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filterCountry === 'All' ? 'bg-slate-800 text-white shadow-md dark:bg-slate-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}`}
            >
                All Locations
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-6">
                <button onClick={() => setFilterCountry(Country.BR)} className={`flex flex-col items-center gap-1 transition-all ${filterCountry === Country.BR ? 'opacity-100 scale-110' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-70'}`}>
                    <FlagBR />
                    <span className={`text-[10px] font-bold tracking-wide ${filterCountry === Country.BR ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>BR</span>
                </button>
                <button onClick={() => setFilterCountry(Country.GQ)} className={`flex flex-col items-center gap-1 transition-all ${filterCountry === Country.GQ ? 'opacity-100 scale-110' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-70'}`}>
                    <FlagGQ />
                    <span className={`text-[10px] font-bold tracking-wide ${filterCountry === Country.GQ ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>GQ</span>
                </button>
                <button onClick={() => setFilterCountry(Country.CG)} className={`flex flex-col items-center gap-1 transition-all ${filterCountry === Country.CG ? 'opacity-100 scale-110' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-70'}`}>
                    <FlagCG />
                    <span className={`text-[10px] font-bold tracking-wide ${filterCountry === Country.CG ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>CG</span>
                </button>
            </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center flex-1 w-full xl:w-auto">
          {/* Budget Year Filter */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <select 
              className="border border-slate-300 dark:border-slate-700 rounded-md text-sm py-2 pl-2 pr-8 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-950 dark:text-white font-medium"
              value={filterBudgetYear}
              onChange={(e) => setFilterBudgetYear(Number(e.target.value))}
            >
              {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => (
                <option key={year} value={year}>Budget {year}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 xl:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full xl:w-64 pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="border border-slate-300 dark:border-slate-700 rounded-md text-sm py-2 pl-2 pr-8 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-950 dark:text-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors border border-slate-200 whitespace-nowrap dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
          <Download size={16} />
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">My Role</th>
                <th className="px-6 py-4">Project Code</th>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4 text-right">Total Cost (kUSD)</th>
                <th className="px-6 py-4 text-right">Budget {filterBudgetYear} (kUSD)</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4 text-center">COMMENTS</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedProjects.map((project) => (
                <tr 
                  key={project.id} 
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center" title={project.country}>
                        {renderFlag(project.country)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleTag(project)}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400 font-medium">{project.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{project.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <UserCircle size={16} className="text-slate-400 dark:text-slate-500"/> {project.owner}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">{calculateTotalCost(project).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono text-blue-600 dark:text-blue-400 font-medium">{calculateBudgetYearGross(project).toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{format(new Date(project.startDate), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative inline-block">
                      <MessageSquare size={18} className={project.comments.length > 0 ? "text-slate-600 dark:text-slate-400" : "text-slate-300 dark:text-slate-600"} />
                      {project.comments.length > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full px-1 shadow-sm border border-white dark:border-slate-900">
                          {project.comments.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} />
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedProjects.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No projects found for Budget Year {filterBudgetYear}.
                    <button 
                       onClick={() => setFilterBudgetYear(currentYear)} 
                       className="block mx-auto mt-2 text-blue-600 hover:underline text-xs"
                    >
                       Check Current Year ({currentYear})
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {filteredProjects.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
             <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
               <div className="flex items-center gap-2">
                 <span>Rows per page:</span>
                 <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page
                    }}
                    className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-800 focus:ring-blue-500 focus:outline-none dark:text-slate-200"
                 >
                   <option value={25}>25</option>
                   <option value={50}>50</option>
                   <option value={100}>100</option>
                 </select>
               </div>
               <span className="hidden sm:inline-block">
                 Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
               </span>
             </div>

             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-300"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-300"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};