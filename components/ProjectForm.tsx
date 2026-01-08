
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Country, ExpenseType, Project, Status, Role, FinanceSchedule, Comment, User } from '../types';
import { INITIAL_PLANNING_ROW, INITIAL_FINANCE_SCHEDULE, STATUS_COLORS, AVAILABLE_USERS, PROJECT_CLASSES, PRIORITIES, EXPENSE_TYPES, ESTIMATE_CLASSES } from '../constants';
import { Save, Send, CheckCircle, XCircle, ArrowLeft, MessageSquare, History, FileText, Calendar, DollarSign, Undo2, Lock, Unlock, Trash2, FileDown, Wallet, CornerDownRight, CheckSquare, AlertCircle, Info, Users, Tag, Globe, Briefcase, TrendingUp, Layers, CopyPlus } from 'lucide-react';
import { generateUUID } from '../utils';

const LabelWithTooltip = ({ label, required, tooltip }: { label: string, required?: boolean, tooltip?: string }) => (
  <div className="flex items-center gap-1.5 mb-2">
    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
      {label} {required && '*'}
    </label>
    {tooltip && (
      <div className="group relative">
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] pointer-events-none text-center leading-relaxed">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
        <Info size={14} className="text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
      </div>
    )}
  </div>
);

const FormattedNumberInput = ({ value, onChange, placeholder, readOnly, highlight }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const formatNum = (val: any) => {
    if (val === undefined || val === null || val === '') return '';
    const num = Number(val);
    return isNaN(num) || num === 0 ? '' : num.toLocaleString('en-US');
  };
  
  const [localValue, setLocalValue] = useState(formatNum(value));

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(formatNum(value));
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setLocalValue(value === 0 ? '' : value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalValue(raw);
    const cleanRaw = raw.replace(/,/g, '');
    
    if (cleanRaw === '') {
        onChange(0);
        return;
    }
    
    if (/^-?\d*\.?\d*$/.test(cleanRaw)) {
        const parsed = parseFloat(cleanRaw);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    }
  };

  return (
    <input
      type="text"
      readOnly={readOnly}
      className={`w-full pl-7 pr-3 py-2.5 text-right text-sm font-medium border rounded-md focus:ring-2 outline-none transition-all ${
        highlight 
          ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-100 bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-sm dark:border-blue-800 dark:focus:ring-blue-900' 
          : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 dark:border-slate-700 dark:focus:ring-slate-800'
      } ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
      placeholder={placeholder}
      value={localValue}
      onChange={handleChange}
      onFocus={!readOnly ? handleFocus : undefined}
      onBlur={handleBlur}
      disabled={readOnly}
      inputMode="decimal"
    />
  );
};

interface CommentThreadProps {
  comment: Comment;
  depth?: number;
  allComments: Comment[];
  currentUser: User;
  isPrinting: boolean;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  onPostReply: (parentId: string) => void;
}

const CommentThread: React.FC<CommentThreadProps> = ({ 
  comment, 
  depth = 0, 
  allComments, 
  currentUser, 
  isPrinting, 
  activeReplyId, 
  setActiveReplyId, 
  replyText, 
  setReplyText, 
  onPostReply 
}) => {
  const children = allComments.filter(c => c.parentId === comment.id);
  const isDecision = comment.text.includes('**DECISION:');
  
  return (
    <div className={`flex flex-col ${depth > 0 ? 'mt-4' : 'mb-6'}`}>
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm border ${
          isDecision 
            ? 'bg-blue-600 text-white border-blue-700' 
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
        }`}>
          {comment.author.charAt(0)}
        </div>
        <div className="flex-1">
          <div className={`border p-4 rounded-xl shadow-sm relative group ${
            isDecision 
              ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{comment.author} <span className="text-slate-500 dark:text-slate-400 font-normal text-xs ml-1">({comment.role})</span></span>
              <span className="text-xs text-slate-400 font-medium">{new Date(comment.timestamp).toLocaleString()}</span>
            </div>
            <p className={`text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap ${isDecision ? 'font-medium' : ''}`}>{comment.text}</p>
            
            {!isPrinting && !isDecision && (
              <button 
                onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                <CornerDownRight size={12} /> Reply
              </button>
            )}
          </div>

          {children.length > 0 && (
            <div className="pl-8 sm:pl-12 border-l-2 border-slate-100 dark:border-slate-800 ml-5 mt-2">
              {children.map(child => (
                <CommentThread key={child.id} comment={child} depth={depth + 1} allComments={allComments} currentUser={currentUser} isPrinting={isPrinting} activeReplyId={activeReplyId} setActiveReplyId={setActiveReplyId} replyText={replyText} setReplyText={setReplyText} onPostReply={onPostReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionCard: React.FC<{ title: string, icon: React.ElementType, children: React.ReactNode, className?: string, headerAction?: React.ReactNode }> = ({ title, icon: Icon, children, className = '', headerAction }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col ${className}`}>
    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-slate-500 dark:text-slate-400" />
        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      {headerAction}
    </div>
    <div className="p-6 flex-1">
      {children}
    </div>
  </div>
);

export const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getProject, saveProject, deleteProject, duplicateProject, updateStatus, addComment, currentUser, generateProjectCode, settings, masterData, isLoading } = useApp();
  const isAdmin = currentUser.role === Role.Admin;
  
  const isNew = !id;
  const [activeTab, setActiveTab] = useState('Details');
  const [formData, setFormData] = useState<Project | null>(null);
  
  const [commentText, setCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [approvalComment, setApprovalComment] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync formData with id from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['Details', 'Planning & Finance', 'Approval'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    if (isNew) {
      setFormData({
        id: generateUUID(), budgetYear: settings.activeBudgetYear, country: Country.BR, code: '', manualCodeOverride: false, name: '',
        startDate: '', endDate: '', concession: '', category: masterData.categories[0] || 'Other', projectClass: PROJECT_CLASSES[0],
        priority: PRIORITIES[0], owner: currentUser.name, reviewers: [], additionalReserves: false, multiYear: 'Single',
        expenseType: ExpenseType.CAPEX, description: '', justification: '', subcategory: 'N/A', planEngineering: { ...INITIAL_PLANNING_ROW },
        planProcurement: { ...INITIAL_PLANNING_ROW }, planExecution: { ...INITIAL_PLANNING_ROW }, initiatedBefore: false, prevBudgetRef: '',
        afeNumber: '', estimateClass: 'Class 5', expenditures: { ...INITIAL_FINANCE_SCHEDULE }, prevTotalCost: 0, prevExpenditures: 0, prevComments: '',
        status: Status.Draft, comments: [], auditTrail: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        oilPriceScenario: '', expectedFirstOilDate: '', grossInvestment: '', grossReserves: '', netNPV10: '', netInvestmentPerBoe: '',
        netNpvPerInvestment: '', netIRR: '', paybackMonths: '', breakevenOilPrice: ''
      });
    } else {
      const p = getProject(id as string);
      if (p) {
          setFormData(p);
          setIsProcessing(false);
      } else if (!isLoading && !isProcessing) {
          setFormData(null);
      }
    }
  }, [id, isNew, getProject, isLoading, navigate, currentUser.name, settings.activeBudgetYear, masterData.categories, location.search, isProcessing]);

  // Code generation for new projects
  useEffect(() => {
    if (formData && isNew && formData.startDate && formData.country && !formData.manualCodeOverride) {
      const code = generateProjectCode(formData.country, formData.startDate);
      if (code !== formData.code) {
        setFormData(prev => prev ? { ...prev, code } : null);
      }
    }
  }, [formData?.country, formData?.startDate, isNew, formData?.manualCodeOverride, generateProjectCode]);

  if (!formData) {
      if (id && !isLoading && !isProcessing) {
          return (
              <div className="flex flex-col items-center justify-center py-40 animate-in fade-in">
                  <AlertCircle size={48} className="text-slate-300 mb-4" />
                  <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Project Not Found</h2>
                  <p className="text-slate-500 mt-2 mb-6">The project record might be processing or no longer exists.</p>
                  <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Return to Dashboard</button>
              </div>
          );
      }
      return <div className="flex items-center justify-center py-40"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const isGlobalReadOnly = settings.isReadOnly && !isAdmin;
  const countryLockDate = settings.lockDates[formData.country];
  const isCountryLocked = countryLockDate ? new Date() > new Date(countryLockDate) : false;
  const isLocked = (isGlobalReadOnly || isCountryLocked) && !isAdmin;

  const totalProjectCost = Object.values(formData.expenditures).reduce((a: number, b) => a + (Number(b) || 0), 0);
  const proposedBudgetGross = (formData.expenditures.q1 || 0) + (formData.expenditures.q2 || 0) + (formData.expenditures.q3 || 0) + (formData.expenditures.q4 || 0);

  const handleChange = (field: keyof Project, value: any) => { if (!isLocked) setFormData(prev => prev ? { ...prev, [field]: value } : null); };
  const handleNestedChange = (parent: keyof Project, key: string, value: any) => {
    if (!isLocked) setFormData(prev => prev ? { ...prev, [parent]: { ...(prev[parent] as any), [key]: value } } : null);
  };

  const handleUnlockCode = () => { if (!isLocked && window.confirm("Override project code?")) handleChange('manualCodeOverride', true); };
  
  const handleSave = () => { if (formData && !isLocked) { saveProject(formData); if (isNew) navigate(`/project/${formData.id}`); } };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`PERMANENT ACTION: Are you sure you want to delete project ${formData.code}? This will permanently remove all data and logs associated with this project.`)) {
      setIsProcessing(true);
      deleteProject(formData.id);
      navigate('/', { replace: true });
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`DUPLICATE PROJECT: Do you want to carry this project over to the next budget year (${formData.budgetYear + 1})? Previous expenditure will be migrated to the "Prior Years" bucket.`)) {
      setIsProcessing(true);
      const newId = duplicateProject(formData.id);
      if (newId) {
        navigate(`/project/${newId}`, { replace: true });
      } else {
        setIsProcessing(false);
        alert("Failed to duplicate project.");
      }
    }
  };

  const handleSubmit = () => { if (formData && !isLocked) { updateStatus(formData.id, Status.Submitted); navigate('/'); } };

  const handleApprovalAction = (action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES') => {
    if (!formData) return;
    if ((action === 'REJECT' || action === 'REQUEST_CHANGES') && !approvalComment.trim()) { 
      alert("Decision notes are mandatory when rejecting or requesting changes."); 
      return; 
    }

    let newStatus = formData.status;
    let actionLabel = '';

    if (action === 'APPROVE') {
        if (formData.status === Status.Submitted && currentUser.role === Role.CountryManager) {
            newStatus = (settings.thresholds.ceoApprovalLimit > 0 && totalProjectCost < settings.thresholds.ceoApprovalLimit) ? Status.HQApproved : Status.CMApproved;
            actionLabel = newStatus === Status.HQApproved ? 'APPROVED (CM - Final)' : 'APPROVED (CM)';
        } else if (formData.status === Status.CMApproved && currentUser.role === Role.Admin) {
            newStatus = Status.HQApproved; 
            actionLabel = 'APPROVED (HQ/Admin)';
        }
    } else if (action === 'REQUEST_CHANGES') { 
        newStatus = Status.Revision; 
        actionLabel = 'CHANGES REQUESTED'; 
    } else if (action === 'REJECT') { 
        newStatus = Status.Rejected; 
        actionLabel = 'REJECTED'; 
    }

    const newComment: Comment = { 
      id: generateUUID(), 
      author: currentUser.name, 
      role: currentUser.role, 
      text: `**DECISION: ${actionLabel}**\n\n${approvalComment || 'Approved as per review.'}`, 
      timestamp: new Date().toISOString() 
    };

    const updated = { 
      ...formData, 
      status: newStatus, 
      comments: [...formData.comments, newComment], 
      updatedAt: new Date().toISOString() 
    };

    saveProject(updated); 
    setFormData(updated); 
    setApprovalComment('');
    alert(`Project status updated to: ${newStatus}`);
  };

  const postComment = (parentId?: string) => {
    const text = parentId ? replyText : commentText;
    if (text.trim()) { addComment(formData.id, text, parentId); if (parentId) { setReplyText(''); setActiveReplyId(null); } else setCommentText(''); }
  };

  const renderInput = (label: string, field: keyof Project, type: string = 'text', required = false, readOnly = false, valueOverride?: string | number, tooltip?: string, placeholder?: string) => (
    <div className="flex flex-col gap-0.5">
      <LabelWithTooltip label={label} required={required} tooltip={tooltip} />
      <input 
        type={type} disabled={readOnly || isLocked} placeholder={placeholder}
        className={`border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white ${readOnly || isLocked ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium cursor-not-allowed' : 'bg-white dark:bg-slate-950'}`}
        value={valueOverride !== undefined ? valueOverride : String(formData[field] || '')}
        onChange={(e) => handleChange(field, type === 'number' ? Number(e.target.value) : e.target.value)}
        onClick={(e) => { if (type === 'date' && !isLocked && !readOnly) try { (e.target as any).showPicker?.(); } catch (err) {} }}
      />
    </div>
  );

  const renderMoneyField = (period: keyof FinanceSchedule, label: string, highlight = false, tooltip?: string) => (
    <div className={`relative group ${highlight ? 'flex-1' : ''}`}>
      <LabelWithTooltip label={label} tooltip={tooltip} />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">$</span>
        <FormattedNumberInput value={formData.expenditures[period] || 0} onChange={(val: number) => handleNestedChange('expenditures', period, val)} highlight={highlight} placeholder="0" readOnly={isLocked} />
      </div>
    </div>
  );

  const renderSelect = (label: string, field: keyof Project, options: {label: string, value: any, tooltip?: string}[], tooltip?: string) => (
    <div className="flex flex-col gap-0.5">
      <LabelWithTooltip label={label} tooltip={tooltip} />
      <select 
        disabled={isLocked}
        className={`border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-950 dark:text-white disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:cursor-not-allowed`}
        value={String(formData[field])}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        {options.map(opt => <option key={opt.value} value={opt.value} title={opt.tooltip}>{opt.label}</option>)}
      </select>
    </div>
  );

  const renderPlanningRow = (label: string, field: 'planEngineering' | 'planProcurement' | 'planExecution') => (
    <tr className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="py-4 font-medium text-slate-700 dark:text-slate-300 px-4">{label}</td>
      {['prior', 'q1', 'q2', 'q3', 'q4', 'subsequent'].map((period) => (
        <td key={period} className="text-center py-2">
          <label className={`inline-flex items-center justify-center p-2 rounded transition-colors ${!isLocked ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : 'cursor-not-allowed opacity-50'}`}>
            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600" checked={(formData[field] as any)[period]} disabled={isLocked} onChange={(e) => handleNestedChange(field, period, e.target.checked)} />
          </label>
        </td>
      ))}
    </tr>
  );

  const canApprove = (currentUser.role === Role.CountryManager && formData.status === Status.Submitted) || (currentUser.role === Role.Admin && formData.status === Status.CMApproved);
  const concessionOptions = (masterData.concessions[formData.country] || []).map(c => ({label: c, value: c}));

  return (
    <div className="w-full mx-auto pb-12">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50 dark:bg-slate-950 z-40 py-4 border-b border-slate-200 dark:border-slate-800 shadow-sm px-6 -mx-6 md:-mx-8 no-print transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">{formData.code || 'New Project'}<span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[formData.status]}`}>{formData.status}</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLocked && <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-bold border border-amber-200 dark:border-amber-800"><Lock size={12} />LOCKED</div>}
          <button onClick={() => { setIsPrinting(true); setTimeout(() => { window.print(); setIsPrinting(false); }, 500); }} className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-md font-medium hover:bg-slate-700 shadow-sm transition-colors"><FileDown size={16} /> PDF</button>
          {isAdmin && !isNew && (
            <>
              <button 
                onClick={handleDuplicate} 
                className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 shadow-sm transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isProcessing}
              >
                <CopyPlus size={16} /> {isProcessing ? 'Processing...' : 'Duplicate'}
              </button>
              <button 
                onClick={handleDelete} 
                className={`flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded-md font-bold dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isProcessing}
              >
                <Trash2 size={16} /> {isProcessing ? 'Processing...' : 'Delete'}
              </button>
            </>
          )}
          {formData.status !== Status.HQApproved && !isLocked && <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-medium hover:bg-slate-50 shadow-sm transition-colors"><Save size={16} /> Save</button>}
          {currentUser.role === Role.ProjectLead && (formData.status === Status.Draft || formData.status === Status.Revision) && !isLocked && <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow-sm transition-colors"><Send size={16} /> Submit</button>}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-t-lg border-b border-slate-200 dark:border-slate-800 px-6 flex gap-8 no-print transition-colors overflow-x-auto">
        {[{ id: 'Details', icon: FileText }, { id: 'Planning & Finance', icon: DollarSign }, { id: 'Approval', icon: CheckSquare }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}><tab.icon size={18} />{tab.id}</button>
        ))}
      </div>

      <div className={`bg-slate-50 dark:bg-slate-950/50 ${isPrinting ? 'p-0' : 'rounded-b-lg border border-slate-200 dark:border-slate-800 border-t-0 p-6 md:p-8 shadow-sm transition-colors'}`}>
        {isPrinting && <div className="mb-8 border-b pb-4"><h1 className="text-3xl font-bold text-slate-900">{formData.name}</h1><div className="flex gap-4 mt-2 text-sm text-slate-600"><span>Code: <strong>{formData.code}</strong></span><span>Status: <strong>{formData.status}</strong></span><span>Owner: <strong>{formData.owner}</strong></span></div></div>}

        <div className={activeTab === 'Details' || isPrinting ? 'block' : 'hidden'}>
          <div className="space-y-6 animate-in fade-in duration-300">
            <SectionCard title="Overview" icon={Info}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="lg:col-span-2">{renderInput('Project Name', 'name', 'text', true)}</div>
                    <div className="flex flex-col gap-0.5"><LabelWithTooltip label={`Project Code`} />
                        <div className="flex items-center gap-2">
                            <input type="text" disabled={!formData.manualCodeOverride || isLocked} className={`w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white ${!formData.manualCodeOverride || isLocked ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-white dark:bg-slate-950'}`} value={formData.code} onChange={(e) => handleChange('code', e.target.value)} />
                            {!isPrinting && !formData.manualCodeOverride && !isLocked && <button onClick={handleUnlockCode} className="p-2 text-slate-400 hover:text-red-600" title="Manual Override"><Lock size={18} /></button>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5"><LabelWithTooltip label="TOTAL Lifecycle Cost" /><div className="border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 rounded px-4 py-3 text-sm font-mono font-bold">{totalProjectCost.toLocaleString()} kUSD</div></div>
                </div>
            </SectionCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Project Identity" icon={Globe} className="h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderSelect('Country', 'country', Object.values(Country).map(c => ({label: c, value: c})))}
                        {renderSelect('Asset/Field', 'concession', concessionOptions)}
                        {renderInput('Start Date', 'startDate', 'date', true)}
                        {renderInput('End Date', 'endDate', 'date')}
                        {renderInput('Budget Year', 'budgetYear', 'number', true)}
                        {renderInput('Project Owner', 'owner', 'text', true, false, undefined, 'The individual responsible for the project execution.')}
                    </div>
                </SectionCard>
                <SectionCard title="Project Categorization" icon={Tag} className="h-full">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {renderSelect('Department / Category', 'category', masterData.categories.map(c => ({label: c, value: c})))}
                        {renderSelect('Project Class', 'projectClass', PROJECT_CLASSES.map(c => ({label: c, value: c})))}
                        {renderSelect('Priority', 'priority', PRIORITIES.map(p => ({label: p, value: p})))}
                        {renderSelect('Execution Mode', 'multiYear', [{label: 'Single Year', value: 'Single'}, {label: 'Multi Year', value: 'Multi'}])}
                        <div className="md:col-span-2">
                           <LabelWithTooltip label="Reviewers" tooltip="Add names of individuals who should review this project (comma separated)." />
                           <input 
                              type="text" 
                              disabled={isLocked}
                              placeholder="e.g. John Doe, Sarah Conner"
                              className={`w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white ${isLocked ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-950'}`}
                              value={formData.reviewers.join(', ')}
                              onChange={(e) => handleChange('reviewers', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                           />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-3 bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100/50 dark:border-blue-900/30 mt-2">
                          <input 
                            type="checkbox" 
                            id="additionalReserves"
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                            checked={formData.additionalReserves} 
                            disabled={isLocked}
                            onChange={(e) => handleChange('additionalReserves', e.target.checked)} 
                          />
                          <label htmlFor="additionalReserves" className="text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none flex items-center gap-2">
                             <TrendingUp size={16} className="text-blue-500" />
                             Production Incremental?
                          </label>
                        </div>
                     </div>
                </SectionCard>
            </div>

            {formData.additionalReserves && (
              <SectionCard title="Production & Economics" icon={TrendingUp} className="animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {renderInput('Oil Price Scenario', 'oilPriceScenario', 'text', false, false, undefined, 'Brent price used for calculations')}
                  {renderInput('Expected First Oil', 'expectedFirstOilDate', 'date')}
                  {renderInput('Gross Investment (kUSD)', 'grossInvestment')}
                  {renderInput('Gross Reserves (kboe)', 'grossReserves')}
                  {renderInput('Net NPV10 (kUSD)', 'netNPV10')}
                  {renderInput('Net IRR (%)', 'netIRR')}
                  {renderInput('Payback (Months)', 'paybackMonths')}
                  {renderInput('Breakeven Oil Price', 'breakevenOilPrice')}
                </div>
              </SectionCard>
            )}

            <SectionCard title="Project Definition" icon={Briefcase}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-0.5 relative"><LabelWithTooltip label="Scope / Description" /><textarea disabled={isLocked} className="w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-950 dark:text-white min-h-[120px] resize-y" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} /></div>
                    <div className="flex flex-col gap-0.5 relative"><LabelWithTooltip label="Justification" /><textarea disabled={isLocked} className="w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-950 dark:text-white min-h-[120px] resize-y" value={formData.justification} onChange={(e) => handleChange('justification', e.target.value)} /></div>
                </div>
            </SectionCard>
          </div>
        </div>

        <div className={`${activeTab === 'Planning & Finance' || isPrinting ? 'block' : 'hidden'} ${isPrinting ? 'mt-8' : ''}`}>
          <div className="animate-in fade-in duration-300 space-y-8">
            <SectionCard title="Pre-Budget Activity" icon={History}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <input 
                    type="checkbox" 
                    id="initiatedBefore"
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                    checked={formData.initiatedBefore} 
                    disabled={isLocked}
                    onChange={(e) => handleChange('initiatedBefore', e.target.checked)} 
                  />
                  <label htmlFor="initiatedBefore" className="text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                    Activity initiated before budget year {formData.budgetYear}?
                  </label>
                </div>

                {formData.initiatedBefore && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50/20 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-0.5">
                      <LabelWithTooltip label="Previous budget ref. number" tooltip="Project code of activities related to this project" />
                      <input 
                        type="text" disabled={isLocked} placeholder="e.g. BR-2024-TEdB-042"
                        className={`border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white ${isLocked ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-950'}`}
                        value={formData.prevBudgetRef}
                        onChange={(e) => handleChange('prevBudgetRef', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <LabelWithTooltip label="AFE Number(s)" tooltip="AFE numbers of activities related to this project (if applicable)" />
                      <input 
                        type="text" disabled={isLocked} placeholder="e.g. AFE-123, AFE-456"
                        className={`border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white ${isLocked ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-950'}`}
                        value={formData.afeNumber || ''}
                        onChange={(e) => handleChange('afeNumber', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-0.5">
                      <LabelWithTooltip label="Activities status update" tooltip="For multi-year activities, provide an update on work completed and overall progress" />
                      <textarea 
                        disabled={isLocked} 
                        className={`w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white min-h-[100px] resize-y ${isLocked ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-950'}`}
                        placeholder="For multi-year activities, provide an update on work completed and overall progress..."
                        rows={3}
                        value={formData.prevComments} 
                        onChange={(e) => handleChange('prevComments', e.target.value)} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Execution Milestones" icon={Calendar}>
              <div className="overflow-x-auto -mx-6"><table className="w-full text-sm"><thead><tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-xs tracking-wider"><th className="text-left py-4 px-6 w-1/4">Phase</th><th className="text-center py-4">Prior</th><th className="text-center py-4">Q1</th><th className="text-center py-4">Q2</th><th className="text-center py-4">Q3</th><th className="text-center py-4">Q4</th><th className="text-center py-4">Subs.</th></tr></thead><tbody>{renderPlanningRow('Engineering / Study', 'planEngineering')}{renderPlanningRow('Procurement / Fab', 'planProcurement')}{renderPlanningRow('Execution / Close-out', 'planExecution')}</tbody></table></div>
            </SectionCard>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap justify-between items-center gap-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Wallet size={18}/>Expenditure Schedule (kUSD)</h3>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <LabelWithTooltip label="Estimate Class" tooltip="AACE International standard for estimate maturity and accuracy range." />
                       <div className="relative">
                          <select 
                            disabled={isLocked}
                            className={`border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-950 dark:text-white disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:cursor-not-allowed`}
                            value={formData.estimateClass || 'Class 5'}
                            onChange={(e) => handleChange('estimateClass', e.target.value)}
                          >
                            {ESTIMATE_CLASSES.map(opt => <option key={opt.value} value={opt.value} title={opt.tooltip}>{opt.label}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="flex items-center bg-slate-800 dark:bg-slate-950 rounded-lg p-2 px-4 text-white shadow-md border border-slate-700 text-center">
                        <p className="text-xs text-slate-400 font-medium uppercase mr-2">Total Project Cost:</p>
                        <p className="text-xl font-mono font-bold">{totalProjectCost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-b bg-blue-50/50 dark:bg-blue-900/10"><div className="flex items-center justify-between mb-4"><h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide">{formData.budgetYear} Budget Plan</h4><div className="text-sm"><span className="text-blue-600 mr-2">Year Total:</span><span className="font-mono font-bold text-blue-900 dark:text-blue-100">{proposedBudgetGross.toLocaleString()}</span></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{renderMoneyField('q1', 'Q1', true)}{renderMoneyField('q2', 'Q2', true)}{renderMoneyField('q3', 'Q3', true)}{renderMoneyField('q4', 'Q4', true)}</div></div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">{renderMoneyField('prior', 'Prior Years')}{renderMoneyField('current', 'Current Year')}{renderMoneyField('y1', 'Year +1')}{renderMoneyField('y2', 'Year +2')}</div>
            </div>
          </div>
        </div>
        
        <div className={activeTab === 'Approval' || isPrinting ? 'block' : 'hidden'}>
           <div className="animate-in fade-in duration-300 space-y-8">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm no-print">
                <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold flex items-center gap-2"><CheckSquare className="text-blue-600"/>Approval Workflow</h2><span className={`px-3 py-1 rounded-full text-sm font-bold border ${STATUS_COLORS[formData.status]}`}>Status: {formData.status}</span></div>
                {canApprove ? (
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <h3 className="text-sm font-bold uppercase mb-4">Pending Your Decision</h3>
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Decision Notes / Feedback *</label>
                      <textarea 
                        className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] bg-white dark:bg-slate-950 dark:text-white" 
                        placeholder="Provide details for your approval or rejection..."
                        value={approvalComment} 
                        onChange={(e) => setApprovalComment(e.target.value)} 
                      />
                    </div>
                    <div className="flex gap-4 justify-end border-t dark:border-slate-700 pt-6">
                      <button onClick={() => handleApprovalAction('REJECT')} className="px-6 py-3 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg font-bold transition-colors">REJECT</button>
                      <button onClick={() => handleApprovalAction('REQUEST_CHANGES')} className="px-6 py-3 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-lg font-bold transition-colors">REQUEST CHANGES</button>
                      <button onClick={() => handleApprovalAction('APPROVE')} className="px-8 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold shadow-md transition-colors">APPROVE</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
                    <AlertCircle size={24} className="mx-auto mb-2 opacity-30" />
                    <p>Governance decision level not currently active for your profile.</p>
                  </div>
                )}
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <SectionCard title="Governance Conversation" icon={MessageSquare} className="h-full">
                    <div className="space-y-2 mb-10 min-h-[300px] overflow-y-auto pr-2">{formData.comments.filter(c => !c.parentId).map(comment => (<CommentThread key={comment.id} comment={comment} allComments={formData.comments} currentUser={currentUser} isPrinting={isPrinting} activeReplyId={activeReplyId} setActiveReplyId={setActiveReplyId} replyText={replyText} setReplyText={setReplyText} onPostReply={postComment} />))}{formData.comments.length === 0 && <div className="text-center py-10 text-slate-400 italic">No governance discussion recorded.</div>}</div>
                    {!isPrinting && <div className="mt-4 flex gap-4 items-start bg-slate-50 bg-slate-800/50 p-4 rounded-xl border"><div className="flex-1"><textarea className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none dark:bg-slate-950" placeholder="Provide context..." rows={2} value={commentText} onChange={(e) => setCommentText(e.target.value)} /></div><button onClick={() => postComment()} disabled={!commentText.trim()} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"><Send size={18} /></button></div>}
                </SectionCard>
                <SectionCard title="Change History" icon={History} className="h-full"><div className="overflow-y-auto pr-2 max-h-[600px]"><div className="space-y-4">{formData.auditTrail.slice().reverse().map((log) => (<div key={log.id} className="p-4 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 transition-all"><div className="flex justify-between items-start mb-3"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div><span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{new Date(log.timestamp).toLocaleDateString()}</span></div><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold border">{log.user}</span></div><div className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2 border-l-2 border-slate-300 ml-0.5 pl-2">{log.field}</div><div className="grid grid-cols-1 gap-2 text-xs"><div className="flex items-center gap-2 text-red-600 line-through"><span className="text-[10px] font-black w-8">OLD</span><span>{log.oldValue}</span></div><div className="flex items-center gap-2 text-green-700 font-bold"><span className="text-[10px] font-black w-8">NEW</span><span>{log.newValue}</span></div></div></div>))}{formData.auditTrail.length === 0 && <div className="text-center py-20 text-slate-400 italic text-sm">No change history recorded.</div>}</div></div></SectionCard>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
