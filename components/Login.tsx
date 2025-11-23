
import React, { useState } from 'react';
import { Banana, Loader2, Lock, Mail, AlertCircle } from 'lucide-react';
import { verifyCredentials } from '../services/auth';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const authenticatedUser = await verifyCredentials(email, password);
      if (authenticatedUser) {
        onLogin(authenticatedUser);
      }
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Green Gradient Blob */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/20 to-yellow-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-900/10 to-transparent rounded-full blur-3xl"></div>

      {/* Landing / Login Content */}
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-stone-200 border border-white overflow-hidden transition-all duration-500">
          
          {/* Header Section */}
          <div className="p-10 pb-6 text-center">
             <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/30 transform -rotate-6">
                <Banana className="text-emerald-950" size={32} strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-stone-800 mb-2 tracking-tight">BananeraPro</h1>
            <p className="text-stone-500 text-sm font-medium">Sistema de Gestión para Productoras</p>
          </div>

          {/* Form Section */}
          <div className="px-10 pb-10">
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase tracking-wide">Correo Electrónico</label>
                  <div className="relative">
                      <input 
                        type="email" 
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@bananerapro.com"
                        className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-stone-800 font-medium placeholder:text-stone-400"
                      />
                      <Mail size={18} className="absolute left-3 top-3.5 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase tracking-wide">Contraseña</label>
                  <div className="relative">
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-4 py-3 bg-stone-50 border ${error ? 'border-red-300 focus:ring-red-200' : 'border-stone-200 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-xl focus:ring-4 outline-none transition-all text-stone-800 font-medium placeholder:text-stone-400`}
                      />
                      <Lock size={18} className="absolute left-3 top-3.5 text-stone-400" />
                  </div>
                </div>

                {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-red-600 text-xs font-medium animate-in slide-in-from-top-1">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" /> 
                    <span>{error}</span>
                </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading || !password || !email}
                  className="w-full bg-stone-800 text-white font-bold py-3 rounded-xl hover:bg-black transition-all shadow-lg shadow-stone-200 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2 mt-4"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Iniciar Sesión'}
                </button>
            </form>
          </div>
        </div>
        
        <div className="text-center mt-6">
           <p className="text-stone-400 text-[10px] font-bold tracking-widest uppercase opacity-50">Chiapas Production Systems v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
