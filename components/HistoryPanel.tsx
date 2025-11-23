import React, { useState, useEffect } from 'react';
import { Save, Trash2, Upload, Database, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { saveScenario, getScenarios, deleteScenario } from '../services/storage';
import { SavedScenario } from '../types';

interface HistoryPanelProps<T> {
  moduleKey: string;
  currentData: T;
  onLoad: (data: T) => void;
}

const HistoryPanel = <T extends any>({ moduleKey, currentData, onLoad }: HistoryPanelProps<T>) => {
  const [scenarios, setScenarios] = useState<SavedScenario<T>[]>([]);
  const [newName, setNewName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadScenarios();
  }, [moduleKey]);

  const loadScenarios = () => {
    setScenarios(getScenarios<T>(moduleKey));
  };

  const handleSave = () => {
    if (!newName.trim()) return;
    saveScenario(moduleKey, newName, currentData);
    setNewName('');
    loadScenarios();
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      deleteScenario(moduleKey, id);
      loadScenarios();
    }
  };

  return (
    <div className="bg-stone-100 rounded-2xl p-1 mt-8 border border-stone-200 shadow-inner">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3 text-stone-800">
            <div className="p-2 bg-stone-100 rounded-lg">
               <Database size={20} className="text-stone-500" />
            </div>
            <div>
               <h3 className="font-bold text-base">Base de Datos</h3>
               <p className="text-xs text-stone-400 font-medium">Guarda y carga escenarios</p>
            </div>
          </div>
        </div>

        {/* Save Section */}
        <div className="flex gap-3 mb-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre del escenario (ej. Enero 2025)"
              className="w-full pl-4 pr-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-stone-400 font-medium text-stone-700"
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={!newName.trim()}
            className="bg-stone-800 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black disabled:opacity-40 disabled:hover:bg-stone-800 flex items-center gap-2 transition-all shadow-lg shadow-stone-800/20"
          >
            <Save size={18} /> Guardar
          </button>
        </div>

        {/* Toggle List */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 py-2 mt-2 text-xs font-bold text-stone-400 hover:text-stone-600 uppercase tracking-wider transition-colors"
          >
            {isOpen ? 'Ocultar Registros' : `Ver Historial (${scenarios.length})`}
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* List Section */}
        {isOpen && (
          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {scenarios.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-stone-100 rounded-xl">
                <Database className="mx-auto text-stone-200 mb-2" size={24} />
                <p className="text-stone-400 text-sm font-medium">No hay registros guardados.</p>
              </div>
            ) : (
              scenarios.map((scenario) => (
                <div key={scenario.id} className="group bg-stone-50 hover:bg-blue-50/30 p-4 rounded-xl border border-stone-100 hover:border-blue-100 flex items-center justify-between transition-all duration-200">
                  <div>
                    <div className="font-bold text-stone-700 text-sm group-hover:text-blue-700 transition-colors">{scenario.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1.5 font-medium">
                      <Clock size={12} /> {scenario.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onLoad(scenario.data)}
                      className="p-2 text-blue-600 bg-white hover:bg-blue-600 hover:text-white border border-stone-200 hover:border-blue-600 rounded-lg transition-all shadow-sm"
                      title="Cargar datos"
                    >
                      <Upload size={16} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleDelete(scenario.id)}
                      className="p-2 text-stone-400 bg-white hover:bg-red-50 hover:text-red-500 border border-stone-200 hover:border-red-100 rounded-lg transition-all shadow-sm"
                      title="Eliminar"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;