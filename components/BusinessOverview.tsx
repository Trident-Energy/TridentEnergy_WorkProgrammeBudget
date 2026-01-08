
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ExpenseType, Country, Status, Project } from '../types';
import { PRIORITIES, STATUS_COLORS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Activity, PieChart as PieIcon, TrendingUp, BarChart3, Layers, CalendarRange, Calendar, Filter, MapPin, Tag, ShieldCheck, Briefcase, ExternalLink, ArrowRight, Trophy } from 'lucide-react';

// --- FLAGS COMPONENTS ---
const FlagBR = ({ size = "w-5 h-5" }: { size?: string }) => (
  <svg viewBox="0 0 32 32" className={`${size} rounded-full shadow-sm object-cover border border-slate-100 dark:border-slate-700`}>
    <rect width="32" height="32" fill="#009c3b" />
    <path d="M16 4 L28 16 L16 28 L4 16 Z" fill="#ffdf00" />
    <circle cx="16" cy="16" r="6" fill="#002776" />
    <path d="M10 16 Q 16 20 22 16" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.8" />
  </svg>
);

const FlagGQ = ({ size = "w-5 h-5" }: { size?: string }) => (
  <svg viewBox="0 0 32 32" className={`${size} rounded-full shadow-sm object-cover border border-slate-100 dark:border-slate-700`}>
    <rect y="0" width="32" height="11" fill="#3e9a00" />
    <rect y="11" width="32" height="10" fill="#ffffff" />
    <rect y="21" width="32" height="11" fill="#e32118" />
    <path d="M0 0 L10 16 L0 32 Z" fill="#0073ce" />
    <path d="M13 12 H19 V16 C19 18.5 16 19.5 16 19.5 C16 19.5 13 18.5 13 16 V12 Z" fill="#e2e8f0" />
    <path d="M16 13 L17 16 H16.5 V17.5 H15.5 V16 H15 L16 13 Z" fill="#3e9a00" />
  </svg>
);

const FlagCG = ({ size = "w-5 h-5" }: { size?: string }) => (
  <svg viewBox="0 0 32 32" className={`${size} rounded-full shadow-sm object-cover border border-slate-100 dark:border-slate-700`}>
    <rect width="32" height="32" fill="#fbde4a" />
    <path d="M0 0 L22 0 L0 22 Z" fill="#009543" />
    <path d="M32 32 L10 32 L32 10 Z" fill="#dc241f" />
  </svg>
);

const renderFlag = (country: Country) => {
  switch (country) {
    case Country.BR: return <FlagBR />;
    case Country.GQ: return <FlagGQ />;
    case Country.CG: return <FlagCG />;
    default: return null;
  }
};

// --- KPI CARD COMPONENT ---
interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
  </div>
);

// --- VERTICAL COLUMN CHART COMPONENT ---
const ColumnChart: React.FC<{ data: { label: string, value: number }[], max: number, color: string }> = ({ data, max, color }) => (
  <div className="flex items-end justify-between h-48 gap-2 pt-4">
    {data.map((item, idx) => {
      const height = max > 0 ? (item.value / max) * 100 : 0;
      return (
        <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
          <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold bg-slate-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
              {item.value.toLocaleString()}
            </span>
          </div>
          <div 
            className={`w-full rounded-t-sm transition-all duration-500 ${color} opacity-80 group-hover:opacity-100 group-hover:shadow-lg`} 
            style={{ height: `${Math.max(height, 2)}%` }}
          ></div>
          <span className="text-[10px] font-bold text-slate-500 mt-3 uppercase tracking-tighter truncate w-full text-center">
            {item.label}
          </span>
        </div>
      );
    })}
  </div>
);

// --- HORIZONTAL BAR COMPONENT ---
const HorizontalBar: React.FC<{ label: string, value: number, max: number, total: number, color: string }> = ({ label, value, max, total, color }) => {
  const width = max > 0 ? (value / max) * 100 : 0;
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-bold text-slate-700 dark:text-slate-300 truncate pr-2">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-900 dark:text-slate-100 font-mono font-bold">{value.toLocaleString()} <span className="text-[10px] text-slate-400">kUSD</span></span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-black">{percentage}%</span>
        </div>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${color}`} 
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

export const BusinessOverview = () => {
  const { projects, settings, masterData } = useApp();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  // --- FILTER STATES ---
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterBudgetYear, setFilterBudgetYear] = useState<number>(settings.activeBudgetYear);
  const [filterAsset, setFilterAsset] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // --- DYNAMIC FILTER OPTIONS ---
  const assetOptions = useMemo(() => {
    if (filterCountry === 'All') {
      const allAssets = Object.values(masterData.concessions).flat();
      return ['All', ...Array.from(new Set(allAssets)).sort()];
    }
    return ['All', ...(masterData.concessions[filterCountry as Country] || []).sort()];
  }, [filterCountry, masterData.concessions]);

  const priorityOptions = ['All', ...PRIORITIES];
  const statusOptions = ['All', ...Object.values(Status)];

  // --- FILTERING LOGIC ---
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesCountry = filterCountry === 'All' || p.country === filterCountry;
      const matchesYear = p.budgetYear === filterBudgetYear;
      const matchesAsset = filterAsset === 'All' || p.concession === filterAsset;
      const matchesPriority = filterPriority === 'All' || p.priority === filterPriority;
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      
      return matchesCountry && matchesYear && matchesAsset && matchesPriority && matchesStatus;
    });
  }, [projects, filterCountry, filterBudgetYear, filterAsset, filterPriority, filterStatus]);

  // --- CALCULATIONS ---
  const safeVal = (v: any): number => Number(v) || 0;

  // 1. Total Budget (N) for filtered set
  // Fix: Explicitly type accumulator as number to prevent 'unknown' inference error.
  const totalBudgetN = filteredProjects.reduce((acc: number, p) => {
    return acc + safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
  }, 0);

  // 2. Total Lifecycle Cost for filtered set
  // Fix: Explicitly type accumulator as number to prevent 'unknown' inference error.
  const totalLifecycleCost = filteredProjects.reduce((acc: number, p) => {
    const e = p.expenditures;
    return acc + safeVal(e.prior) + safeVal(e.current) + safeVal(e.q1) + safeVal(e.q2) + safeVal(e.q3) + safeVal(e.q4) +
                 safeVal(e.y1) + safeVal(e.y2) + safeVal(e.y3) + safeVal(e.y4);
  }, 0);

  // 3. Number of Projects
  const projectCount = filteredProjects.length;

  // --- TOP 10 PROJECTS FOR BUDGET YEAR ---
  const top10Projects = useMemo(() => {
    return [...filteredProjects]
      .sort((a, b) => {
        const valA = safeVal(a.expenditures.q1) + safeVal(a.expenditures.q2) + safeVal(a.expenditures.q3) + safeVal(a.expenditures.q4);
        const valB = safeVal(b.expenditures.q1) + safeVal(b.expenditures.q2) + safeVal(b.expenditures.q3) + safeVal(b.expenditures.q4);
        return valB - valA;
      })
      .slice(0, 10);
  }, [filteredProjects]);

  // --- CHART DATA PREPARATION ---

  // A. Quarterly Split
  const quarterlyData = [
    { label: 'Q1', value: filteredProjects.reduce((acc, p) => acc + safeVal(p.expenditures.q1), 0) },
    { label: 'Q2', value: filteredProjects.reduce((acc, p) => acc + safeVal(p.expenditures.q2), 0) },
    { label: 'Q3', value: filteredProjects.reduce((acc, p) => acc + safeVal(p.expenditures.q3), 0) },
    { label: 'Q4', value: filteredProjects.reduce((acc, p) => acc + safeVal(p.expenditures.q4), 0) }
  ];
  const maxQuarter = Math.max(...quarterlyData.map(d => d.value), 1);

  // B. Long-term Outlook (N to N+4)
  const outlookData = [
    { label: filterBudgetYear.toString(), value: totalBudgetN },
    { label: (filterBudgetYear + 1).toString(), value: filteredProjects.reduce((acc, p) => acc + safeVal(p.expenditures.y1), 0) },
    { label: (filterBudgetYear + 2).toString(), value: filteredProjects.reduce((acc, p) => acc + safeVal(p.expenditures.y2), 0) },
    { label: (filterBudgetYear + 3).toString(), value: filteredProjects.reduce((acc, p) => acc + safeVal(p.expenditures.y3), 0) },
    { label: (filterBudgetYear + 4).toString(), value: filteredProjects.reduce((acc, p) => acc + safeVal(p.expenditures.y4), 0) }
  ];
  const maxOutlook = Math.max(...outlookData.map(d => d.value), 1);

  // C. Expenses by Asset / Field
  const assetMap: Record<string, number> = {};
  filteredProjects.forEach(p => {
    const val = safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
    assetMap[p.concession] = (assetMap[p.concession] || 0) + val;
  });
  const assetChartData = Object.entries(assetMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const maxAsset = Math.max(...assetChartData.map(d => d.value), 1);

  // D. Expenses by Discipline (Department/Category)
  const categoryMap: Record<string, number> = {};
  filteredProjects.forEach(p => {
    const val = safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
    categoryMap[p.category] = (categoryMap[p.category] || 0) + val;
  });
  const categoryChartData = Object.entries(categoryMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const maxCategory = Math.max(...categoryChartData.map(d => d.value), 1);

  return (
    <div className="space-y-8 pb-16">
      {/* --- FILTER PANEL --- */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Analytics Dashboard Filters</h2>
          </div>
          <button onClick={() => { setFilterCountry('All'); setFilterBudgetYear(settings.activeBudgetYear); setFilterAsset('All'); setFilterPriority('All'); setFilterStatus('All'); }} className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-tighter">Reset All</button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><MapPin size={10} /> Location</label>
            <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 focus:ring-1 focus:ring-blue-500 outline-none dark:text-white" value={filterCountry} onChange={(e) => { setFilterCountry(e.target.value); setFilterAsset('All'); }}>
              <option value="All">All Countries</option>
              {Object.values(Country).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar size={10} /> Budget Year</label>
            <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 focus:ring-1 focus:ring-blue-500 outline-none dark:text-white" value={filterBudgetYear} onChange={(e) => setFilterBudgetYear(Number(e.target.value))}>
              {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Layers size={10} /> Asset / Field</label>
            <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 focus:ring-1 focus:ring-blue-500 outline-none dark:text-white" value={filterAsset} onChange={(e) => setFilterAsset(e.target.value)}>
              {assetOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Tag size={10} /> Priority</label>
            <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 focus:ring-1 focus:ring-blue-500 outline-none dark:text-white" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              {priorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><ShieldCheck size={10} /> Status</label>
            <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 focus:ring-1 focus:ring-blue-500 outline-none dark:text-white" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      {/* --- SUMMARY SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title={`Total Budget (${filterBudgetYear})`} 
          value={`${totalBudgetN.toLocaleString()} kUSD`} 
          subtext="Annual Gross Expenditure"
          icon={Calendar}
          color="bg-blue-600"
        />
        <KPICard 
          title="Total Cost (kUSD)" 
          value={totalLifecycleCost.toLocaleString()} 
          subtext="Full Project Lifecycle Cost"
          icon={DollarSign}
          color="bg-indigo-600"
        />
        <KPICard 
          title="Number of Projects" 
          value={projectCount} 
          subtext="Matching Active Filters"
          icon={Activity}
          color="bg-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- FINANCIAL OVERVIEW: QUARTERLY --- */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg"><CalendarRange size={18} className="text-blue-600" /></div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Quarterly Expenditures (kUSD)</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase">{filterBudgetYear} Cycle</span>
          </div>
          <ColumnChart data={quarterlyData} max={maxQuarter} color="bg-blue-500" />
        </div>

        {/* --- FINANCIAL OVERVIEW: LONG-TERM --- */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg"><TrendingUp size={18} className="text-indigo-600" /></div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Long-term Outlook (kUSD)</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase">N to N+4</span>
          </div>
          <ColumnChart data={outlookData} max={maxOutlook} color="bg-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- EXPENSES BY ASSET --- */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg"><Layers size={18} className="text-emerald-600" /></div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Expenses by Asset / Field</h3>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Values in kUSD</span>
            </div>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {assetChartData.map((d, idx) => (
              <HorizontalBar key={idx} label={d.label} value={d.value} max={maxAsset} total={totalBudgetN} color="bg-emerald-500" />
            ))}
            {assetChartData.length === 0 && <div className="py-20 text-center text-slate-400 italic text-sm">No asset data matching filters.</div>}
          </div>
        </div>

        {/* --- EXPENSES BY DISCIPLINE --- */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg"><Briefcase size={18} className="text-amber-600" /></div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Expenses by Discipline</h3>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Values in kUSD</span>
            </div>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {categoryChartData.map((d, idx) => (
              <HorizontalBar key={idx} label={d.label} value={d.value} max={maxCategory} total={totalBudgetN} color="bg-amber-500" />
            ))}
            {categoryChartData.length === 0 && <div className="py-20 text-center text-slate-400 italic text-sm">No discipline data matching filters.</div>}
          </div>
        </div>
      </div>

      {/* --- TOP 10 PROJECTS TABLE --- */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md"><Trophy size={18} /></div>
            <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-sm">Top 10 Projects — Budget Year {filterBudgetYear}</h3>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Sorted by Selected Year Expenditure</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold text-[10px] tracking-widest border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-center w-16 uppercase">Rank</th>
                <th className="px-6 py-4 uppercase">Country</th>
                <th className="px-6 py-4 uppercase">Project Identity</th>
                <th className="px-6 py-4 text-right uppercase">Budget {filterBudgetYear} (kUSD)</th>
                <th className="px-6 py-4 text-right uppercase">Total Cost (kUSD)</th>
                <th className="px-6 py-4 text-center uppercase">Add. Reserves</th>
                <th className="px-6 py-4 text-center uppercase">Init. Before</th>
                <th className="px-6 py-4 uppercase">Status</th>
                <th className="px-6 py-4 text-center uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {top10Projects.map((p, idx) => {
                const yearBudget = safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
                // Fix: Explicitly type accumulator as number to prevent 'unknown' inference error.
                const totalCost = Object.values(p.expenditures).reduce((acc: number, val) => acc + safeVal(val), 0);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 text-center font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" title={p.country}>
                        {renderFlag(p.country)}
                        <span className="text-[10px] font-bold text-slate-500">{p.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight mb-0.5">{p.name}</span>
                        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter">{p.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {yearBudget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-500 dark:text-slate-400">
                      {totalCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${p.additionalReserves ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        {p.additionalReserves ? 'Y' : 'N'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${p.initiatedBefore ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        {p.initiatedBefore ? 'Y' : 'N'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest whitespace-nowrap ${STATUS_COLORS[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="View Project Form"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {top10Projects.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-slate-400 italic">
                    No project data matches current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {top10Projects.length > 0 && (
          <div className="px-8 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 text-right">
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 ml-auto hover:gap-3 transition-all"
            >
              View Full Dashboard <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
