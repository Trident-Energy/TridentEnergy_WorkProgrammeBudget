
import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { LayoutDashboard, PieChart, Moon, Sun, Settings, BookOpen, Database, AlertTriangle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, switchUser, users, theme, toggleTheme, settings } = useApp();
  const location = useLocation();

  // Updated active state to match the new brand background color for better contrast/blending
  const isActive = (path: string) => location.pathname === path ? 'bg-[#1e2d3d] text-white shadow-inner' : 'text-slate-300 hover:text-white hover:bg-[#324b64]';

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden print:h-auto print:overflow-visible transition-colors duration-200">
      
      {/* Global Announcement Banner */}
      {settings.systemMessage && (
        <div className="bg-amber-500 text-white px-4 py-2 text-sm font-bold text-center shadow-md z-40 flex items-center justify-center gap-2 animate-in slide-in-from-top-full duration-300">
          <AlertTriangle size={16} className="fill-white text-amber-500" />
          {settings.systemMessage}
        </div>
      )}

      {/* Top Header Wrapper - Brand Background */}
      <div className="bg-brand text-white z-30 shrink-0 no-print shadow-md flex flex-col">
        
        {/* Top Navigation Bar: Logo, Title, Global Actions */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <img 
                src="https://www.trident-energy.com/app/themes/trident-energy/dist/images/favicon.png?id=2e0b14e50770eab630923c46b052a708" 
                alt="Trident Energy Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-xl tracking-tight text-slate-100">Work Plan & Budget</span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            
             {/* Theme Toggle */}
             <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-300 hover:text-white bg-[#324b64] hover:bg-[#3e5d7c] rounded-full transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Control Panel */}
            <div className="flex items-center gap-6 pl-4 border-l border-[#3e5d7c]">
              <div className="flex items-center gap-2">
                 <span className="text-xs uppercase text-slate-400 font-semibold hidden lg:block">Log in as:</span>
                 <select 
                  className="bg-[#1e2d3d] border-none text-sm rounded px-3 py-1 text-slate-300 focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[150px]"
                  value={currentUser.id}
                  onChange={(e) => switchUser(e.target.value)}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none text-slate-100">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{currentUser.country} - {currentUser.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-inner text-white border border-[#3e5d7c]">
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Bar (Menu Items) */}
        <div className="px-6 py-1 border-t border-[#3e5d7c] flex justify-between items-center">
           <nav className="flex items-center gap-1">
               <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive('/')}`}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/overview" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive('/overview')}`}>
                <PieChart size={18} />
                <span>Business Overview</span>
              </Link>
              <Link to="/guide" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive('/guide')}`}>
                <BookOpen size={18} />
                <span>User Guide</span>
              </Link>
              {currentUser.role === Role.Admin && (
                 <Link to="/admin" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive('/admin')}`}>
                  <Settings size={18} />
                  <span>Admin</span>
                </Link>
              )}
           </nav>
           
           {/* Environment Indicator */}
           <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded bg-[#1e2d3d] border border-[#3e5d7c] text-[10px] text-slate-400 select-none">
              <Database size={10} className="text-emerald-400" />
              <span>DATA SOURCE: LOCAL MOCK</span>
           </div>
        </div>
      </div>

      {/* Sub Header for Page Context */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-8 shadow-sm z-20 shrink-0 flex items-center justify-between no-print transition-colors">
         <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {location.pathname === '/' ? 'Project Overview' : 
             location.pathname === '/overview' ? 'Business Intelligence' :
             location.pathname === '/admin' ? 'Administration' :
             location.pathname === '/guide' ? 'Deployment & Training Guide' :
             location.pathname === '/new' ? 'New Project' : 'Project Detail'}
          </h1>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
             Active Budget Cycle: <span className="text-blue-600 dark:text-blue-400">{settings.activeBudgetYear}</span>
          </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 md:p-8 lg:p-10 print:overflow-visible print:h-auto print:p-0">
        <div className="w-full mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
};
