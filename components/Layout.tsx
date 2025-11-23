
import React, { useRef } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Scale, 
  AlertTriangle,
  Banana,
  Menu,
  ChevronRight,
  ClipboardList,
  LogOut,
  User as UserIcon,
  Settings,
  Camera,
  BrainCircuit
} from 'lucide-react';
import { ModuleType, User } from '../types';
import { updateUserPhoto } from '../services/auth';

interface LayoutProps {
  currentModule: ModuleType;
  onModuleChange: (m: ModuleType) => void;
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onUserUpdate?: (user: User) => void;
}

const NavItem = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: any; 
  label: string; 
}) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center justify-between px-5 py-4 text-sm font-medium transition-all duration-200 border-l-4 ${
      active 
        ? 'bg-emerald-900/50 text-white border-yellow-400 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.1)]' 
        : 'text-emerald-100/60 hover:bg-emerald-900/30 hover:text-white border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className={`transition-colors ${active ? 'text-yellow-400' : 'text-emerald-400/60 group-hover:text-emerald-400'}`} />
      <span>{label}</span>
    </div>
    {active && <ChevronRight size={16} className="text-yellow-400" />}
  </button>
);

const Layout: React.FC<LayoutProps> = ({ currentModule, onModuleChange, children, user, onLogout, onUserUpdate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user && onUserUpdate) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedUser = updateUserPhoto(user.id, base64String);
        onUserUpdate(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-stone-50">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-emerald-950 shadow-2xl transform transition-transform duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col
      `}>
        {/* Brand Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <Banana className="text-emerald-950" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-white text-xl tracking-tight">BananeraPro</h1>
              <p className="text-emerald-400/60 text-xs font-medium tracking-wide">MANAGEMENT SUITE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-6 py-2 mb-2 text-xs font-bold text-emerald-600/80 uppercase tracking-widest">Principal</div>
          <NavItem 
            active={currentModule === ModuleType.DASHBOARD}
            onClick={() => onModuleChange(ModuleType.DASHBOARD)}
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <NavItem 
            active={currentModule === ModuleType.PREDICTIONS}
            onClick={() => onModuleChange(ModuleType.PREDICTIONS)}
            icon={BrainCircuit}
            label="Predicciones IA"
          />
          
          <div className="px-6 py-2 mt-8 mb-2 text-xs font-bold text-emerald-600/80 uppercase tracking-widest">Operaciones</div>
          <NavItem 
            active={currentModule === ModuleType.PRODUCTION_COST}
            onClick={() => onModuleChange(ModuleType.PRODUCTION_COST)}
            icon={ClipboardList}
            label="Costos Producción"
          />
          <NavItem 
            active={currentModule === ModuleType.OPTIMIZATION}
            onClick={() => onModuleChange(ModuleType.OPTIMIZATION)}
            icon={TrendingUp}
            label="Optimización"
          />
          <NavItem 
            active={currentModule === ModuleType.INVENTORY}
            onClick={() => onModuleChange(ModuleType.INVENTORY)}
            icon={Package}
            label="Inventarios"
          />
          
          <div className="px-6 py-2 mt-8 mb-2 text-xs font-bold text-emerald-600/80 uppercase tracking-widest">Finanzas</div>
          <NavItem 
            active={currentModule === ModuleType.FINANCIAL}
            onClick={() => onModuleChange(ModuleType.FINANCIAL)}
            icon={DollarSign}
            label="Eval. Financiera"
          />
          <NavItem 
            active={currentModule === ModuleType.LEVERAGE}
            onClick={() => onModuleChange(ModuleType.LEVERAGE)}
            icon={Scale}
            label="Apalancamiento"
          />
          <NavItem 
            active={currentModule === ModuleType.RISK}
            onClick={() => onModuleChange(ModuleType.RISK)}
            icon={AlertTriangle}
            label="Riesgo Cambiario"
          />

          {user?.role === 'ADMIN' && (
            <>
              <div className="px-6 py-2 mt-8 mb-2 text-xs font-bold text-emerald-600/80 uppercase tracking-widest">Administración</div>
              <NavItem 
                active={currentModule === ModuleType.ADMIN_PANEL}
                onClick={() => onModuleChange(ModuleType.ADMIN_PANEL)}
                icon={Settings}
                label="Gestionar Usuarios"
              />
            </>
          )}
        </nav>

        {/* User Profile / Footer Area */}
        <div className="p-4 bg-emerald-950/50 border-t border-emerald-900">
           <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-900/50 transition-colors group">
              <div className="relative cursor-pointer" onClick={handlePhotoClick} title="Cambiar foto">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt={user.name} className="w-9 h-9 rounded-full border border-emerald-700 object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-200 font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16}/>}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={12} className="text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                 <div className="text-sm font-medium text-emerald-100 truncate">{user?.name || 'Usuario'}</div>
                 <div className="flex items-center gap-1.5">
                   <div className="text-[10px] text-emerald-500 truncate">{user?.email || 'Invitado'}</div>
                   {user?.role === 'ADMIN' && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" title="Admin"></span>}
                 </div>
              </div>

              <button 
                onClick={onLogout} 
                className="p-1.5 text-emerald-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Cerrar Sesión"
              >
                <LogOut size={16} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-stone-50">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
         }}></div>

        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-stone-200 p-4 flex items-center justify-between z-10 sticky top-0">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                <Banana className="text-emerald-950" size={18} />
              </div>
              <span className="font-bold text-stone-800">BananeraPro</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-stone-100 rounded-lg">
             <Menu className="text-stone-600" />
           </button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative z-0 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
