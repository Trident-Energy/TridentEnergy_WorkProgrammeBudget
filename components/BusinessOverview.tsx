import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExpenseType, Country, Status, Project } from '../types';
import { Link } from 'react-router-dom';
import { DollarSign, Activity, PieChart as PieIcon, AlertCircle, TrendingUp, BarChart3, Layers, CalendarRange, ArrowRight, Eye, Calendar } from 'lucide-react';

// --- FLAGS COMPONENTS ---
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
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

export const BusinessOverview = () => {
  const { projects } = useApp();
  const currentYear = new Date().getFullYear();
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterBudgetYear, setFilterBudgetYear] = useState<number>(currentYear + 1);

  // --- FILTERING ---
  const filteredProjects = projects.filter(p => 
    (filterCountry === 'All' || p.country === filterCountry) &&
    p.budgetYear === filterBudgetYear
  );

  // --- KPI CALCULATIONS ---
  const safeVal = (v: any): number => Number(v) || 0;

  // 1. Total Budget (Q1-Q4)
  const totalBudget = filteredProjects.reduce((acc, p) => {
    return acc + safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
  }, 0);

  // 2. CAPEX vs OPEX Ratio (KPI)
  const capexBudget = filteredProjects
    .filter(p => p.expenseType === ExpenseType.CAPEX || p.expenseType === ExpenseType.MIX)
    .reduce((acc, p) => {
        const budget = safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
        return acc + (p.expenseType === ExpenseType.MIX ? budget * 0.5 : budget);
    }, 0);
  const capexRatio = totalBudget > 0 ? Math.round((capexBudget / totalBudget) * 100) : 0;

  // 3. Pending Approvals count
  const pendingApprovals = filteredProjects.filter(p => p.status === Status.Submitted || p.status === Status.CMApproved).length;

  // --- CHART DATA PREPARATION ---

  // A. Budget Maturity Pipeline
  const maturityData = {
    draft: 0,
    pending: 0,
    approved: 0
  };
  filteredProjects.forEach(p => {
    const val = safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
    if (p.status === Status.Draft || p.status === Status.Revision) maturityData.draft += val;
    else if (p.status === Status.Submitted || p.status === Status.CMApproved) maturityData.pending += val;
    else if (p.status === Status.CEOApproved) maturityData.approved += val;
  });
  const totalMaturity = maturityData.draft + maturityData.pending + maturityData.approved;

  // B. Multi-Year Forecast
  const multiYearData = filteredProjects.reduce((acc, p) => ({
    current: acc.current + safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4),
    y1: acc.y1 + safeVal(p.expenditures.y1),
    y2: acc.y2 + safeVal(p.expenditures.y2),
    y3: acc.y3 + safeVal(p.expenditures.y3)
  }), { current: 0, y1: 0, y2: 0, y3: 0 });

  const maxMultiYear = Math.max(multiYearData.current, multiYearData.y1, multiYearData.y2, multiYearData.y3) || 1;

  // C. Quarterly Split (CAPEX/OPEX)
  type QuarterKey = 'q1' | 'q2' | 'q3' | 'q4';
  const quarterlySplit: Record<QuarterKey, { capex: number; opex: number }> = {
    q1: { capex: 0, opex: 0 },
    q2: { capex: 0, opex: 0 },
    q3: { capex: 0, opex: 0 },
    q4: { capex: 0, opex: 0 }
  };
  filteredProjects.forEach(p => {
    (['q1', 'q2', 'q3', 'q4'] as QuarterKey[]).forEach(q => {
        const val = safeVal(p.expenditures[q]);
        const currentQ = quarterlySplit[q];
        if (p.expenseType === ExpenseType.CAPEX) {
            currentQ.capex = Number(currentQ.capex) + val;
        } else if (p.expenseType === ExpenseType.OPEX) {
            currentQ.opex = Number(currentQ.opex) + val;
        } else {
            currentQ.capex = Number(currentQ.capex) + (val / 2);
            currentQ.opex = Number(currentQ.opex) + (val / 2);
        }
    });
  });
  const maxQuarterTotal = Math.max(
    ...Object.values(quarterlySplit).map(q => q.capex + q.opex)
  ) || 1;

  // D. Regional Split
  const countryData: Record<string, number> = { [Country.BR]: 0, [Country.GQ]: 0, [Country.CG]: 0 };
  filteredProjects.forEach(p => {
    const total = safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
    if (countryData[p.country] !== undefined) {
      countryData[p.country] = (countryData[p.country] || 0) + total;
    }
  });

  // E. Top 5 Big Ticket Projects
  const topProjects = [...filteredProjects].sort((a, b) => {
    const costA = (Object.values(a.expenditures) as number[]).reduce((sum, v) => sum + safeVal(v), 0);
    const costB = (Object.values(b.expenditures) as number[]).reduce((sum, v) => sum + safeVal(v), 0);
    return costB - costA;
  }).slice(0, 5);

  // F. Category Data
  const categoryData: Record<string, number> = {};
  filteredProjects.forEach(p => {
    const total = safeVal(p.expenditures.q1) + safeVal(p.expenditures.q2) + safeVal(p.expenditures.q3) + safeVal(p.expenditures.q4);
    categoryData[p.category] = (categoryData[p.category] || 0) + total;
  });
  const sortedCategories = Object.entries(categoryData).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCategory = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

  const renderFlag = (country: Country) => {
    switch (country) {
        case Country.BR: return <FlagBR size="w-6 h-6" />;
        case Country.GQ: return <FlagGQ size="w-6 h-6" />;
        case Country.CG: return <FlagCG size="w-6 h-6" />;
        default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row items-center justify-between sticky top-0 z-10 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider hidden md:inline">Filter View</span>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
              <button 
                  onClick={() => setFilterCountry('All')}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filterCountry === 'All' ? 'bg-slate-800 text-white shadow-md dark:bg-slate-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}`}
              >
                  All Locations
              </button>
              
              <div className="flex items-center gap-6 justify-center w-full md:w-auto">
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
          
          <div className="flex items-center gap-6 w-full xl:w-auto justify-end">
             {/* Year Selector */}
             <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
                <Calendar size={16} className="text-slate-400" />
                <select 
                  className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  value={filterBudgetYear}
                  onChange={(e) => setFilterBudgetYear(Number(e.target.value))}
                >
                  {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2, currentYear + 3].map(year => (
                    <option key={year} value={year}>Budget {year}</option>
                  ))}
                </select>
             </div>

             <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap">
                View: <span className="font-bold text-slate-800 dark:text-slate-200">{filterCountry === 'All' ? 'Consolidated' : filterCountry}</span>
             </div>
          </div>
      </div>
      
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title={`Total Budget (${filterBudgetYear})`} 
          value={`${(totalBudget / 1000).toFixed(1)}M`} 
          subtext="kUSD Gross Expenditure"
          icon={DollarSign}
          color="bg-blue-600"
        />
        <KPICard 
          title="CAPEX Intensity" 
          value={`${capexRatio}%`} 
          subtext={`vs ${100 - capexRatio}% OPEX`}
          icon={PieIcon}
          color="bg-purple-600"
        />
        <KPICard 
          title="Active Projects" 
          value={filteredProjects.length} 
          subtext={filterCountry === 'All' ? "Across all regions" : `In ${filterCountry}`}
          icon={Activity}
          color="bg-emerald-500"
        />
        <KPICard 
          title="Pending Approval" 
          value={pendingApprovals} 
          subtext="Bottleneck in workflow"
          icon={AlertCircle}
          color="bg-amber-500"
        />
      </div>

      {/* 1. Budget Maturity Pipeline (Value at Risk) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers size={20} className="text-slate-400"/> 
                Budget Maturity Pipeline
            </h3>
            <span className="text-xs text-slate-500">Value at Risk (kUSD)</span>
        </div>
        
        {totalMaturity > 0 ? (
            <div className="space-y-4">
                <div className="h-12 w-full flex rounded-lg overflow-hidden font-bold text-white text-xs shadow-inner">
                    <div className="bg-slate-300 dark:bg-slate-700 flex items-center justify-center transition-all duration-500 relative group" style={{ width: `${(maturityData.draft / totalMaturity) * 100}%` }}>
                       <span className="z-10 group-hover:scale-110 transition-transform">DRAFT</span>
                       <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="bg-amber-400 dark:bg-amber-600 flex items-center justify-center transition-all duration-500 relative group" style={{ width: `${(maturityData.pending / totalMaturity) * 100}%` }}>
                       <span className="z-10 group-hover:scale-110 transition-transform">PENDING</span>
                       <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center transition-all duration-500 relative group" style={{ width: `${(maturityData.approved / totalMaturity) * 100}%` }}>
                        <span className="z-10 group-hover:scale-110 transition-transform">APPROVED</span>
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                
                <div className="flex justify-between text-center px-1">
                    <div className="flex flex-col items-start" style={{ width: '33%' }}>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-300">{maturityData.draft.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 uppercase font-semibold">Potential (Draft)</span>
                    </div>
                    <div className="flex flex-col items-center" style={{ width: '33%' }}>
                        <span className="text-lg font-bold text-amber-500">{maturityData.pending.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 uppercase font-semibold">In Review</span>
                    </div>
                    <div className="flex flex-col items-end" style={{ width: '33%' }}>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{maturityData.approved.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 uppercase font-semibold">Committed</span>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-20 flex items-center justify-center text-slate-400 italic bg-slate-50 dark:bg-slate-800 rounded">No budget data initialized.</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. CAPEX vs OPEX per Quarter (Stacked Bar) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <TrendingUp size={20} className="text-slate-400"/> 
                    Quarterly Expenditure (CAPEX vs OPEX)
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> CAPEX
                    </div>
                    <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                        <div className="w-3 h-3 bg-purple-500 rounded-sm"></div> OPEX
                    </div>
                </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-8 px-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                {(['q1', 'q2', 'q3', 'q4'] as QuarterKey[]).map((q) => {
                    const capex = quarterlySplit[q].capex;
                    const opex = quarterlySplit[q].opex;
                    const total = capex + opex;
                    const totalHeightPct = (total / maxQuarterTotal) * 100;
                    const capexHeightPct = total > 0 ? (capex / total) * 100 : 0;
                    const opexHeightPct = total > 0 ? (opex / total) * 100 : 0;

                    return (
                        <div key={q} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div className="w-full sm:w-16 flex flex-col-reverse rounded-t-sm overflow-hidden relative transition-all hover:opacity-90" style={{ height: `${Math.max(totalHeightPct, 1)}%` }}>
                                {/* OPEX Segment */}
                                <div className="bg-purple-500 w-full transition-all relative group/segment" style={{ height: `${opexHeightPct}%` }}>
                                   {opex > 0 && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white opacity-0 group-hover/segment:opacity-100">{Math.round(opex/1000)}M</span>}
                                </div>
                                {/* CAPEX Segment */}
                                <div className="bg-blue-500 w-full transition-all relative group/segment border-b border-blue-600/20" style={{ height: `${capexHeightPct}%` }}>
                                   {capex > 0 && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white opacity-0 group-hover/segment:opacity-100">{Math.round(capex/1000)}M</span>}
                                </div>
                            </div>
                            {/* Tooltip for total */}
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-20 pointer-events-none whitespace-nowrap">
                                Total: {total.toLocaleString()} kUSD
                            </div>
                            <span className="mt-3 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">{q}</span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Regional Split Donut */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <PieIcon size={20} className="text-slate-400"/> 
                    Regional Split
                </h3>
            </div>
            
            <div className="flex flex-col gap-6">
                {Object.entries(countryData).filter(([_, val]) => val > 0 || filterCountry === 'All').map(([country, val]) => {
                    const percentage = totalBudget > 0 ? (val / totalBudget) * 100 : 0;
                    const color = country === Country.BR ? 'bg-green-600' : country === Country.GQ ? 'bg-blue-600' : 'bg-yellow-500';
                    return (
                        <div key={country} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{country}</span>
                                <span className="text-slate-500 dark:text-slate-400">{val.toLocaleString()} kUSD ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${color}`} 
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
                 {totalBudget === 0 && (
                    <div className="text-center text-slate-400 py-8 italic">No financial data available for this view.</div>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
        {/* 3. Multi-Year Forecast */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CalendarRange size={20} className="text-slate-400"/> 
                    Long-term Outlook (Multi-Year)
                </h3>
            </div>
            <div className="h-56 flex items-end gap-6 px-2">
                {[
                    { label: filterBudgetYear.toString(), val: multiYearData.current, highlight: true },
                    { label: (filterBudgetYear + 1).toString(), val: multiYearData.y1, highlight: false },
                    { label: (filterBudgetYear + 2).toString(), val: multiYearData.y2, highlight: false },
                    { label: (filterBudgetYear + 3).toString(), val: multiYearData.y3, highlight: false }
                ].map((item, idx) => {
                    const height = (item.val / maxMultiYear) * 100;
                    return (
                        <div key={idx} className="flex-1 flex flex-col justify-end group h-full">
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.val.toLocaleString()}
                                </span>
                                <div 
                                    className={`w-full rounded-t-md transition-all relative ${item.highlight ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'}`}
                                    style={{ height: `${Math.max(height, 2)}%` }}
                                ></div>
                                <span className={`mt-3 text-sm font-bold ${item.highlight ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {item.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <BarChart3 size={20} className="text-slate-400"/> 
                    Top Spending Categories
                </h3>
            </div>
            <div className="space-y-5">
                {sortedCategories.map(([cat, val]) => {
                    const widthPct = maxCategory > 0 ? (val / maxCategory) * 100 : 0;
                    return (
                        <div key={cat} className="group">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                                <span className="text-slate-500 dark:text-slate-400 font-mono">{val.toLocaleString()} kUSD</span>
                            </div>
                            <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-r-full h-4 overflow-hidden flex">
                                <div 
                                    className="h-full bg-indigo-500 rounded-r-full group-hover:bg-indigo-600 transition-all duration-500" 
                                    style={{ width: `${widthPct}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
                 {sortedCategories.length === 0 && (
                    <div className="text-center text-slate-400 py-4 italic">No categories found.</div>
                )}
            </div>
        </div>
      </div>

      {/* 4. Top 5 "Big Ticket" Projects Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Activity size={20} className="text-slate-500"/>
                Top 5 "Big Ticket" Projects
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">By Total Cost</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-xs border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-6 py-3 w-16 text-center">Rank</th>
                        <th className="px-6 py-3">Project Name</th>
                        <th className="px-6 py-3">Country</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Total Value (kUSD)</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {topProjects.map((project, index) => {
                        const totalCost = (Object.values(project.expenditures) as number[]).reduce((a, b) => a + safeVal(b), 0);
                        return (
                            <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-center font-bold text-slate-400">#{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                                    {project.name}
                                    <div className="text-xs text-slate-400 font-normal mt-0.5">{project.code}</div>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center" title={project.country}>
                                        {renderFlag(project.country)}
                                     </div>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`text-[10px] px-2 py-1 rounded border ${
                                         project.status === Status.CEOApproved ? 'bg-green-100 text-green-800 border-green-200' : 
                                         project.status === Status.Draft ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'
                                     }`}>
                                         {project.status}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {totalCost.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link 
                                        to={`/project/${project.id}`}
                                        className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800 rounded-full transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
                                        title="View Project Details"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                    {topProjects.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-6 text-slate-400">No projects available.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};