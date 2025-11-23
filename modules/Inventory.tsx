import React, { useState, useEffect } from 'react';
import { calculateInventory } from '../services/mathUtils';
import { InventoryInputs, InventoryResult } from '../types';
import { Package, ShoppingCart, DollarSign, BarChart3, Archive } from 'lucide-react';
import HistoryPanel from '../components/HistoryPanel';

const InventoryModule = () => {
  const [inputs, setInputs] = useState<InventoryInputs>({
    demandAnnual: 80000,
    orderingCost: 2800,
    holdingCostPerUnit: 0.60
  });

  const [result, setResult] = useState<InventoryResult | null>(null);

  useEffect(() => {
    setResult(calculateInventory(inputs));
  }, [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Gestión de Inventarios</h2>
            <p className="text-stone-500 mt-1 font-medium">Optimización de compras y almacenamiento</p>
        </div>
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">Modelo EOQ</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Archive size={16} className="text-purple-500"/> Datos de Entrada
            </h3>
            <div className="space-y-5">
              <div>
                 <label className="block text-xs font-bold text-stone-500 mb-2">Demanda Anual</label>
                 <div className="relative group">
                   <input 
                    name="demandAnnual" 
                    type="number" 
                    value={inputs.demandAnnual} 
                    onChange={handleChange}
                    className="w-full pl-12 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-semibold text-stone-700 transition-all"
                  />
                  <div className="absolute left-3 top-3 text-stone-400 group-focus-within:text-purple-500 transition-colors">
                      <Package size={20} />
                  </div>
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-stone-500 mb-2">Costo por Pedido ($)</label>
                 <div className="relative group">
                   <input 
                    name="orderingCost" 
                    type="number" 
                    value={inputs.orderingCost} 
                    onChange={handleChange}
                    className="w-full pl-12 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-semibold text-stone-700 transition-all"
                  />
                  <div className="absolute left-3 top-3 text-stone-400 group-focus-within:text-purple-500 transition-colors">
                      <ShoppingCart size={20} />
                  </div>
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-stone-500 mb-2">Costo Almacén ($/Unidad)</label>
                 <div className="relative group">
                   <input 
                    name="holdingCostPerUnit" 
                    type="number" 
                    value={inputs.holdingCostPerUnit} 
                    onChange={handleChange}
                    className="w-full pl-12 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-semibold text-stone-700 transition-all"
                  />
                  <div className="absolute left-3 top-3 text-stone-400 group-focus-within:text-purple-500 transition-colors">
                      <DollarSign size={20} />
                  </div>
                 </div>
              </div>
            </div>
          </div>

          <HistoryPanel<InventoryInputs>
            moduleKey="inventory"
            currentData={inputs}
            onLoad={setInputs}
          />
        </div>

        {/* Visualization */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {result && (
            <>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-10 rounded-3xl shadow-xl shadow-purple-200 relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div>
                        <div className="flex items-center gap-2 opacity-80 mb-2">
                            <BarChart3 size={20}/>
                            <span className="text-sm font-bold uppercase tracking-widest">Lote Económico (EOQ)</span>
                        </div>
                        <div className="text-6xl font-bold tracking-tight mb-2">{Math.round(result.eoq).toLocaleString()}</div>
                        <p className="text-lg text-purple-100 font-medium">Unidades por pedido ideal</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-xs">
                         <p className="text-sm leading-relaxed">
                            Este tamaño de lote equilibra perfectamente los costos de realizar pedidos y los costos de mantenimiento.
                         </p>
                      </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-white p-8 rounded-3xl shadow-lg shadow-stone-200/50 border border-white">
                      <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-3">Frecuencia</div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-bold text-stone-800">{result.ordersPerYear.toFixed(1)}</div>
                        <div className="text-stone-500 font-medium">pedidos / año</div>
                      </div>
                      <div className="mt-4 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                         <div className="h-full bg-purple-500 rounded-full" style={{width: '60%'}}></div>
                      </div>
                   </div>
                   <div className="bg-white p-8 rounded-3xl shadow-lg shadow-stone-200/50 border border-white">
                      <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-3">Costo Total Anual</div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-bold text-stone-800">${Math.round(result.totalCost).toLocaleString()}</div>
                        <div className="text-stone-500 font-medium">MXN</div>
                      </div>
                       <div className="mt-4 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                         <div className="h-full bg-stone-800 rounded-full" style={{width: '45%'}}></div>
                      </div>
                   </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryModule;