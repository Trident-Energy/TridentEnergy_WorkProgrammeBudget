import React, { useState } from 'react';
// Fix: Added missing HelpCircle import from lucide-react
import { BookOpen, Shield, Send, Table, Info, Layers, CheckCircle, AlertTriangle, User, Globe, DollarSign, Calendar, ChevronRight, HelpCircle } from 'lucide-react';

export const UserGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const menuItems = [
    { id: 'intro', label: 'Introduction', icon: Info },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'workflow', label: 'Governance Workflow', icon: Send },
    { id: 'creation', label: 'Project Lifecycle', icon: Layers },
    { id: 'estimates', label: 'Estimate Classes', icon: Table },
    { id: 'support', label: 'Support & FAQs', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20 relative">
      {/* --- STICKY SIDEBAR MENU --- */}
      <aside className="lg:w-64 shrink-0 no-print">
        <div className="sticky top-24 space-y-1">
          <div className="px-4 py-3 mb-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentation</h3>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none translate-x-1'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 space-y-20">
        {/* Introduction */}
        <section id="intro" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
              <BookOpen size={40} className="text-blue-600" />
              WP&B User Guide
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              Welcome to the Work Plan & Budget (WP&B) Platform. This comprehensive guide is designed to help you navigate the end-to-end process of project budgeting, approval, and governance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Purpose</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Streamline budget planning across Brazil, Equatorial Guinea, and Congo subsidiaries while ensuring strict financial governance and auditability.
              </p>
            </div>
            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2">Key Features</h3>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                <li>Automated Project Code Generation</li>
                <li>Multi-year Financial Forecasting</li>
                <li>Real-time Governance Discussion</li>
                <li>Comprehensive Audit Trails</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Roles & Permissions */}
        <section id="roles" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1">
            <Shield size={24} className="text-blue-600" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Roles & Permissions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Project Lead', icon: User, items: ['Create/Edit Drafts', 'Submit for Review', 'Duplicate for New Year'] },
              { role: 'Country Manager', icon: Globe, items: ['Review Submissions', 'Approve/Reject locally', 'Request Revisions'] },
              { role: 'HQ / Admin', icon: Shield, items: ['Final HQ Approval', 'System Configuration', 'User Management'] },
            ].map((item) => (
              <div key={item.role} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-sm">{item.role}</h3>
                <ul className="space-y-3">
                  {item.items.map((li) => (
                    <li key={li} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle size={14} className="text-emerald-500" /> {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Governance Workflow */}
        <section id="workflow" className="scroll-mt-24 space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1">
            <Send size={24} className="text-blue-600" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Governance Workflow</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mb-10">
              <div className="flex flex-col items-center gap-2 w-full md:w-32">
                <div className="w-full text-center py-2 px-4 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase">Draft</div>
                <p className="text-[10px] text-slate-400 text-center">Project Lead</p>
              </div>
              <ChevronRight className="rotate-90 md:rotate-0 text-slate-300" />
              <div className="flex flex-col items-center gap-2 w-full md:w-32">
                <div className="w-full text-center py-2 px-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded border border-blue-200 text-[10px] font-black uppercase">Submitted</div>
                <p className="text-[10px] text-slate-400 text-center">Pending Review</p>
              </div>
              <ChevronRight className="rotate-90 md:rotate-0 text-slate-300" />
              <div className="flex flex-col items-center gap-2 w-full md:w-32">
                <div className="w-full text-center py-2 px-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded border border-indigo-200 text-[10px] font-black uppercase">CM Approved</div>
                <p className="text-[10px] text-slate-400 text-center">Sub. Review</p>
              </div>
              <ChevronRight className="rotate-90 md:rotate-0 text-slate-300" />
              <div className="flex flex-col items-center gap-2 w-full md:w-32">
                <div className="w-full text-center py-2 px-4 bg-emerald-600 text-white rounded border border-emerald-700 shadow-lg shadow-emerald-100 text-[10px] font-black uppercase">HQ Approved</div>
                <p className="text-[10px] text-slate-400 text-center">Final Approval</p>
              </div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-900/30 flex gap-4">
              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
              <div className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                <strong>Threshold Rule:</strong> Projects with a Total Project Cost below the HQ Threshold (currently set by Admin) are automatically transitioned to "Approved by HQ" upon Country Manager approval.
              </div>
            </div>
          </div>
        </section>

        {/* Project Lifecycle */}
        <section id="creation" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1">
            <Layers size={24} className="text-blue-600" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Project Lifecycle Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Creation & Identification</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Fill in mandatory fields. Project codes are automatically generated based on Country and Year to ensure uniqueness and categorization.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Financial Scheduling</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Map your project expenditures across 4 quarters. The system calculates the 'Total Project Cost' automatically to aid governance.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Governance & Communication</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Use the 'Approval' tab to engage in discussions with reviewers. All comments are logged and stored with the project record.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Carry Over (Duplication)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Carry over active projects to the next budget year with a single click. Previous spend is migrated to the 'Prior Years' bucket.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estimate Classes */}
        <section id="estimates" className="scroll-mt-24 space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1">
            <Table size={24} className="text-blue-600" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">AACE International Estimate Classes</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <p className="text-xs text-slate-500 italic">Reference: Cost Estimate Classification System — As Applied in Engineering, Procurement, and Construction for the Process Industries (AACE International).</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b dark:border-slate-700">
                  <tr>
                    <th rowSpan={2} className="px-4 py-3 border-r dark:border-slate-700 w-24">Estimate Class</th>
                    <th className="px-4 py-3 border-b border-r dark:border-slate-700 text-center bg-blue-50/30 dark:bg-blue-900/20">Primary Characteristic</th>
                    <th colSpan={4} className="px-4 py-3 text-center bg-slate-100/50 dark:bg-slate-800/50">Secondary Characteristics</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 border-r dark:border-slate-700 text-center">Level of Project Definition (% of complete definition)</th>
                    <th className="px-4 py-3 border-r dark:border-slate-700 text-center">End Usage (Typical purpose)</th>
                    <th className="px-4 py-3 border-r dark:border-slate-700 text-center">Methodology (Typical method)</th>
                    <th className="px-4 py-3 border-r dark:border-slate-700 text-center">Expected Accuracy Range (Variation low/high)</th>
                    <th className="px-4 py-3 text-center">Preparation Effort (Relative to index 1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-4 border-r dark:border-slate-700 font-black text-slate-800 dark:text-slate-100 bg-slate-50/20">Class 5</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 text-center">0% to 2%</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Concept Screening</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Capacity Factored, Parametric Models, Judgment, or Analogy</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 bg-red-50/20 dark:bg-red-900/10">L: -20% to -50%<br/>H: +30% to +100%</td>
                    <td className="px-4 py-4 text-center">1</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-4 border-r dark:border-slate-700 font-black text-slate-800 dark:text-slate-100 bg-slate-50/20">Class 4</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 text-center">1% to 15%</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Study or Feasibility</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Equipment Factored or Parametric Models</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 bg-orange-50/20 dark:bg-orange-900/10">L: -15% to -30%<br/>H: +20% to +50%</td>
                    <td className="px-4 py-4 text-center">2 to 4</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-4 border-r dark:border-slate-700 font-black text-slate-800 dark:text-slate-100 bg-slate-50/20">Class 3</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 text-center">10% to 40%</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Budget, Authorization, or Control</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Semi-Detailed Unit Costs with Assembly Level Line Items</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 bg-amber-50/20 dark:bg-amber-900/10">L: -10% to -20%<br/>H: +10% to +30%</td>
                    <td className="px-4 py-4 text-center">3 to 10</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-4 border-r dark:border-slate-700 font-black text-slate-800 dark:text-slate-100 bg-slate-50/20">Class 2</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 text-center">30% to 70%</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Control or Bid/Tender</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Detailed Unit Cost with Forced Detailed Take-Off</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 bg-blue-50/20 dark:bg-blue-900/10">L: -5% to -15%<br/>H: +5% to +20%</td>
                    <td className="px-4 py-4 text-center">4 to 20</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-4 border-r dark:border-slate-700 font-black text-slate-800 dark:text-slate-100 bg-slate-50/20">Class 1</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 text-center">50% to 100%</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Check Estimate or Bid/Tender</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700">Detailed Unit Cost with Detailed Take-Off</td>
                    <td className="px-4 py-4 border-r dark:border-slate-700 bg-emerald-50/20 dark:bg-emerald-900/10">L: -3% to -10%<br/>H: +3% to +15%</td>
                    <td className="px-4 py-4 text-center">5 to 100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Support & FAQs */}
        <section id="support" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4 py-1">
            <HelpCircle size={24} className="text-blue-600" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Support & FAQs</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-white mb-2 italic">Why is my project code locked?</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">By default, codes are immutable to prevent broken links in historical reporting. Admins can override this in cases of critical typo correction.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-white mb-2 italic">What happens if a project is rejected?</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Rejected projects are locked for editing. If you need to resubmit, duplicate the project to start a new iteration based on the feedback received.</p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-slate-800 rounded-xl text-white text-center">
            <p className="font-bold mb-2">Need Further Assistance?</p>
            <p className="text-xs text-slate-400 mb-6">Contact the Group Financial Planning & Analysis (FP&A) team via MS Teams or Email.</p>
            <button className="px-6 py-2 bg-blue-600 rounded-md font-bold text-sm hover:bg-blue-700 transition-colors">Submit Support Ticket</button>
          </div>
        </section>
      </div>
    </div>
  );
};