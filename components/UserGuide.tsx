import React, { useState } from 'react';
import { Book, Users, LayoutDashboard, FileText, CheckCircle, TrendingUp, ChevronRight, Menu, HelpCircle, AlertTriangle, Wallet, Calendar } from 'lucide-react';
import { STATUS_COLORS } from '../constants';

export const UserGuide = () => {
    const [activeSection, setActiveSection] = useState('intro');

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    const NavButton = ({ id, label }: { id: string, label: string }) => (
        <button 
            onClick={() => scrollTo(id)} 
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeSection === id ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-900/20 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex gap-8 max-w-7xl items-start pb-20">
           {/* Sidebar Navigation */}
           <div className="hidden lg:block w-64 sticky top-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden shrink-0">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                 <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Book size={18} className="text-blue-600"/> Table of Contents
                 </h3>
              </div>
              <nav className="p-2 space-y-1">
                 <NavButton id="intro" label="Introduction" />
                 <NavButton id="roles" label="User Roles & Permissions" />
                 <NavButton id="dashboard" label="Navigating the Dashboard" />
                 <NavButton id="project-mgmt" label="Project Management" />
                 <NavButton id="finance" label="Financial Planning" />
                 <NavButton id="workflow" label="Approval Workflow" />
                 <NavButton id="reports" label="Business Intelligence" />
              </nav>
           </div>

           {/* Content Area */}
           <div className="flex-1 space-y-12 min-w-0">
              
              {/* Introduction */}
              <section id="intro" className="scroll-mt-6">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Work Plan & Budget User Guide</h1>
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                          Welcome to the Trident Energy Work Plan & Budget (WPB) application. This comprehensive tool is designed to streamline the capital project budgeting process across our subsidiaries (Brazil, Equatorial Guinea, Congo). It ensures consistent data collection, provides rigorous approval workflows, and offers real-time financial insights for effective decision-making.
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                              <HelpCircle size={18} /> Training Objectives
                          </h4>
                          <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1 ml-1">
                              <li>Understand user roles and access rights.</li>
                              <li>Learn how to create, edit, and submit project proposals.</li>
                              <li>Master the financial scheduling inputs for OPEX and CAPEX.</li>
                              <li>Navigate the approval workflow from submission to CEO sign-off.</li>
                          </ul>
                      </div>
                  </div>
              </section>

              {/* Roles */}
              <section id="roles" className="scroll-mt-6">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Users className="text-purple-600" /> User Roles & Permissions
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-300">Project Lead</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">The primary owner of project data and execution.</p>
                        <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Create new projects and input technical details.</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Define financial schedules (Q1-Q4).</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Submit projects for approval.</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Revise projects based on management feedback.</li>
                        </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded dark:bg-orange-900/30 dark:text-orange-300">Country Manager</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Responsible for regional budget validation and strategy.</p>
                        <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> View all projects within their country.</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Approve submitted projects (Level 1 Approval).</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Request changes or reject proposals with comments.</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded dark:bg-purple-900/30 dark:text-purple-300">CEO</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Final authority on corporate budget allocation.</p>
                        <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> View projects across all regions globally.</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Give final approval (Level 2 Approval).</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                         <div className="flex items-center gap-2 mb-3">
                            <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded dark:bg-slate-700">Admin</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">System maintenance and user management.</p>
                        <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Add or remove users from the system.</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> Update user roles and country assignments.</li>
                        </ul>
                    </div>
                 </div>
              </section>

              {/* Dashboard */}
              <section id="dashboard" className="scroll-mt-6">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <LayoutDashboard className="text-blue-500" /> Navigating the Dashboard
                 </h2>
                 <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                    <p>
                        The Dashboard is your central hub. It displays a list of all projects you have access to. 
                        By default, you see projects for the upcoming budget year.
                    </p>
                    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Filtering</h4>
                            <p className="text-sm">Use the top bar to filter by <strong>Location</strong> (BR, GQ, CG), <strong>Budget Year</strong>, or <strong>Category</strong>. The Search bar allows you to find specific projects by code, name, or owner.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                             <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Quick Stats</h4>
                            <p className="text-sm">The table shows the <strong>Total Cost</strong> (lifecycle cost) and the <strong>Budget Year Cost</strong> (specific to the selected year) for quick financial assessment.</p>
                        </div>
                    </div>
                 </div>
              </section>

               {/* Project Management */}
               <section id="project-mgmt" className="scroll-mt-6">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <FileText className="text-orange-500" /> Project Management
                 </h2>
                 <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">1. Creating a New Project</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                            Click the <span className="font-bold bg-blue-600 text-white px-2 py-0.5 rounded text-xs">New Project</span> button in the header. 
                            The form is divided into several tabs:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                             <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                 <strong className="block mb-1 text-slate-800 dark:text-slate-200">Details Tab</strong>
                                 Basic info like Country, Name, Dates, and Categories. The Project Code is auto-generated based on the start date.
                             </div>
                             <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                 <strong className="block mb-1 text-slate-800 dark:text-slate-200">Planning Tab</strong>
                                 Checkboxes to indicate active quarters for Engineering, Procurement, and Execution phases.
                             </div>
                             <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                 <strong className="block mb-1 text-slate-800 dark:text-slate-200">Finance Tab</strong>
                                 Detailed cost breakdown. See "Financial Planning" below.
                             </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm">Audit Trail</h4>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                                Every change made to a project is recorded in the <strong>Audit Trail</strong> tab. This ensures full transparency of who changed what and when, including status changes and financial updates.
                            </p>
                        </div>
                    </div>
                 </div>
              </section>

               {/* Finance */}
               <section id="finance" className="scroll-mt-6">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Wallet className="text-green-600" /> Financial Planning
                 </h2>
                 <p className="text-slate-600 dark:text-slate-300 mb-6">
                     Accurate financial forecasting is critical. Values are entered in <strong>kUSD (thousands of US Dollars)</strong>.
                 </p>
                 <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold">
                            <tr>
                                <th className="px-4 py-3">Field</th>
                                <th className="px-4 py-3">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            <tr>
                                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Prior Years</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Total expenditure incurred before the current reporting year.</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Current Year</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Forecast for the year immediately preceding the Budget Year.</td>
                            </tr>
                            <tr className="bg-blue-50 dark:bg-blue-900/10">
                                <td className="px-4 py-3 font-semibold text-blue-800 dark:text-blue-300">Q1 - Q4</td>
                                <td className="px-4 py-3 text-blue-700 dark:text-blue-400 font-medium">Detailed breakdown for the Budget Year. This is the primary focus of the WPB cycle.</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Year +1 to +4</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term outlook for multi-year projects.</td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
              </section>

               {/* Workflow */}
              <section id="workflow" className="scroll-mt-6">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <CheckCircle className="text-emerald-600" /> Approval Workflow
                 </h2>
                 <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative mb-8">
                        {/* Visual Workflow Steps */}
                        <div className="flex-1 w-full text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg relative z-10 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center mx-auto mb-2">1</div>
                            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Draft</div>
                            <p className="text-xs text-slate-500 mt-1">Project Lead inputs data. Project is editable.</p>
                        </div>
                        <ChevronRight className="text-slate-300 hidden md:block" />
                        <div className="flex-1 w-full text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg relative z-10 border border-blue-200 dark:border-blue-800 shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-bold flex items-center justify-center mx-auto mb-2">2</div>
                            <div className="font-bold text-blue-800 dark:text-blue-300 text-sm">Submitted</div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Locked. Waiting for Country Manager.</p>
                        </div>
                        <ChevronRight className="text-slate-300 hidden md:block" />
                        <div className="flex-1 w-full text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg relative z-10 border border-purple-200 dark:border-purple-800 shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 font-bold flex items-center justify-center mx-auto mb-2">3</div>
                            <div className="font-bold text-purple-800 dark:text-purple-300 text-sm">CM Approved</div>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Regional validation complete. Waiting for CEO.</p>
                        </div>
                        <ChevronRight className="text-slate-300 hidden md:block" />
                        <div className="flex-1 w-full text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg relative z-10 border border-green-200 dark:border-green-800 shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200 font-bold flex items-center justify-center mx-auto mb-2">4</div>
                            <div className="font-bold text-green-800 dark:text-green-300 text-sm">CEO Approved</div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Final Budget Approval.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="p-4 rounded bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                            <strong className="text-red-700 dark:text-red-400">Rejection:</strong> If a project is Rejected at any stage, it is marked as closed. A new project must be created if the idea is to be resubmitted.
                        </div>
                        <div className="p-4 rounded bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                             <strong className="text-amber-700 dark:text-amber-400">Requests for Change:</strong> The project returns to "Revision" status. The Project Lead can edit and re-submit without creating a new entry.
                        </div>
                    </div>
                 </div>
              </section>

               {/* BI Reports */}
               <section id="reports" className="scroll-mt-6">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <TrendingUp className="text-red-500" /> Business Intelligence
                 </h2>
                 <p className="text-slate-600 dark:text-slate-300 mb-4">
                     The <strong className="text-slate-800 dark:text-slate-200">Business Overview</strong> page provides aggregate analytics for the entire portfolio.
                 </p>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                     <li className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                         <strong className="block mb-1 text-slate-800 dark:text-slate-200">Value at Risk</strong>
                         Visualizes the maturity of the budget (Draft vs Pending vs Approved) to highlight bottlenecks.
                     </li>
                     <li className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                         <strong className="block mb-1 text-slate-800 dark:text-slate-200">CAPEX vs OPEX</strong>
                         Quarterly breakdown of expenditure types to ensure balanced spending profiles.
                     </li>
                     <li className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                         <strong className="block mb-1 text-slate-800 dark:text-slate-200">Regional Split</strong>
                         Donut charts showing the distribution of funds between BR, GQ, and CG.
                     </li>
                     <li className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                         <strong className="block mb-1 text-slate-800 dark:text-slate-200">Big Ticket Projects</strong>
                         A ranked list of the top 5 costliest projects for high-level management review.
                     </li>
                 </ul>
              </section>

           </div>
        </div>
    );
};