import React, { useState, useEffect } from 'react';
import { calculateFinancials } from '../services/mathUtils';
import { FinancialInputs, FinancialResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import HistoryPanel from '../components/HistoryPanel';
import { Coins, TrendingUp, Clock } from 'lucide-react';

const FinancialModule = () => {
  const [inputs, setInputs] = useState<FinancialInputs>({
    initialInvestment: 5400000,
    annualCashFlow: 2100000,
    projectLife: 5,
    discountRate: 11
  });

  const [result, setResult] = useState<FinancialResult | null>(null);

  useEffect(() => {
    setResult(calculateFinancials(inputs));
  }, [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const chartData = result ? result.cashFlows.map((cf, index) => ({
    year: `Año ${index}`,
    flujo: cf,
    acumulado: index === 0 ? cf : (cf * index) - inputs.initialInvestment
  })) : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Evaluación de Proyectos</h2>
            <p className="text-stone-500 mt-1 font-medium">Análisis de rentabilidad y viabilidad de inversión</p>
        </div>
        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">Finanzas</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Coins size={16} className="text-emerald-500"/> Inputs
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2">Inversión Inicial ($)</label>
                  <input name="initialInvestment" type="number" value={inputs.initialInvestment} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-stone-700 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2">Flujo Neto Anual ($)</label>
                  <input name="annualCashFlow" type="number" value={inputs.annualCashFlow} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-stone-700 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 mb-2">Vida (Años)</label>
                        <input name="projectLife" type="number" value={inputs.projectLife} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-stone-700 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-500 mb-2">Tasa (%)</label>
                        <input name="discountRate" type="number" value={inputs.discountRate} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-stone-700 transition-all" />
                    </div>
                </div>
              </div>
           </div>

           <HistoryPanel<FinancialInputs>
            moduleKey="financial"
            currentData={inputs}
            onLoad={setInputs}
           />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {result && (
            <>
              <div className="grid grid-cols-3 gap-6">
                 <div className={`p-6 rounded-3xl border shadow-lg transition-all ${result.van > 0 ? 'bg-emerald-50/80 border-emerald-100 shadow-emerald-100/50' : 'bg-red-50/80 border-red-100 shadow-red-100/50'}`}>
                    <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${result.van > 0 ? 'text-emerald-600' : 'text-red-600'}`}>VAN (Neto)</div>
                    <div className={`text-3xl font-bold tracking-tight ${result.van > 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                      ${Math.round(result.van).toLocaleString()}
                    </div>
                    <div className={`text-xs font-bold mt-3 py-1 px-2 inline-block rounded ${result.van > 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                        {result.van > 0 ? 'VIABLE' : 'NO VIABLE'}
                    </div>
                 </div>
                 
                 <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-lg shadow-stone-200/50">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-2"><TrendingUp size={14}/> TIR</div>
                    <div className="text-3xl font-bold text-stone-800">{result.tir.toFixed(2)}%</div>
                    <p className="text-xs text-stone-400 mt-2">Tasa Interna de Retorno</p>
                 </div>
                 
                 <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-lg shadow-stone-200/50">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Clock size={14}/> Payback</div>
                    <div className="text-3xl font-bold text-stone-800">{result.payback.toFixed(1)} <span className="text-lg font-semibold text-stone-400">años</span></div>
                     <p className="text-xs text-stone-400 mt-2">Recuperación de inversión</p>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white h-[400px]">
                <h4 className="font-bold text-stone-700 mb-6">Proyección de Flujo de Caja</h4>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFlujo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                        formatter={(val) => `$${val.toLocaleString()}`} 
                    />
                    <Area type="monotone" dataKey="flujo" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorFlujo)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialModule;