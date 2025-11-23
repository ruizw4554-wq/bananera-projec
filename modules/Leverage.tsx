import React, { useState, useEffect } from 'react';
import { calculateLeverageAnalysis } from '../services/mathUtils';
import { LeverageInputs, LeverageResult } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import HistoryPanel from '../components/HistoryPanel';
import { Scale, Info } from 'lucide-react';

const LeverageModule = () => {
  const [inputs, setInputs] = useState<LeverageInputs>({
    operatingIncome: 6000000,
    interestRate: 10,
    maxDebt: 5000000,
    stepSize: 250000
  });

  const [result, setResult] = useState<LeverageResult | null>(null);

  useEffect(() => {
    setResult(calculateLeverageAnalysis(inputs));
  }, [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Estrategia de Financiamiento</h2>
            <p className="text-stone-500 mt-1 font-medium">Análisis de Apalancamiento Financiero y ROE</p>
        </div>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">Estructura Capital</span>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white mb-8">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
           <div>
              <label className="block text-xs font-bold text-stone-500 mb-2">EBIT (Utilidad Operativa)</label>
              <input name="operatingIncome" type="number" value={inputs.operatingIncome} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold text-stone-700 transition-all" />
           </div>
           <div>
              <label className="block text-xs font-bold text-stone-500 mb-2">Tasa Interés (%)</label>
              <input name="interestRate" type="number" value={inputs.interestRate} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold text-stone-700 transition-all" />
           </div>
           <div>
              <label className="block text-xs font-bold text-stone-500 mb-2">Límite Deuda ($)</label>
              <input name="maxDebt" type="number" value={inputs.maxDebt} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-semibold text-stone-700 transition-all" />
           </div>
           <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-start gap-2">
             <Info size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
             <p className="text-xs text-orange-700/80 leading-snug">
                El modelo proyecta cómo varía el ROE al cambiar la proporción deuda/capital.
             </p>
           </div>
         </div>

         <HistoryPanel<LeverageInputs>
            moduleKey="leverage"
            currentData={inputs}
            onLoad={setInputs}
         />
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white h-[450px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-stone-700">Curva de Optimización (ROE vs Deuda)</h3>
                 <div className="flex items-center gap-2 text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Proyección
                 </div>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                 <LineChart data={result.dataPoints} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="debt" 
                      tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} 
                      label={{ value: 'Nivel de Deuda', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 12 }}
                      axisLine={false} 
                      tickLine={false}
                      tick={{fill: '#9ca3af', fontSize: 12}}
                    />
                    <YAxis 
                        label={{ value: 'ROE (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false}
                        tick={{fill: '#9ca3af', fontSize: 12}}
                    />
                    <Tooltip 
                      cursor={{stroke: '#fb923c', strokeWidth: 1, strokeDasharray: '3 3'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                      formatter={(val: any, name) => [name === 'roe' ? `${val.toFixed(2)}%` : val, name === 'roe' ? 'ROE' : name]}
                      labelFormatter={(label) => `Deuda: $${label.toLocaleString()}`}
                    />
                    <ReferenceLine x={result.optimalDebt} stroke="#ea580c" strokeDasharray="3 3" label={{ value: 'ÓPTIMO', fill: '#ea580c', fontSize: 10, position: 'top' }} />
                    <Line type="monotone" dataKey="roe" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>

           <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 rounded-3xl shadow-lg shadow-orange-200 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                 
                 <div className="relative z-10">
                    <div className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-2">Deuda Óptima</div>
                    <div className="text-4xl font-bold tracking-tight mb-4">${result.optimalDebt.toLocaleString()}</div>
                    <div className="h-px bg-white/20 w-full mb-4"></div>
                    <div className="flex items-center gap-3">
                         <div>
                            <div className="text-orange-100 text-xs font-medium">ROE Máximo</div>
                            <div className="text-2xl font-bold">{result.maxROE.toFixed(2)}%</div>
                         </div>
                         <Scale size={24} className="ml-auto text-orange-200" />
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-stone-100 p-6 rounded-3xl shadow-sm">
                 <h4 className="font-bold text-stone-700 mb-4 text-sm uppercase tracking-wide">Resumen de Escenarios</h4>
                 <ul className="space-y-4">
                    <li className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                       <span className="text-sm text-stone-500 font-medium">Conservador (Sin Deuda)</span>
                       <span className="font-bold text-stone-800">{result.dataPoints[0]?.roe.toFixed(2)}% ROE</span>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                       <span className="text-sm text-stone-500 font-medium">Agresivo (Max Deuda)</span>
                       <span className="font-bold text-stone-800">{result.dataPoints[result.dataPoints.length-1]?.roe.toFixed(2)}% ROE</span>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeverageModule;