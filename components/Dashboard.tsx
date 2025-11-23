import React from 'react';
import { ModuleType } from '../types';
import { TrendingUp, Package, DollarSign, ArrowRight, Sprout, ClipboardList } from 'lucide-react';

const Dashboard = ({ onChangeModule }: { onChangeModule: (m: ModuleType) => void }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-emerald-800"></div>
        {/* Abstract pattern */}
        <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-emerald-600/20 to-transparent transform skew-x-12 translate-x-20"></div>
        <div className="absolute right-0 bottom-0 h-64 w-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
             <div className="flex items-center gap-2 text-emerald-300 mb-4 font-semibold tracking-wider text-sm uppercase">
                <Sprout size={16} /> Sistema de Gestión Inteligente
             </div>
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
               Bienvenido a <span className="text-yellow-400">BananeraPro</span>
             </h2>
             <p className="text-emerald-100 text-lg leading-relaxed max-w-lg">
               Optimiza tu producción, gestiona inventarios y evalúa proyectos financieros con herramientas diseñadas para el agro chiapaneco.
             </p>
          </div>
          
          <div className="hidden md:block">
             {/* Decorative Element */}
             <div className="w-32 h-32 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 flex items-center justify-center transform rotate-6 group-hover:rotate-12 transition-transform duration-500">
                <div className="text-6xl">🍌</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Costos */}
        <button 
          onClick={() => onChangeModule(ModuleType.PRODUCTION_COST)}
          className="group relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-stone-100 hover:-translate-y-1 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-yellow-600 transition-colors">Costos Producción</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-4">
              Control de fechas y costos por racimo y kilo.
            </p>
            <div className="flex items-center text-yellow-600 font-semibold text-xs">
              Acceder <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        {/* Card Optimización */}
        <button 
          onClick={() => onChangeModule(ModuleType.OPTIMIZATION)}
          className="group relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-stone-100 hover:-translate-y-1 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-blue-700 transition-colors">Optimización</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-4">
              Mezcla exacta de exportación vs nacional.
            </p>
            <div className="flex items-center text-blue-600 font-semibold text-xs">
              Acceder <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        {/* Card Inventarios */}
        <button 
          onClick={() => onChangeModule(ModuleType.INVENTORY)}
          className="group relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-stone-100 hover:-translate-y-1 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Package size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-purple-700 transition-colors">Inventarios</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-4">
              Minimiza costos EOQ y frecuencia óptima.
            </p>
            <div className="flex items-center text-purple-600 font-semibold text-xs">
              Acceder <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        {/* Card Finanzas */}
        <button 
          onClick={() => onChangeModule(ModuleType.FINANCIAL)}
          className="group relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-stone-100 hover:-translate-y-1 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <DollarSign size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-emerald-700 transition-colors">Finanzas</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-4">
              Evaluación de proyectos (VAN, TIR).
            </p>
            <div className="flex items-center text-emerald-600 font-semibold text-xs">
              Acceder <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;