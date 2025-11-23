
import React, { useState, useEffect } from 'react';
import { calculateProductionCost } from '../services/mathUtils';
import { ProductionCostInputs, ProductionCostResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ClipboardList, Calendar, DollarSign, Sprout, Scale, Droplets, Scissors, Box, ShoppingBag, Package } from 'lucide-react';
import HistoryPanel from '../components/HistoryPanel';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'];

const ProductionCostModule = () => {
  const [inputs, setInputs] = useState<ProductionCostInputs>({
    hectares: 10,
    plantsPerHectare: 1850,
    bunchWeightKg: 25, 
    
    landPreparation: { date: '2024-01-15', cost: 25000 },
    planting: { date: '2024-02-01', cost: 45000 },
    insecticides: { date: '2024-03-10', cost: 12000, quantity: 200 }, // Liters
    inspections: { date: '2024-03-15', cost: 5000 },
    fertilizers: { date: '2024-04-05', cost: 60000, quantity: 40, weightPerUnit: 50 }, // Bultos, 50kg/bulto
    labor: { date: '2024-04-20', cost: 120000 },
    fungicides: { date: '2024-05-12', cost: 35000, quantity: 300 }, // Liters
    pruning: { date: '2024-06-01', cost: 8000, quantity: 18000 }, // Bunches
    bagging: { date: '2024-07-15', cost: 15000, quantity: 17500 }, // Bunches
    harvestPacking: { date: '2024-09-01', cost: 85000, quantity: 2000 } // Boxes
  });

  const [result, setResult] = useState<ProductionCostResult | null>(null);

  useEffect(() => {
    setResult(calculateProductionCost(inputs));
  }, [inputs]);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleActivityChange = (activity: keyof ProductionCostInputs, field: 'date' | 'cost' | 'quantity' | 'weightPerUnit', value: string) => {
    setInputs(prev => ({
      ...prev,
      [activity]: {
        ...(prev[activity] as any),
        [field]: field === 'date' ? value : (parseFloat(value) || 0)
      }
    }));
  };

  const ActivityInput = ({ 
    label, 
    fieldKey, 
    colorClass,
    quantityLabel,
    weightLabel,
    QuantityIcon
  }: { 
    label: string; 
    fieldKey: keyof ProductionCostInputs; 
    colorClass: string;
    quantityLabel?: string;
    weightLabel?: string;
    QuantityIcon?: any;
  }) => {
    const activityData = inputs[fieldKey] as { date: string, cost: number, quantity?: number, weightPerUnit?: number };
    
    // Responsive grid layout adjustment
    const gridCols = quantityLabel 
      ? (weightLabel ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3') 
      : 'grid-cols-2';

    return (
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 hover:border-stone-300 transition-colors group">
        <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${colorClass}`}>{label}</div>
        <div className={`grid ${gridCols} gap-3`}>
           <div>
              <label className="block text-[10px] font-semibold text-stone-400 mb-1 flex items-center gap-1">
                <Calendar size={10}/> FECHA
              </label>
              <input 
                type="date" 
                value={activityData.date}
                onChange={(e) => handleActivityChange(fieldKey, 'date', e.target.value)}
                className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-600 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
           </div>
           {quantityLabel && (
             <div>
                <label className="block text-[10px] font-semibold text-stone-400 mb-1 flex items-center gap-1 uppercase">
                  {QuantityIcon && <QuantityIcon size={10}/>} {quantityLabel}
                </label>
                <input 
                  type="number" 
                  value={activityData.quantity || 0}
                  onChange={(e) => handleActivityChange(fieldKey, 'quantity', e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
             </div>
           )}
           {weightLabel && (
             <div>
                <label className="block text-[10px] font-semibold text-stone-400 mb-1 flex items-center gap-1 uppercase">
                  <Scale size={10}/> {weightLabel}
                </label>
                <input 
                  type="number" 
                  value={activityData.weightPerUnit || 0}
                  onChange={(e) => handleActivityChange(fieldKey, 'weightPerUnit', e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
             </div>
           )}
           <div>
              <label className="block text-[10px] font-semibold text-stone-400 mb-1 flex items-center gap-1">
                <DollarSign size={10}/> COSTO ($)
              </label>
              <input 
                type="number" 
                value={activityData.cost}
                onChange={(e) => handleActivityChange(fieldKey, 'cost', e.target.value)}
                className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-800 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Costos de Producción</h2>
            <p className="text-stone-500 mt-1 font-medium">Desglose detallado por etapa, insumos y costeo unitario</p>
        </div>
        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">Costeo Agrícola</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sprout size={16} className="text-emerald-600" /> Configuración General
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
               <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2">Hectáreas</label>
                  <input name="hectares" type="number" value={inputs.hectares} onChange={handleGeneralChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-stone-700" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2">Plantas / Ha</label>
                  <input name="plantsPerHectare" type="number" value={inputs.plantsPerHectare} onChange={handleGeneralChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-stone-700" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2">Peso Racimo (Kg)</label>
                  <input name="bunchWeightKg" type="number" value={inputs.bunchWeightKg} onChange={handleGeneralChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-stone-700" />
               </div>
            </div>

            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-t border-stone-100 pt-6">
              <ClipboardList size={16} className="text-emerald-600" /> Registro de Actividades
            </h3>
            
            <div className="flex flex-col gap-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <ActivityInput label="1. Preparación Tierra" fieldKey="landPreparation" colorClass="text-stone-600" />
                 <ActivityInput label="2. Plantación" fieldKey="planting" colorClass="text-emerald-600" />
               </div>
               
               {/* Chemicals */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ActivityInput label="3. Insecticidas" fieldKey="insecticides" colorClass="text-red-500" quantityLabel="Litros" QuantityIcon={Droplets} />
                  {/* Fertilizers - Special Layout */}
                  <div className="md:col-span-2 lg:col-span-2">
                    <ActivityInput label="4. Fertilizantes" fieldKey="fertilizers" colorClass="text-emerald-600" quantityLabel="Bultos" weightLabel="Kg / Bulto" QuantityIcon={Package} />
                  </div>
                  <ActivityInput label="5. Fungicidas" fieldKey="fungicides" colorClass="text-red-500" quantityLabel="Litros" QuantityIcon={Droplets} />
                  <ActivityInput label="6. Revisadas" fieldKey="inspections" colorClass="text-blue-500" />
               </div>

               {/* Labor Intensive */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ActivityInput label="7. Mano de Obra" fieldKey="labor" colorClass="text-stone-600" />
                  <ActivityInput label="8. Desperillado" fieldKey="pruning" colorClass="text-yellow-600" quantityLabel="Racimos" QuantityIcon={Scissors} />
                  <ActivityInput label="9. Embolsado" fieldKey="bagging" colorClass="text-blue-500" quantityLabel="Racimos" QuantityIcon={ShoppingBag} />
                  <ActivityInput label="10. Cosecha/Empaque" fieldKey="harvestPacking" colorClass="text-emerald-800" quantityLabel="Cajas" QuantityIcon={Box} />
               </div>
            </div>
          </div>

          <HistoryPanel<ProductionCostInputs>
             moduleKey="production_cost"
             currentData={inputs}
             onLoad={setInputs}
          />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
           {result && (
             <>
               <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-8 rounded-3xl shadow-xl shadow-yellow-200 text-emerald-950 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-2 text-emerald-900/60 font-bold text-xs uppercase tracking-widest mb-2">
                        <Sprout size={14}/> KPI Principal
                     </div>
                     <div className="text-5xl font-bold tracking-tight mb-1">${result.costPerBunch.toFixed(2)}</div>
                     <div className="text-lg font-medium text-emerald-900/80">Costo por Racimo (Estimado)</div>
                     
                     <div className="mt-6 pt-6 border-t border-emerald-900/10 grid grid-cols-2 gap-4">
                        <div>
                           <div className="text-xs font-bold opacity-60 uppercase">Costo por Kg</div>
                           <div className="text-2xl font-bold">${result.costPerKg.toFixed(2)}</div>
                        </div>
                        <div>
                           <div className="text-xs font-bold opacity-60 uppercase">Total Invertido</div>
                           <div className="text-2xl font-bold">${(result.totalCost/1000).toFixed(1)}k</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                  <h4 className="font-bold text-stone-700 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                     <Scale size={16}/> Eficiencia Operativa
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                     <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="text-sm text-stone-500 flex items-center gap-2"><Package size={14}/> Costo Fertilización / Bulto</span>
                        <span className="font-bold text-stone-800">${result.fertilizerCostPerSack.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="text-sm text-stone-500 flex items-center gap-2"><Droplets size={14}/> Costo Fungicida / Litro</span>
                        <span className="font-bold text-stone-800">${result.fungicideCostPerLiter.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="text-sm text-stone-500 flex items-center gap-2"><Scissors size={14}/> Costo Desperillado / Racimo</span>
                        <span className="font-bold text-stone-800">${result.pruningCostPerBunch.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="text-sm text-stone-500 flex items-center gap-2"><ShoppingBag size={14}/> Costo Embolsado / Racimo</span>
                        <span className="font-bold text-stone-800">${result.baggingCostPerBunch.toFixed(2)}</span>
                     </div>
                      <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="text-sm text-stone-500 flex items-center gap-2"><Box size={14}/> Costo Cosecha / Caja</span>
                        <span className="font-bold text-stone-800">${result.packingCostPerBox.toFixed(2)}</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white">
                  <h4 className="font-bold text-stone-700 mb-6">Distribución del Gasto</h4>
                  <div className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={result.categoryBreakdown}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                           >
                              {result.categoryBreakdown.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <Tooltip 
                              formatter={(val: number) => `$${val.toLocaleString()}`}
                              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                           />
                           <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductionCostModule;
