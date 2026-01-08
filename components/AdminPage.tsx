
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Country, Role, User } from '../types';
import { Trash2, UserPlus, Edit2, Save, X, Settings, Database, Users, Calendar, AlertTriangle, Lock, Unlock, Plus } from 'lucide-react';
import { generateUUID } from '../utils';

export const AdminPage = () => {
  const { 
    users, addUser, updateUser, deleteUser, currentUser,
    settings, updateSettings, masterData, updateMasterData
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'users' | 'config' | 'masterdata'>('users');

  // USER MANAGEMENT STATE
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ name: '', role: Role.ProjectLead, country: Country.BR });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<User | null>(null);

  // CONFIGURATION STATE
  const [configForm, setConfigForm] = useState(settings);

  // MASTER DATA STATE
  const [dataForm, setDataForm] = useState(masterData);
  const [newItem, setNewItem] = useState('');

  // Access Control
  if (currentUser.role !== Role.Admin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
         <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-full mb-4">
            <X size={32} />
         </div>
         <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Access Denied</h2>
         <p className="mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  // --- USER HANDLERS ---
  const handleAddUser = () => {
    if (newUser.name && newUser.role && newUser.country) {
      addUser({
        id: generateUUID(),
        name: newUser.name,
        role: newUser.role,
        country: newUser.country
      });
      setNewUser({ name: '', role: Role.ProjectLead, country: Country.BR });
      setIsAdding(false);
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ ...user });
  };

  const saveEdit = () => {
    if (editForm) {
      updateUser(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDeleteUser = (userId: string, e?: React.MouseEvent) => {
    if(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (userId === currentUser.id) {
        alert("You cannot delete your own account while logged in.");
        return;
    }
    
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        deleteUser(userId);
    }
  };

  const handleSaveConfig = () => {
    updateSettings(configForm);
    alert("System configuration updated successfully.");
  };

  const handleLockDateChange = (country: string, date: string) => {
    setConfigForm(prev => ({
        ...prev,
        lockDates: { ...prev.lockDates, [country]: date || null }
    }));
  };

  const handleSaveMasterData = () => {
    updateMasterData(dataForm);
    alert("Master data updated successfully.");
  };

  const addItem = (listName: 'categories' | 'subcategories') => {
    if (newItem.trim()) {
        setDataForm(prev => ({
            ...prev,
            [listName]: [...prev[listName], newItem.trim()]
        }));
        setNewItem('');
    }
  };

  const removeItem = (listName: 'categories' | 'subcategories', item: string) => {
      setDataForm(prev => ({
          ...prev,
          [listName]: prev[listName].filter(i => i !== item)
      }));
  };
  
  const addConcession = (country: string, item: string) => {
      if (!item.trim()) return;
      const currentList = dataForm.concessions[country] || [];
      setDataForm(prev => ({
          ...prev,
          concessions: { ...prev.concessions, [country]: [...currentList, item.trim()] }
      }));
  };

  const removeConcession = (country: string, item: string) => {
      setDataForm(prev => ({
          ...prev,
          concessions: { ...prev.concessions, [country]: (prev.concessions[country] || []).filter(i => i !== item) }
      }));
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
       <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">System Administration</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure users, master data, and global application settings.</p>
        </div>
       </div>

       {/* Tabs */}
       <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-8 w-fit overflow-x-auto max-w-full">
           <button 
             onClick={() => setActiveTab('users')}
             className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
           >
             <Users size={16} /> User Management
           </button>
           <button 
             onClick={() => setActiveTab('config')}
             className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'config' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
           >
             <Settings size={16} /> System Config
           </button>
           <button 
             onClick={() => setActiveTab('masterdata')}
             className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'masterdata' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
           >
             <Database size={16} /> Master Data
           </button>
       </div>

       {/* TAB: USERS */}
       {activeTab === 'users' && (
         <div className="animate-in fade-in duration-300">
             <div className="flex justify-end mb-4">
                <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow-sm transition-colors"
                >
                <UserPlus size={18} /> Add User
                </button>
             </div>

            {/* Add User Form */}
            {isAdding && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-sm uppercase">Create New User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input 
                        type="text" 
                        placeholder="Full Name" 
                        className="border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-white"
                        value={newUser.name}
                        onChange={e => setNewUser({...newUser, name: e.target.value})}
                        />
                        <select 
                        className="border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-white"
                        value={newUser.role}
                        onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
                        >
                        {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <select 
                        className="border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-white"
                        value={newUser.country}
                        onChange={e => setNewUser({...newUser, country: e.target.value as Country})}
                        >
                        {Object.values(Country).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsAdding(false)} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
                        <button onClick={handleAddUser} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save User</button>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Country</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {users.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            {editingId === user.id && editForm ? (
                                <>
                                    <td className="px-6 py-4">
                                    <input 
                                        className="w-full border border-blue-300 rounded px-2 py-1 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                        value={editForm.name}
                                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                                    />
                                    </td>
                                    <td className="px-6 py-4">
                                    <select 
                                        className="w-full border border-blue-300 rounded px-2 py-1 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                        value={editForm.role}
                                        onChange={e => setEditForm({...editForm, role: e.target.value as Role})}
                                    >
                                        {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    </td>
                                    <td className="px-6 py-4">
                                    <select 
                                        className="w-full border border-blue-300 rounded px-2 py-1 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                        value={editForm.country}
                                        onChange={e => setEditForm({...editForm, country: e.target.value as Country})}
                                    >
                                        {Object.values(Country).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={saveEdit} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"><Save size={16}/></button>
                                        <button onClick={cancelEdit} className="p-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"><X size={16}/></button>
                                    </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{user.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                        user.role === Role.Admin ? 'bg-slate-800 text-white border-slate-700 dark:bg-slate-700' :
                                        user.role === Role.CountryManager ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300' :
                                        'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{user.country}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => startEdit(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/20"><Edit2 size={16}/></button>
                                        <button 
                                            type="button"
                                            onClick={(e) => handleDeleteUser(user.id, e)} 
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/20"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                                </>
                            )}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
       )}

       {activeTab === 'config' && (
           <div className="space-y-6 animate-in fade-in duration-300">
               <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                       <AlertTriangle className="text-amber-500" /> Global Announcement
                   </h3>
                   <div className="flex gap-4">
                       <input 
                         type="text" 
                         className="flex-1 border border-slate-300 dark:border-slate-700 rounded px-4 py-2 bg-white dark:bg-slate-950 dark:text-white"
                         placeholder="Enter a system-wide banner message..."
                         value={configForm.systemMessage}
                         onChange={(e) => setConfigForm({...configForm, systemMessage: e.target.value})}
                       />
                   </div>
               </div>

               <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <Calendar className="text-blue-500" /> Budget Cycle & Locking
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Active Budget Year</label>
                            <input 
                                type="number" 
                                className="border border-slate-300 dark:border-slate-700 rounded px-4 py-2 w-full bg-white dark:bg-slate-950 dark:text-white"
                                value={configForm.activeBudgetYear}
                                onChange={(e) => setConfigForm({...configForm, activeBudgetYear: Number(e.target.value)})}
                            />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                             <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase">Country Freeze Dates</h4>
                             <div className="space-y-3">
                                 {Object.values(Country).map(c => (
                                     <div key={c} className="flex items-center justify-between">
                                         <span className="font-medium text-slate-600 dark:text-slate-400 w-12">{c}</span>
                                         <div className="flex items-center gap-2">
                                             <input 
                                                type="date" 
                                                className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-900 dark:text-white"
                                                value={configForm.lockDates[c] || ''}
                                                onChange={(e) => handleLockDateChange(c, e.target.value)}
                                             />
                                             {configForm.lockDates[c] ? <Lock size={14} className="text-red-500" /> : <Unlock size={14} className="text-green-500" />}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
               </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                       <Lock className="text-purple-500" /> Approval Thresholds
                   </h3>
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">HQ Approval Limit (kUSD)</label>
                       <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                className="border border-slate-300 dark:border-slate-700 rounded px-4 py-2 w-48 bg-white dark:bg-slate-950 dark:text-white"
                                value={configForm.thresholds.ceoApprovalLimit}
                                onChange={(e) => setConfigForm({
                                    ...configForm, 
                                    thresholds: { ...configForm.thresholds, ceoApprovalLimit: Number(e.target.value) }
                                })}
                            />
                            <p className="text-sm text-slate-500">
                                Projects with total cost <strong>below</strong> this value will skip HQ Review (CM Approval is final). 
                                Set to 0 to require Admin HQ approval for all projects.
                            </p>
                       </div>
                   </div>
               </div>

               <div className="flex justify-end pt-4">
                   <button 
                     onClick={handleSaveConfig}
                     className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-colors"
                   >
                       <Save size={18} /> Save Configuration
                   </button>
               </div>
           </div>
       )}

       {activeTab === 'masterdata' && (
           <div className="space-y-8 animate-in fade-in duration-300">
               <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Project Categories</h3>
                   <div className="flex gap-2 mb-4">
                       <input 
                         className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm flex-1 bg-white dark:bg-slate-950 dark:text-white"
                         placeholder="Add new category..."
                         value={newItem}
                         onChange={(e) => setNewItem(e.target.value)}
                       />
                       <button onClick={() => addItem('categories')} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"><Plus size={18}/></button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                       {dataForm.categories.map(cat => (
                           <div key={cat} className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-slate-200 dark:border-slate-700 dark:text-slate-300">
                               {cat}
                               <button onClick={() => removeItem('categories', cat)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                           </div>
                       ))}
                   </div>
               </div>
               <div className="flex justify-end pt-4">
                   <button 
                     onClick={handleSaveMasterData}
                     className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-colors"
                   >
                       <Save size={18} /> Save Master Data
                   </button>
               </div>
           </div>
       )}
    </div>
  );
};
