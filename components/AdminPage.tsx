import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Country, Role, User } from '../types';
import { Trash2, UserPlus, Edit2, Save, X } from 'lucide-react';
import { generateUUID } from '../utils';

export const AdminPage = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useApp();
  
  // State for adding new user
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    role: Role.ProjectLead,
    country: Country.BR
  });

  // State for editing existing user
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<User | null>(null);

  // If not admin, access denied (simple check, ideally guarded by route too)
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

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
        alert("You cannot delete your own account while logged in.");
        return;
    }
    // REVERTED: Removed confirmation dialog per request
    deleteUser(userId);
  };

  return (
    <div className="max-w-5xl mx-auto">
       <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">User Administration</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage system users, assign roles, and configure regional access.</p>
        </div>
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
                                 user.role === Role.CEO ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' :
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
                                    onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }} 
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
  );
};