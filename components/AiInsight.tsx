import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateBusinessInsight } from '../services/gemini';

interface AiInsightProps {
  moduleName: string;
  data: any;
}

const AiInsight: React.FC<AiInsightProps> = ({ moduleName, data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateBusinessInsight(moduleName, data);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-indigo-900 font-semibold">
          <Sparkles size={18} className="text-indigo-600" />
          <h3>Consultor Virtual (Gemini AI)</h3>
        </div>
        {!insight && (
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-white text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" size={14}/> : null}
            {loading ? 'Analizando...' : 'Generar Análisis'}
          </button>
        )}
      </div>
      
      {insight && (
        <div className="prose prose-sm max-w-none text-indigo-900/80 leading-relaxed animate-in fade-in duration-500">
          <p>{insight}</p>
          <div className="mt-3 flex justify-end">
            <button 
              onClick={handleGenerate} 
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <RefreshCw size={12} /> Regenerar
            </button>
          </div>
        </div>
      )}
      {!insight && !loading && (
        <p className="text-sm text-indigo-400 italic">
          Haz clic para obtener una recomendación estratégica basada en los resultados actuales.
        </p>
      )}
    </div>
  );
};

export default AiInsight;