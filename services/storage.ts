
import { SavedScenario } from '../types';

const DB_PREFIX = 'bananera_db_';

export const saveScenario = <T>(moduleKey: string, name: string, data: T): SavedScenario<T> => {
  const key = `${DB_PREFIX}${moduleKey}`;
  const existingJson = localStorage.getItem(key);
  const existing: SavedScenario<T>[] = existingJson ? JSON.parse(existingJson) : [];

  const newScenario: SavedScenario<T> = {
    id: Date.now().toString(),
    name,
    date: new Date().toLocaleDateString('es-MX') + ' ' + new Date().toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'}),
    data
  };

  const updated = [newScenario, ...existing];
  localStorage.setItem(key, JSON.stringify(updated));
  return newScenario;
};

export const getScenarios = <T>(moduleKey: string): SavedScenario<T>[] => {
  const key = `${DB_PREFIX}${moduleKey}`;
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

export const deleteScenario = (moduleKey: string, id: string): void => {
  const key = `${DB_PREFIX}${moduleKey}`;
  const existingJson = localStorage.getItem(key);
  if (!existingJson) return;

  const existing: SavedScenario<any>[] = JSON.parse(existingJson);
  const updated = existing.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
};
