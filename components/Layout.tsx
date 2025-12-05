import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { LayoutDashboard, PlusCircle, Briefcase, PieChart, Moon, Sun, Users, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, switchUser, users, theme, toggleTheme } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-slate-800 text-white dark:bg-slate-700' : 'text-slate-300 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-700';

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden print:h-auto print:overflow-visible transition-colors duration-200">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between px-6 py-3 shadow-md z-30 shrink-0 no-print border-b border-slate-800">
        <div className="flex items-center gap-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-100">WPB Manager</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
             <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive('/')}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/overview" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive('/overview')}`}>
              <PieChart size={18} />
              <span>Business Overview</span>
            </Link>
            {currentUser.role === Role.Admin && (
               <Link to="/admin" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive('/admin')}`}>
                <Settings size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          
           {/* Theme Toggle */}
           <button 
            onClick={toggleTheme} 
            className="p-2 text-slate-400 hover:text-white bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 rounded-full transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* New Project Button - Prominent CTA */}
          <Link 
            to="/new" 
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all shadow-md hover:shadow-lg text-sm font-bold border border-blue-500"
          >
            <PlusCircle size={18} />
            <span>New Project</span>
          </Link>

          {/* User Control Panel (For Demo) */}
          <div className="flex items-center gap-6 pl-4 border-l border-slate-700">
            <div className="flex items-center gap-2">
               <span className="text-xs uppercase text-slate-500 font-semibold hidden lg:block">Log in as:</span>
               <select 
                className="bg-slate-800 border-none text-sm rounded px-3 py-1 text-slate-300 focus:ring-1 focus:ring-blue-500 cursor-pointer dark:bg-slate-900 max-w-[150px]"
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
                <p className="text-sm font-medium leading-none text-slate-200">{currentUser.name}</p>
                <p className="text-xs text-slate-400 mt-1">{currentUser.country} - {currentUser.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-inner text-white">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sub Header for Page Context */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-8 shadow-sm z-20 shrink-0 flex items-center justify-between no-print transition-colors">
         <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {location.pathname === '/' ? 'Project Overview' : 
             location.pathname === '/overview' ? 'Business Intelligence' :
             location.pathname === '/admin' ? 'Administration' :
             location.pathname === '/new' ? 'New Project' : 'Project Detail'}
          </h1>
          <div className="text-sm text-slate-500 dark:text-slate-400">
             Budget Cycle
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