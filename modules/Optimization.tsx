import React, { useState, useEffect } from 'react';
import { solveOptimization } from '../services/mathUtils';
import { OptimizationInputs, OptimizationResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import HistoryPanel from '../components/HistoryPanel';

const OptimizationModule = () => {
  const [inputs, setInputs] = useState<OptimizationInputs>({
    priceExportUSD: 12,
    priceNationalMXN: 140,
    exchangeRate: 20,
    maxCajas: 27000,
    minNational: 5000,
    laborExport: 0.003,
    laborNational: 0.002,
    maxLaborHours: 70
  });

  const [result, setResult] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    setResult(solveOptimization(inputs));
  }, [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const chartData = result ? [
    { name: 'Exportación', cajas: result.exportUnits },
    { name: 'Nacional', cajas: result.nationalUnits }
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Optimización de Producción</h2>
            <p className="text-stone-500 mt-1 font-medium">Asignación estratégica de recursos y mercados</p>
        </div>
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">Programación Lineal</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Calculator size={16} className="text-blue-500" /> Parámetros
            </h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2">Precio Exp. (USD)</label>
                    <input name="priceExportUSD" type="number" value={inputs.priceExportUSD} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-stone-700 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2">TC (MXN/USD)</label>
                    <input name="exchangeRate" type="number" value={inputs.exchangeRate} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-stone-700 transition-all" />
                  </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-2">Precio Nacional (MXN)</label>
                <input name="priceNationalMXN" type="number" value={inputs.priceNationalMXN} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-stone-700 transition-all" />
              </div>
              
              <div className="h-px bg-stone-100 my-2"></div>
              
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-2">Capacidad (Cajas)</label>
                <input name="maxCajas" type="number" value={inputs.maxCajas} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-stone-700 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2">Min. Nacional</label>
                    <input name="minNational" type="number" value={inputs.minNational} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-stone-700 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2">Horas MO</label>
                    <input name="maxLaborHours" type="number" value={inputs.maxLaborHours} onChange={handleChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-stone-700 transition-all" />
                  </div>
              </div>
            </div>
          </div>

          <HistoryPanel<OptimizationInputs> 
            moduleKey="optimization" 
            currentData={inputs} 
            onLoad={setInputs} 
          />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8 space-y-6">
          {result?.isFeasible ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Metric Card 1 */}
               <div className="bg-white p-6 rounded-3xl shadow-lg shadow-blue-100 border border-stone-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125"></div>
                 <div className="relative z-10">
                    <div className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Exportación</div>
                    <div className="text-3xl font-bold text-stone-800 tracking-tight">{result.exportUnits.toLocaleString()}</div>
                    <div className="text-sm font-medium text-blue-600 mt-2 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Cajas recomendadas
                    </div>
                 </div>
               </div>
               
               {/* Metric Card 2 */}
               <div className="bg-white p-6 rounded-3xl shadow-lg shadow-yellow-100 border border-stone-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125"></div>
                 <div className="relative z-10">
                    <div className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Nacional</div>
                    <div className="text-3xl font-bold text-stone-800 tracking-tight">{result.nationalUnits.toLocaleString()}</div>
                    <div className="text-sm font-medium text-yellow-600 mt-2 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Mínimo cumplido
                    </div>
                 </div>
               </div>

               {/* Metric Card 3 */}
               <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-xl shadow-emerald-200 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                 <div className="relative z-10">
                    <div className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Utilidad Semanal</div>
                    <div className="text-3xl font-bold tracking-tight">${result.maxProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <div className="text-sm font-medium text-emerald-100 mt-2 opacity-80">Máximo rendimiento</div>
                 </div>
               </div>
             </div>
          ) : (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex gap-4 items-start shadow-sm">
               <div className="bg-red-100 p-2 rounded-full">
                 <AlertCircle className="text-red-600" size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-red-800 text-lg">Solución no factible</h4>
                 <p className="text-red-600/80 mt-1 leading-relaxed">Las restricciones actuales son demasiado estrictas. Intenta aumentar las horas de mano de obra disponibles o reducir el requisito de demanda mínima nacional.</p>
               </div>
            </div>
          )}

          {/* Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-stone-700">Distribución de Producción</h3>
                <div className="flex gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Exportación</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Nacional</div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData} layout="vertical" margin={{left: 20}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 13, fontWeight: 500}} />
                <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="cajas" radius={[0, 6, 6, 0]} barSize={40}>
                   {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#facc15'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationModule;