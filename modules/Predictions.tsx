
import React, { useState, useEffect } from 'react';
import { generatePredictions, PredictionResponse } from '../services/gemini';
import { BrainCircuit, Activity, RefreshCw, Bug, TrendingUp, DollarSign, BarChart3, Wifi } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PredictionsModule = () => {
  const [data, setData] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Simulate loading initial data
  useEffect(() => {
    if (!hasLoaded) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generatePredictions();
    if (result) {
      setData(result);
      setHasLoaded(true);
    }
    setLoading(false);
  };

  const chartData = data?.weeklyProductionForecast.map((val, i) => ({
    week: `Semana +${i + 1}`,
    produccion: val
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight flex items-center gap-3">
               Predicciones Inteligentes <BrainCircuit className="text-purple-500" />
            </h2>
            <p className="text-stone-500 mt-1 font-medium">Análisis predictivo en tiempo real basado en datos de sensores y mercado</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black disabled:opacity-70 flex items-center gap-2 transition-all shadow-lg shadow-stone-800/20"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? 'Analizando...' : 'Actualizar Pronósticos'}
        </button>
      </div>

      {data ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Metrics & Pest */}
          <div className="lg:col-span-4 space-y-6">
             
             {/* IoT Status */}
             <div className="bg-stone-900 text-stone-300 p-4 rounded-2xl flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                   <Wifi size={14} className="text-emerald-400 animate-pulse"/>
                   <span>Sensores Campo #4: Conectados</span>
                </div>
                <div className="flex gap-3">
                   <span>Temp: 30°C</span>
                   <span>Humedad: 85%</span>
                </div>
             </div>

             {/* Market Metrics */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
                   <div className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                      <DollarSign size={12} /> Precio Int. (USD)
                   </div>
                   <div className="text-2xl font-bold text-stone-800">${data.predictedPriceUSD.toFixed(2)}</div>
                   <div className="text-xs text-emerald-600 mt-1 font-semibold">Proyección Semanal</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
                   <div className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                      <TrendingUp size={12} /> Tipo de Cambio
                   </div>
                   <div className="text-2xl font-bold text-stone-800">${data.predictedExchangeRate.toFixed(2)}</div>
                   <div className="text-xs text-stone-500 mt-1 font-semibold">MXN / USD</div>
                </div>
             </div>

             {/* Demand Card */}
             <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200">
                 <div className="flex justify-between items-start mb-2">
                    <div className="text-blue-100 text-xs font-bold uppercase tracking-widest">Demanda Estimada</div>
                    <Activity size={18} className="text-blue-200" />
                 </div>
                 <div className="text-4xl font-bold tracking-tight">+{data.predictedDemandGrowth}%</div>
                 <p className="text-blue-100/80 text-sm mt-2">Crecimiento esperado en pedidos para la próxima semana.</p>
             </div>

             {/* Pest Risk Card */}
             <div className={`p-6 rounded-2xl border-l-4 shadow-sm ${
                data.pestRiskLevel === 'BAJO' ? 'bg-emerald-50 border-emerald-500' :
                data.pestRiskLevel === 'MEDIO' ? 'bg-yellow-50 border-yellow-500' :
                'bg-red-50 border-red-500'
             }`}>
                 <div className="flex items-center gap-2 mb-3">
                    <Bug size={20} className={
                      data.pestRiskLevel === 'BAJO' ? 'text-emerald-600' :
                      data.pestRiskLevel === 'MEDIO' ? 'text-yellow-600' : 'text-red-600'
                    } />
                    <h3 className={`font-bold ${
                       data.pestRiskLevel === 'BAJO' ? 'text-emerald-800' :
                       data.pestRiskLevel === 'MEDIO' ? 'text-yellow-800' : 'text-red-800'
                    }`}>Riesgo de Plagas: {data.pestRiskLevel}</h3>
                 </div>
                 <p className="text-sm text-stone-600 leading-relaxed">
                    {data.pestRiskAnalysis}
                 </p>
             </div>
          </div>

          {/* Right Column: Production Chart & Summary */}
          <div className="lg:col-span-8 space-y-6">
             {/* Chart */}
             <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-white h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-stone-700 flex items-center gap-2">
                       <BarChart3 size={18} className="text-purple-500"/> Pronóstico de Producción
                    </h3>
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Próximas 4 Semanas</span>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                   <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                          formatter={(val) => [`${val} Cajas`, 'Producción']} 
                      />
                      <Area type="monotone" dataKey="produccion" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>

             {/* AI Executive Summary */}
             <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 relative">
                <div className="absolute top-6 right-6">
                   <BrainCircuit size={24} className="text-stone-200" />
                </div>
                <h4 className="font-bold text-stone-800 mb-3 uppercase text-xs tracking-widest">Análisis Ejecutivo IA</h4>
                <p className="text-stone-600 leading-relaxed text-sm">
                   {data.generalAnalysis}
                </p>
             </div>
          </div>
        </div>
      ) : (
         <div className="h-96 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-stone-100">
            <div className="p-4 bg-stone-50 rounded-full mb-4">
               <BrainCircuit size={32} className="text-stone-300" />
            </div>
            <p className="text-stone-400 font-medium">Generando modelos predictivos...</p>
         </div>
      )}
    </div>
  );
};

export default PredictionsModule;
