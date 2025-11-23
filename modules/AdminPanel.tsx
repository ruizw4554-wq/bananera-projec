
import React, { useState, useEffect } from 'react';
import { getStoredAccounts, adminCreateUser, adminDeleteUser, adminResetPassword } from '../services/auth';
import { User } from '../types';
import { Users, UserPlus, Trash2, Shield, Key, Lock } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'USER'>('USER');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getStoredAccounts());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;

    try {
      adminCreateUser(newName, newEmail, newPassword, newRole);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('USER');
      loadUsers();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        adminDeleteUser(id);
        loadUsers();
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Administración de Usuarios</h2>
            <p className="text-stone-500 mt-1 font-medium">Control de acceso y gestión de cuentas del sistema</p>
        </div>
        <span className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">Panel Admin</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Create User Form */}
         <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-stone-200/50 border border-white">
               <div className="flex items-center gap-2 mb-6 text-stone-800 font-bold">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                     <UserPlus size={20} />
                  </div>
                  <h3>Nueva Cuenta</h3>
               </div>
               
               <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-stone-500 mb-1">Nombre Completo</label>
                     <input 
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-stone-700"
                        placeholder="Ej. Juan Pérez"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-stone-500 mb-1">Correo Electrónico</label>
                     <input 
                        type="email"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-stone-700"
                        placeholder="usuario@bananerapro.com"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-stone-500 mb-1">Contraseña Inicial</label>
                     <div className="relative">
                        <input 
                           type="text"
                           value={newPassword}
                           onChange={e => setNewPassword(e.target.value)}
                           className="w-full p-3 pl-10 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-stone-700"
                           placeholder="Contraseña segura"
                        />
                        <Key size={16} className="absolute left-3 top-3.5 text-stone-400" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-stone-500 mb-2">Rol del Sistema</label>
                     <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                           <input 
                              type="radio" 
                              name="role" 
                              checked={newRole === 'USER'} 
                              onChange={() => setNewRole('USER')}
                              className="text-emerald-600 focus:ring-emerald-500"
                           />
                           <span className="text-sm font-medium text-stone-700">Usuario</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                           <input 
                              type="radio" 
                              name="role" 
                              checked={newRole === 'ADMIN'} 
                              onChange={() => setNewRole('ADMIN')}
                              className="text-emerald-600 focus:ring-emerald-500"
                           />
                           <span className="text-sm font-medium text-stone-700">Administrador</span>
                        </label>
                     </div>
                  </div>

                  <button 
                     type="submit"
                     disabled={!newName || !newEmail || !newPassword}
                     className="w-full mt-4 bg-emerald-900 text-white font-bold py-3 rounded-xl hover:bg-emerald-950 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                  >
                     Crear Usuario
                  </button>
               </form>
            </div>
         </div>

         {/* User List */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-white overflow-hidden">
               <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-800 font-bold">
                     <Users size={20} className="text-stone-400"/>
                     <h3>Cuentas Activas ({users.length})</h3>
                  </div>
               </div>
               
               <div className="divide-y divide-stone-100">
                  {users.map((user) => (
                     <div key={user.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-4">
                           {user.photoUrl ? (
                              <img src={user.photoUrl} alt={user.name} className="w-10 h-10 rounded-full border border-stone-200 object-cover" />
                           ) : (
                              <div className="w-10 h-10 rounded-full bg-emerald-800 border border-stone-200 flex items-center justify-center text-emerald-100 font-bold">
                                 {user.name.charAt(0).toUpperCase()}
                              </div>
                           )}
                           
                           <div>
                              <div className="font-bold text-stone-800 text-sm">{user.name}</div>
                              <div className="text-xs text-stone-500">{user.email}</div>
                           </div>
                           {user.role === 'ADMIN' && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                                 <Shield size={10} /> ADMIN
                              </span>
                           )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* Passwords are strictly hidden in UI for security simulation */}
                            <div className="flex items-center gap-1 text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
                               <Lock size={10} />
                               <span>{user.password ? '••••••' : 'Sin clave'}</span>
                            </div>

                            {user.id !== 'admin-001' && (
                              <button 
                                 onClick={() => handleDelete(user.id)}
                                 className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                 title="Eliminar Usuario"
                              >
                                 <Trash2 size={16} />
                              </button>
                            )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;
