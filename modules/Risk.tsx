import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, ShieldAlert, Globe } from 'lucide-react';
import HistoryPanel from '../components/HistoryPanel';
import { RiskInputs } from '../types';

const RiskModule = () => {
  const [inputs, setInputs] = useState<RiskInputs>({
    baseExchangeRate: 20,
    exportVolume: 22000,
    priceUSD: 12,
    fixedCostsMXN: 3000000
  });

  const handleChange = (field: keyof RiskInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const sensitivityData = useMemo(() => {
    const data = [];
    const minRate = inputs.baseExchangeRate * 0.8;
    const maxRate = inputs.baseExchangeRate * 1.2;
    const step = (maxRate - minRate) / 20;

    for (let rate = minRate; rate <= maxRate; rate += step) {
      const incomeMXN = inputs.exportVolume * inputs.priceUSD * rate;
      const profit = incomeMXN - inputs.fixedCostsMXN;
      data.push({
        rate: parseFloat(rate.toFixed(2)),
        profit: parseFloat(profit.toFixed(0))
      });
    }
    return data;
  }, [inputs]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Riesgo Cambiario</h2>
            <p className="text-stone-500 mt-1 font-medium">Análisis de sensibilidad ante fluctuaciones del mercado</p>
        </div>
        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">Simulación</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Inputs */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Globe size={16} className="text-red-500"/> Variables
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2">TC Base (MXN/USD)</label>
                    <input type="number" value={inputs.baseExchangeRate} onChange={(e) => handleChange('baseExchangeRate', e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-semibold text-stone-700 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2">Volumen Exportación</label>
                    <input type="number" value={inputs.exportVolume} onChange={(e) => handleChange('exportVolume', e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-semibold text-stone-700 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2">Precio Venta (USD)</label>
                    <input type="number" value={inputs.priceUSD} onChange={(e) => handleChange('priceUSD', e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-semibold text-stone-700 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2">Costos Fijos (MXN)</label>
                    <input type="number" value={inputs.fixedCostsMXN} onChange={(e) => handleChange('fixedCostsMXN', e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-semibold text-stone-700 transition-all" />
                  </div>
                </div>
            </div>

            <HistoryPanel<RiskInputs>
              moduleKey="risk"
              currentData={inputs}
              onLoad={setInputs}
            />
         </div>

         {/* Chart */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white h-[450px]">
               <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-stone-700">Impacto en Utilidad Neta</h4>
                    <ShieldAlert className="text-stone-300" size={24}/>
               </div>
               <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={sensitivityData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis 
                        dataKey="rate" 
                        label={{ value: 'Tipo de Cambio ($)', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 12 }} 
                        domain={['auto', 'auto']}
                        axisLine={false} 
                        tickLine={false}
                        tick={{fill: '#9ca3af', fontSize: 12}}
                     />
                     <YAxis 
                        tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} 
                        axisLine={false} 
                        tickLine={false}
                        tick={{fill: '#9ca3af', fontSize: 12}}
                     />
                     <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                        formatter={(val: number) => `$${val.toLocaleString()}`} 
                     />
                     <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                     <ReferenceLine x={inputs.baseExchangeRate} stroke="#9ca3af" strokeDasharray="3 3" label={{ value: 'ACTUAL', fill: '#6b7280', fontSize: 10, position: 'top' }} />
                     <Line type="monotone" dataKey="profit" stroke="#dc2626" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-emerald-50/60 p-6 rounded-3xl border border-emerald-100 shadow-sm hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="bg-emerald-100 p-2 rounded-lg">
                         <TrendingUp className="text-emerald-600" size={20} />
                     </div>
                     <span className="text-sm font-bold text-emerald-800 uppercase tracking-wide">Optimista (+10%)</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 pl-1">
                     ${Math.round(((inputs.exportVolume * inputs.priceUSD * (inputs.baseExchangeRate * 1.1)) - inputs.fixedCostsMXN)).toLocaleString()}
                  </div>
               </div>
               <div className="bg-red-50/60 p-6 rounded-3xl border border-red-100 shadow-sm hover:bg-red-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="bg-red-100 p-2 rounded-lg">
                         <TrendingDown className="text-red-600" size={20} />
                     </div>
                     <span className="text-sm font-bold text-red-800 uppercase tracking-wide">Pesimista (-10%)</span>
                  </div>
                  <div className="text-2xl font-bold text-red-700 pl-1">
                     ${Math.round(((inputs.exportVolume * inputs.priceUSD * (inputs.baseExchangeRate * 0.9)) - inputs.fixedCostsMXN)).toLocaleString()}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RiskModule;