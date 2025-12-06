import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Category, Country, ExpenseType, Project, Status, Role, PlanningRow, FinanceSchedule, Comment, User } from '../types';
import { CONCESSIONS, CATEGORIES, SUBCATEGORIES, INITIAL_PLANNING_ROW, INITIAL_FINANCE_SCHEDULE, STATUS_COLORS, AVAILABLE_USERS } from '../constants';
import { Save, Send, CheckCircle, XCircle, ArrowLeft, MessageSquare, History, FileText, Calendar, DollarSign, Undo2, Lock, Unlock, AlertTriangle, Plus, Trash2, FileDown, Wallet, CornerDownRight, CheckSquare, AlertCircle, Info, Users, Tag, Globe, Clock, Briefcase } from 'lucide-react';
import { generateUUID } from '../utils';

const TABS = ['Details', 'Planning', 'Finance', 'Approval', 'Audit Trail', 'Comments'];

// --- Formatted Number Input Component ---
const FormattedNumberInput = ({ value, onChange, placeholder, readOnly, highlight }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Format helper
  const format = (val: any) => {
    if (val === undefined || val === null || val === '') return '';
    const num = Number(val);
    return isNaN(num) || num === 0 ? '' : num.toLocaleString('en-US');
  };
  
  const [localValue, setLocalValue] = useState(format(value));

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(format(value));
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // On focus, show raw number for editing. If 0, show empty to make typing easier
    setLocalValue(value === 0 ? '' : value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalValue(raw);
    
    if (raw === '') {
        onChange(0);
        return;
    }
    
    // Parse
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
        onChange(parsed);
    }
  };

  return (
    <input
      type={isFocused ? "number" : "text"}
      readOnly={readOnly}
      className={`w-full pl-7 pr-3 py-2.5 text-right text-sm font-medium border rounded-md focus:ring-2 outline-none transition-all ${
        highlight 
          ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-100 bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-sm dark:border-blue-800 dark:focus:ring-blue-900' 
          : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 dark:border-slate-700 dark:focus:ring-slate-800'
      }`}
      placeholder={placeholder}
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      step="any"
    />
  );
};

// --- Recursive Comment Component ---
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
  
  return (
    <div className={`flex flex-col ${depth > 0 ? 'mt-4' : 'mb-8'}`}>
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300 flex-shrink-0 shadow-sm border border-slate-300 dark:border-slate-600">
          {comment.author.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm relative group">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{comment.author} <span className="text-slate500 dark:text-slate-400 font-normal text-xs ml-1">({comment.role})</span></span>
              <span className="text-xs text-slate-400 font-medium">{new Date(comment.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{comment.text}</p>
            
            {!isPrinting && (
              <button 
                onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                <CornerDownRight size={12} /> Reply
              </button>
            )}
          </div>

          {/* Reply Input Box */}
          {activeReplyId === comment.id && !isPrinting && (
            <div className="mt-3 ml-2 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-xs text-indigo-700 dark:text-indigo-300 flex-shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full border border-blue-200 dark:border-blue-900 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[80px] bg-white dark:bg-slate-950 dark:text-white"
                  placeholder={`Replying to ${comment.author}...`}
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button 
                    onClick={() => { setActiveReplyId(null); setReplyText(''); }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => onPostReply(comment.id)}
                    disabled={!replyText.trim()}
                    className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recursive Children */}
      {children.length > 0 && (
        <div className="pl-8 sm:pl-12 border-l-2 border-slate-100 dark:border-slate-800 ml-5 mt-2">
          {children.map(child => (
            <CommentThread 
              key={child.id} 
              comment={child} 
              depth={depth + 1}
              allComments={allComments}
              currentUser={currentUser}
              isPrinting={isPrinting}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              replyText={replyText}
              setReplyText={setReplyText}
              onPostReply={onPostReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper for history border colors
const getDecisionBorderColor = (text: string) => {
    if (text.includes('REJECTED')) return 'border-red-500';
    if (text.includes('CHANGES REQUESTED')) return 'border-amber-500';
    if (text.includes('APPROVED')) return 'border-green-500';
    return 'border-blue-500';
};

// --- Section Card Component ---
const SectionCard = ({ title, icon: Icon, children, className = '' }: { title: string, icon: React.ElementType, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
      <Icon size={18} className="text-slate-500 dark:text-slate-400" />
      <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

export const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, saveProject, deleteProject, updateStatus, addComment, currentUser, generateProjectCode } = useApp();
  
  const isNew = !id;
  
  const [activeTab, setActiveTab] = useState('Details');
  const [formData, setFormData] = useState<Project | null>(null);
  
  // Comment States
  const [commentText, setCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Approval Tab States
  const [approvalComment, setApprovalComment] = useState('');

  const [isPrinting, setIsPrinting] = useState(false);
  
  // Initialization
  useEffect(() => {
    if (isNew) {
      const initialProject: Project = {
        id: generateUUID(),
        budgetYear: new Date().getFullYear() + 1, // Default to next year
        country: Country.BR,
        code: '', // Generated on save or effect
        manualCodeOverride: false,
        name: '',
        startDate: '',
        endDate: '',
        concession: '',
        category: Category.Other,
        priority: 2, // Default to Essential
        owner: currentUser.name,
        reviewers: [],
        additionalReserves: false,
        multiYear: 'Single',
        expenseType: ExpenseType.OPEX,
        description: '',
        justification: '',
        subcategory: 'N/A',
        planEngineering: { ...INITIAL_PLANNING_ROW },
        planProcurement: { ...INITIAL_PLANNING_ROW },
        planExecution: { ...INITIAL_PLANNING_ROW },
        initiatedBefore: false,
        prevBudgetRef: '',
        afeNavRef: '',
        expenditures: { ...INITIAL_FINANCE_SCHEDULE },
        prevTotalCost: 0,
        prevExpenditures: 0,
        prevComments: '',
        status: Status.Draft,
        comments: [],
        auditTrail: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFormData(initialProject);
    } else {
      const p = getProject(id);
      if (p) setFormData(p);
      else navigate('/'); // Handle not found
    }
  }, [id, isNew, getProject, navigate, currentUser.name]);

  // Code Generation Effect
  useEffect(() => {
    if (formData && isNew && formData.startDate && formData.country && !formData.manualCodeOverride) {
      const code = generateProjectCode(formData.country, formData.startDate);
      setFormData(prev => prev ? { ...prev, code } : null);
    }
  }, [formData?.country, formData?.startDate, isNew, formData?.manualCodeOverride]);

  if (!formData) return <div>Loading...</div>;

  // Calculations
  const totalProjectCost = Object.values(formData.expenditures).reduce((a: number, b) => a + (Number(b) || 0), 0);
  const proposedBudgetGross = 
    (formData.expenditures.current || 0) + 
    (formData.expenditures.q1 || 0) + 
    (formData.expenditures.q2 || 0) + 
    (formData.expenditures.q3 || 0) + 
    (formData.expenditures.q4 || 0);

  const handleChange = (field: keyof Project, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleNestedChange = (parent: keyof Project, key: string, value: any) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            [parent]: {
                ...(prev[parent] as any),
                [key]: value
            }
        };
    });
  };

  const handleUnlockCode = () => {
    if (window.confirm("Warning: Manually overriding the project code may break naming conventions and tracking. Are you sure you want to proceed?")) {
      handleChange('manualCodeOverride', true);
    }
  };

  const handleAddReviewer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const user = e.target.value;
    if (user && !formData.reviewers.includes(user)) {
      handleChange('reviewers', [...formData.reviewers, user]);
    }
    e.target.value = ''; // Reset select
  };

  const handleRemoveReviewer = (user: string) => {
    handleChange('reviewers', formData.reviewers.filter(r => r !== user));
  };

  const handleSave = () => {
    if (formData) {
      saveProject(formData);
      if (isNew) navigate(`/project/${formData.id}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject(formData.id);
      navigate('/');
    }
  };

  const handleSubmit = () => {
    if (formData) {
      updateStatus(formData.id, Status.Submitted);
      navigate('/');
    }
  };

  // --- APPROVAL LOGIC ---
  const handleApprovalAction = (action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES') => {
    if (!formData) return;
    
    // Require comment for everything but Approve (optional but recommended)
    if ((action === 'REJECT' || action === 'REQUEST_CHANGES') && !approvalComment.trim()) {
        alert("A comment is required when rejecting or requesting changes.");
        return;
    }

    let newStatus = formData.status;
    let actionLabel = '';

    if (action === 'APPROVE') {
        if (formData.status === Status.Submitted && currentUser.role === Role.CountryManager) {
            newStatus = Status.CMApproved;
            actionLabel = 'APPROVED (CM)';
        } else if (formData.status === Status.CMApproved && currentUser.role === Role.CEO) {
            newStatus = Status.CEOApproved;
            actionLabel = 'APPROVED (CEO)';
        }
    } else if (action === 'REQUEST_CHANGES') {
        newStatus = Status.Revision;
        actionLabel = 'CHANGES REQUESTED';
    } else if (action === 'REJECT') {
        newStatus = Status.Rejected;
        actionLabel = 'REJECTED';
    }

    // 1. Create a detailed comment
    const fullCommentText = `**DECISION: ${actionLabel}**\n\n${approvalComment}`;
    
    // Create new comment object locally
    const newComment: Comment = {
      id: generateUUID(),
      author: currentUser.name,
      role: currentUser.role,
      text: fullCommentText,
      timestamp: new Date().toISOString()
    };
    
    // 2. Update the project state atomically with both status and comment
    const updatedProject = {
        ...formData,
        status: newStatus,
        comments: [...formData.comments, newComment],
        updatedAt: new Date().toISOString()
    };

    // 3. Save project (triggers audit log for status change automatically in AppContext)
    saveProject(updatedProject);
    
    // 4. Update local state
    setFormData(updatedProject);
    setApprovalComment('');
  };

  const handleExportPDF = () => {
    setIsPrinting(true);
    // Timeout to allow state to update and render all sections before printing
    setTimeout(() => {
        window.print();
        setIsPrinting(false);
    }, 500);
  };

  // --- COMMENT LOGIC ---
  const postComment = (parentId?: string) => {
    const textToPost = parentId ? replyText : commentText;
    
    if (textToPost.trim()) {
      addComment(formData.id, textToPost, parentId);
      if (parentId) {
        setReplyText('');
        setActiveReplyId(null);
      } else {
        setCommentText('');
      }
    }
  };

  // Render Helpers
  const renderInput = (label: string, field: keyof Project, type: string = 'text', required = false, readOnly = false, valueOverride?: string | number) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label} {required && '*'}</label>
      <input 
        type={type} 
        disabled={readOnly}
        className={`border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white ${readOnly ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium' : 'bg-white dark:bg-slate-950'}`}
        value={valueOverride !== undefined ? valueOverride : String(formData[field] || '')}
        onChange={(e) => handleChange(field, type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );

  const renderMoneyInput = (period: keyof FinanceSchedule, label: string, highlight = false) => (
    <div className={`relative group ${highlight ? 'flex-1' : ''}`}>
      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wide">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">$</span>
        <FormattedNumberInput 
            value={formData.expenditures[period] || 0}
            onChange={(val: number) => handleNestedChange('expenditures', period, val)}
            highlight={highlight}
            placeholder="0"
        />
      </div>
    </div>
  );

  const renderSelect = (label: string, field: keyof Project, options: {label: string, value: any}[]) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
      <select 
        className="border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-950 dark:text-white"
        value={String(formData[field])}
        onChange={(e) => handleChange(field, options[0].value.constructor === Number ? Number(e.target.value) : e.target.value)}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );

  const renderPlanningRow = (label: string, field: 'planEngineering' | 'planProcurement' | 'planExecution') => (
    <tr className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="py-4 font-medium text-slate-700 dark:text-slate-300 px-4">{label}</td>
      {['prior', 'q1', 'q2', 'q3', 'q4', 'subsequent'].map((period) => (
        <td key={period} className="text-center py-2">
          <label className="inline-flex items-center justify-center cursor-pointer p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <input 
              type="checkbox" 
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer dark:bg-slate-700 dark:border-slate-600"
              checked={(formData[field] as any)[period]}
              onChange={(e) => handleNestedChange(field, period, e.target.checked)}
            />
          </label>
        </td>
      ))}
    </tr>
  );

  const priorityOptions = [
    { label: '1 - Critical', value: 1 },
    { label: '2 - Essential', value: 2 },
    { label: '3 - Optimization', value: 3 },
  ];

  // Determine if current user can approve
  const canApprove = 
    (currentUser.role === Role.CountryManager && formData.status === Status.Submitted) || 
    (currentUser.role === Role.CEO && formData.status === Status.CMApproved);

  return (
    <div className="w-full mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50 dark:bg-slate-950 z-10 py-4 border-b border-slate-200 dark:border-slate-800 shadow-sm px-6 -mx-6 md:-mx-8 no-print transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
              {formData.code || 'New Project'}
              <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[formData.status]}`}>
                {formData.status}
              </span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-md font-medium hover:bg-slate-700 dark:hover:bg-slate-600 shadow-sm transition-colors">
            <FileDown size={16} /> Export PDF
          </button>

          {formData.status !== Status.CEOApproved && (
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">
              <Save size={16} /> Save Draft
            </button>
          )}

           {/* Delete Action (Admin Only) */}
           {!isNew && currentUser.role === Role.Admin && (
             <button 
                type="button"
                onClick={handleDelete} 
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-900/50 shadow-sm transition-colors ml-4"
             >
                <Trash2 size={16} /> Delete
             </button>
           )}

          {/* Workflow Actions - Project Lead */}
          {currentUser.role === Role.ProjectLead && (formData.status === Status.Draft || formData.status === Status.Revision) && (
            <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow-sm transition-colors">
              <Send size={16} /> Submit
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-t-lg border-b border-slate-200 dark:border-slate-800 px-6 flex gap-8 no-print transition-colors overflow-x-auto">
        {[
          { id: 'Details', icon: FileText },
          { id: 'Planning', icon: Calendar },
          { id: 'Finance', icon: DollarSign },
          { id: 'Approval', icon: CheckSquare },
          { id: 'Audit Trail', icon: History },
          { id: 'Comments', icon: MessageSquare }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <tab.icon size={18} />
            {tab.id}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={`bg-slate-50 dark:bg-slate-950/50 ${isPrinting ? 'p-0' : 'rounded-b-lg border border-slate-200 dark:border-slate-800 border-t-0 p-6 md:p-8 shadow-sm min-h-[600px] transition-colors'}`}>
        
        {/* PRINT HEADER */}
        {isPrinting && (
           <div className="mb-8 border-b pb-4">
              <h1 className="text-3xl font-bold text-slate-900">{formData.name}</h1>
              <div className="flex gap-4 mt-2 text-sm text-slate-600">
                 <span>Code: <strong>{formData.code}</strong></span>
                 <span>Status: <strong>{formData.status}</strong></span>
                 <span>Owner: <strong>{formData.owner}</strong></span>
                 <span>Budget Year: <strong>{formData.budgetYear}</strong></span>
              </div>
           </div>
        )}

        {/* DETAILS TAB */}
        <div className={activeTab === 'Details' || isPrinting ? 'block' : 'hidden'}>
          {isPrinting && <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-blue-500 pl-3">Project Details</h2>}
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Quick Stats Bar */}
            {!isPrinting && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg flex items-center justify-between shadow-sm">
                   <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Lifecycle Cost</p>
                      <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100">{totalProjectCost.toLocaleString()} kUSD</p>
                   </div>
                   <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                      <Wallet size={20} />
                   </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 p-4 rounded-lg flex items-center justify-between shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                   <div>
                      <p className="text-xs text-blue-500 dark:text-blue-400 uppercase font-semibold">Budget Year {formData.budgetYear}</p>
                      <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-300">{proposedBudgetGross.toLocaleString()} kUSD</p>
                   </div>
                   <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                      <DollarSign size={20} />
                   </div>
                </div>
              </div>
            )}

            {/* Section 1: Identity (Full Width) */}
            <SectionCard title="Project Identity" icon={Info}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="lg:col-span-2">
                        {renderInput('Project Name', 'name', 'text', true)}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Code {formData.manualCodeOverride ? '(Manual)' : '(Auto)'}</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                disabled={!formData.manualCodeOverride}
                                className={`w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white ${!formData.manualCodeOverride ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-white dark:bg-slate-950'}`}
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value)}
                            />
                            {!isPrinting && !formData.manualCodeOverride && (
                                <button onClick={handleUnlockCode} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Unlock for Manual Override">
                                <Lock size={18} />
                                </button>
                            )}
                            {!isPrinting && formData.manualCodeOverride && (
                                <button onClick={() => handleChange('manualCodeOverride', false)} className="p-2 text-red-600 hover:text-green-600 transition-colors" title="Revert to Auto">
                                <Unlock size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    {renderInput('Budget Year', 'budgetYear', 'number', true)}
                </div>
            </SectionCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section 2: Operational Context */}
                <SectionCard title="Operational Context" icon={Globe} className="h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderSelect('Country', 'country', Object.values(Country).map(c => ({label: c, value: c})))}
                        {renderSelect('Concession', 'concession', (CONCESSIONS[formData.country] || []).map(c => ({label: c, value: c})))}
                        {renderInput('Start Date', 'startDate', 'date', true)}
                        {renderInput('End Date', 'endDate', 'date')}
                    </div>
                </SectionCard>

                {/* Section 3: Strategic Classification */}
                <SectionCard title="Strategic Classification" icon={Tag} className="h-full">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {renderSelect('Category', 'category', CATEGORIES.map(c => ({label: c, value: c})))}
                        {renderSelect('Subcategory', 'subcategory', SUBCATEGORIES.map(c => ({label: c, value: c})))}
                        {renderSelect('Expense Type', 'expenseType', Object.values(ExpenseType).map(e => ({label: e, value: e})))}
                        {renderSelect('Priority', 'priority', priorityOptions)}
                     </div>
                     <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {renderSelect('Execution Mode', 'multiYear', [{label: 'Single Year', value: 'Single'}, {label: 'Multi Year', value: 'Multi'}])}
                        
                         {/* Additional Reserves Toggle */}
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Adds Reserves/Production?</label>
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1 w-full gap-1">
                                <button 
                                    className={`flex-1 px-4 py-2.5 text-xs font-medium rounded transition-all ${formData.additionalReserves ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    onClick={() => handleChange('additionalReserves', true)}
                                >
                                    Yes
                                </button>
                                <button 
                                    className={`flex-1 px-4 py-2.5 text-xs font-medium rounded transition-all ${!formData.additionalReserves ? 'bg-slate-600 dark:bg-slate-700 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    onClick={() => handleChange('additionalReserves', false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                     </div>
                </SectionCard>
            </div>

            {/* Section 4: Stakeholders */}
            <SectionCard title="Stakeholders" icon={Users}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Owner Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Owner *</label>
                        <select 
                        className="border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-950 dark:text-white"
                        value={formData.owner}
                        onChange={(e) => handleChange('owner', e.target.value)}
                        >
                        {AVAILABLE_USERS.map(user => <option key={user} value={user}>{user}</option>)}
                        </select>
                    </div>

                    {/* Reviewers Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Reviewers</label>
                        <div className="border border-slate-300 dark:border-slate-700 rounded p-3 min-h-[46px] flex flex-wrap gap-2 items-center bg-white dark:bg-slate-950">
                            {formData.reviewers.map(r => (
                            <span key={r} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium px-2 py-1 rounded flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                                {r}
                                {!isPrinting && <button onClick={() => handleRemoveReviewer(r)} className="text-slate-400 hover:text-red-500"><XCircle size={14}/></button>}
                            </span>
                            ))}
                            {!isPrinting && (
                            <div className="relative group">
                                <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase hover:text-blue-800 dark:hover:text-blue-300">
                                    <Plus size={14} /> Add
                                </button>
                                <select 
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleAddReviewer}
                                    value=""
                                >
                                <option value="">Select User...</option>
                                {AVAILABLE_USERS.filter(u => u !== formData.owner && !formData.reviewers.includes(u)).map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                                </select>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* Section 5: Business Case */}
            <SectionCard title="Business Case Definition" icon={Briefcase}>
                 <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Scope / Description</label>
                        <textarea 
                            className="w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-950 dark:text-white min-h-[160px] resize-y"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Provide a detailed description of the project scope..."
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                         <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Justification / Benefit</label>
                        <textarea 
                            className="w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-950 dark:text-white min-h-[160px] resize-y"
                            value={formData.justification}
                            onChange={(e) => handleChange('justification', e.target.value)}
                            placeholder="Explain the business case, background, and necessity of this project..."
                        />
                    </div>
                 </div>
            </SectionCard>

          </div>
        </div>

        {/* PLANNING TAB */}
        <div className={`${activeTab === 'Planning' || isPrinting ? 'block' : 'hidden'} ${isPrinting ? 'print-break-before mt-8' : ''}`}>
          {isPrinting && <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-blue-500 pl-3">Planning & Schedule</h2>}
          <div className="animate-in fade-in duration-300 space-y-6">
            
            {/* Schedule Summary Banner */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Project Phasing</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Select the active quarters for each project phase.</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded border border-slate-200 dark:border-slate-700">
                        <Clock size={16} className="text-blue-500" />
                        <span className="text-slate-500 dark:text-slate-400">Start:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <ArrowLeft size={16} className="text-slate-300 rotate-180" />
                     <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded border border-slate-200 dark:border-slate-700">
                        <Clock size={16} className="text-purple-500" />
                        <span className="text-slate-500 dark:text-slate-400">End:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-4 px-4 uppercase text-xs tracking-wider w-1/4">Activity / Phase</th>
                      <th className="text-center py-4 uppercase text-xs tracking-wider bg-slate-100/50 dark:bg-slate-800/50">Prior</th>
                      <th className="text-center py-4 uppercase text-xs tracking-wider">Q1</th>
                      <th className="text-center py-4 uppercase text-xs tracking-wider">Q2</th>
                      <th className="text-center py-4 uppercase text-xs tracking-wider">Q3</th>
                      <th className="text-center py-4 uppercase text-xs tracking-wider">Q4</th>
                      <th className="text-center py-4 uppercase text-xs tracking-wider bg-slate-100/50 dark:bg-slate-800/50">Subsequent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderPlanningRow('Engineering / Study', 'planEngineering')}
                    {renderPlanningRow('Procurement / Fabrication', 'planProcurement')}
                    {renderPlanningRow('Execution / Close-out', 'planExecution')}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 italic px-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <p>Ensure the phases align with the dates specified in the Details tab. Multi-year projects should utilize the 'Subsequent' column for activities extending beyond the current budget year.</p>
            </div>
          </div>
        </div>

        {/* FINANCE TAB */}
        <div className={`${activeTab === 'Finance' || isPrinting ? 'block' : 'hidden'} ${isPrinting ? 'print-break-before mt-8 print-break-inside-avoid' : ''}`}>
           {isPrinting && <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-blue-500 pl-3">Financial Overview</h2>}
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Meta Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                 <input 
                   type="checkbox" 
                   id="initiated"
                   checked={formData.initiatedBefore}
                   onChange={(e) => handleChange('initiatedBefore', e.target.checked)}
                   className="w-5 h-5 text-blue-600 rounded cursor-pointer dark:bg-slate-700 dark:border-slate-600"
                 />
                 <label htmlFor="initiated" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">Initiated before budget year?</label>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                 {renderInput('Prev Budget Line Ref', 'prevBudgetRef')}
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                {renderInput('AFENav Reference', 'afeNavRef')}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Wallet size={18} className="text-slate-500 dark:text-slate-400"/>
                    Expenditure Schedule
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">Unit: kUSD</span>
               </div>

               {/* Section 1: History & Total */}
               <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                   <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                       {renderMoneyInput('prior', 'Prior Years')}
                       {renderMoneyInput('current', 'Current Year')}
                   </div>
                   <div className="lg:col-span-2 bg-slate-800 dark:bg-slate-950 rounded-lg p-4 text-white flex flex-col justify-center items-center shadow-md border border-slate-700 dark:border-slate-800 text-center">
                       <p className="text-xs text-slate-400 font-medium uppercase mb-2">Total Project Cost</p>
                       <p className="text-4xl font-mono font-bold tracking-tight text-white">
                           {totalProjectCost.toLocaleString()}
                       </p>
                   </div>
               </div>

               {/* Section 2: The Budget Year (Highlighted) */}
               <div className="border-t border-b border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 p-6">
                   <div className="flex items-center justify-between mb-4">
                       <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide flex items-center gap-2">
                           <Calendar size={16} />
                           {formData.budgetYear} Budget Plan
                       </h4>
                       <div className="text-sm">
                           <span className="text-blue-600 dark:text-blue-400 mr-2">Year Total:</span>
                           <span className="font-mono font-bold text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                               {proposedBudgetGross.toLocaleString()} kUSD
                           </span>
                       </div>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {renderMoneyInput('q1', 'Q1 (Jan-Mar)', true)}
                       {renderMoneyInput('q2', 'Q2 (Apr-Jun)', true)}
                       {renderMoneyInput('q3', 'Q3 (Jul-Sep)', true)}
                       {renderMoneyInput('q4', 'Q4 (Oct-Dec)', true)}
                   </div>
               </div>

               {/* Section 3: Future Outlook */}
               <div className="p-6">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Future Projections</h4>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderMoneyInput('y1', 'Year +1')}
                        {renderMoneyInput('y2', 'Year +2')}
                        {renderMoneyInput('y3', 'Year +3')}
                        {renderMoneyInput('y4', 'Year +4')}
                   </div>
               </div>
            </div>

            {formData.initiatedBefore && (
               <div className="opacity-75 pt-6 border-t border-slate-200 dark:border-slate-800">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Previous Budget Context</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                   <div className="bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                      {renderInput('Previous Total Project Cost (kUSD)', 'prevTotalCost', 'number')}
                   </div>
                   <div className="hidden md:block"></div> {/* Spacer for grid */}
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Previous Budget Comments</label>
                    <textarea 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded px-4 py-3 text-sm min-h-[100px] bg-white dark:bg-slate-950 dark:text-white"
                      value={formData.prevComments}
                      onChange={(e) => handleChange('prevComments', e.target.value)}
                    />
                  </div>
               </div>
            )}
          </div>
        </div>
        
        {/* APPROVAL TAB */}
        <div className={activeTab === 'Approval' && !isPrinting ? 'block' : 'hidden'}>
           <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-800 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <CheckSquare className="text-blue-600 dark:text-blue-400"/>
                        Approval Workflow
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${STATUS_COLORS[formData.status]}`}>
                        Current Status: {formData.status}
                    </span>
                </div>

                {/* Workflow Steps Visualization */}
                <div className="flex items-center justify-between relative mb-12 mt-8 px-4">
                    {/* Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                    
                    {/* Step 1: Draft/Submitted */}
                    <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${formData.status !== Status.Draft ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'}`}>1</div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Submission</span>
                    </div>

                    {/* Step 2: CM Approval */}
                    <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${formData.status === Status.CMApproved || formData.status === Status.CEOApproved ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'}`}>2</div>
                         <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Country Manager</span>
                    </div>

                    {/* Step 3: CEO Approval */}
                    <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${formData.status === Status.CEOApproved ? 'bg-green-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'}`}>3</div>
                         <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">CEO Approval</span>
                    </div>
                </div>

                {/* APPROVAL ACTION BOX */}
                {canApprove ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase mb-4 flex items-center gap-2">
                           <AlertCircle size={16} className="text-blue-500" />
                           Pending Your Decision
                        </h3>
                        
                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Approval Comments / Instructions *
                            </label>
                            <textarea 
                                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] bg-white dark:bg-slate-950 dark:text-white"
                                placeholder="Enter your feedback here. Required for rejection or changes requested."
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button 
                                onClick={() => handleApprovalAction('REJECT')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 rounded-lg font-bold transition-colors dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50"
                            >
                                <XCircle size={18} /> REJECT
                            </button>
                            <button 
                                onClick={() => handleApprovalAction('REQUEST_CHANGES')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 rounded-lg font-bold transition-colors dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50"
                            >
                                <Undo2 size={18} /> REQUEST CHANGES
                            </button>
                            <button 
                                onClick={() => handleApprovalAction('APPROVE')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                <CheckCircle size={18} /> APPROVE PROJECT
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 px-4 bg-slate-100 dark:bg-slate-800 rounded border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                        {formData.status === Status.CEOApproved ? (
                            <div className="flex flex-col items-center gap-2">
                                <CheckCircle size={32} className="text-green-500" />
                                <span className="font-bold text-slate-700 dark:text-slate-300">Project Fully Approved</span>
                                <span className="text-sm">No further actions required.</span>
                            </div>
                        ) : formData.status === Status.Rejected ? (
                            <div className="flex flex-col items-center gap-2">
                                <XCircle size={32} className="text-red-500" />
                                <span className="font-bold text-slate-700 dark:text-slate-300">Project Rejected</span>
                                <span className="text-sm">This project has been rejected.</span>
                            </div>
                        ) : formData.status === Status.Revision ? (
                             <div className="flex flex-col items-center gap-2">
                                <Undo2 size={32} className="text-amber-500" />
                                <span className="font-bold text-slate-700 dark:text-slate-300">Returned for Revision</span>
                                <span className="text-sm">Waiting for Project Lead to update and resubmit.</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <History size={32} className="text-blue-400" />
                                <span className="font-bold text-slate-700 dark:text-slate-300">Waiting for Approval</span>
                                <span className="text-sm">Current Level: {formData.status}</span>
                                <span className="text-xs mt-2 text-slate-400">You do not have permission to approve at this stage.</span>
                            </div>
                        )}
                    </div>
                )}
             </div>

             {/* Approval History (Derived from comments and status changes) */}
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Approval History</h3>
             <div className="space-y-4">
                 {/* 
                    Filter comments that start with DECISION. 
                 */}
                 {formData.comments.filter(c => c.text.includes('**DECISION:')).length > 0 ? (
                     formData.comments.filter(c => c.text.includes('**DECISION:')).slice().reverse().map(comment => (
                         <div key={comment.id} className={`bg-white dark:bg-slate-900 border-l-4 ${getDecisionBorderColor(comment.text)} shadow-sm p-4 rounded-r-lg`}>
                             <div className="flex justify-between items-start mb-2">
                                 <div>
                                     <span className="font-bold text-slate-800 dark:text-slate-200 block">{comment.author}</span>
                                     <span className="text-xs text-slate-500 dark:text-slate-400">{comment.role}</span>
                                 </div>
                                 <span className="text-xs text-slate-400">{new Date(comment.timestamp).toLocaleString()}</span>
                             </div>
                             <div className="mb-2">
                                {comment.text.includes('APPROVED') && <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">APPROVED</span>}
                                {comment.text.includes('REJECTED') && <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">REJECTED</span>}
                                {comment.text.includes('CHANGES REQUESTED') && <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">CHANGES REQUESTED</span>}
                             </div>
                             <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap mt-2 pl-2 border-l-2 border-slate-100 dark:border-slate-800">
                                 {comment.text.replace(/\*\*DECISION: (.*?)\*\*/, (match, p1) => {
                                     return ''; 
                                 }).trim()}
                             </div>
                         </div>
                     ))
                 ) : (
                     <div className="text-slate-500 italic text-sm">No approval actions recorded yet.</div>
                 )}
             </div>
           </div>
        </div>

        {/* AUDIT TAB - Only shown if active and not printing */}
        <div className={activeTab === 'Audit Trail' && !isPrinting ? 'block' : 'hidden'}>
          <div className="animate-in fade-in duration-300">
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Field</th>
                    <th className="px-6 py-4">Old Value</th>
                    <th className="px-6 py-4">New Value</th>
                    <th className="px-6 py-4">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {formData.auditTrail.slice().reverse().map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium dark:text-slate-200">{log.user}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.field}</td>
                      <td className="px-6 py-4"><span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-100 dark:border-red-900/50 font-mono text-xs">{log.oldValue}</span></td>
                      <td className="px-6 py-4"><span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-100 dark:border-green-900/50 font-mono text-xs">{log.newValue}</span></td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-1 rounded border ${STATUS_COLORS[log.stage]}`}>{log.stage}</span>
                      </td>
                    </tr>
                  ))}
                  {formData.auditTrail.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-400">No changes recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COMMENTS TAB - Only shown if active and not printing */}
        <div className={activeTab === 'Comments' && !isPrinting ? 'block' : 'hidden'}>
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="space-y-2 mb-10">
              {/* Only map top-level comments (those without a parent) */}
              {formData.comments.filter(c => !c.parentId).map(comment => (
                <CommentThread 
                  key={comment.id} 
                  comment={comment}
                  allComments={formData.comments}
                  currentUser={currentUser}
                  isPrinting={isPrinting}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  onPostReply={postComment}
                />
              ))}
              
              {formData.comments.length === 0 && (
                <div className="text-center text-slate-400 py-16 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 shadow-sm">
                  <MessageSquare size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                  <p>No comments yet. Be the first to start a discussion.</p>
                </div>
              )}
            </div>
            
            {/* Main New Comment Box */}
            <div className="flex gap-6 items-start bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
               <div className="flex-1">
                 <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-3">New Conversation</h3>
                 <textarea 
                   className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y min-h-[120px] bg-white dark:bg-slate-950 dark:text-white"
                   placeholder="Start a new discussion topic..."
                   rows={4}
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                 />
                 <p className="text-xs text-slate-400 mt-2">Comments are visible to all approvers and maintained in the project history.</p>
               </div>
               <button 
                 onClick={() => postComment()}
                 disabled={!commentText.trim()}
                 className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md mt-8"
               >
                 <Send size={24} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};