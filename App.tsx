
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import OptimizationModule from './modules/Optimization';
import InventoryModule from './modules/Inventory';
import FinancialModule from './modules/Financial';
import LeverageModule from './modules/Leverage';
import RiskModule from './modules/Risk';
import ProductionCostModule from './modules/ProductionCost';
import AdminPanel from './modules/AdminPanel';
import PredictionsModule from './modules/Predictions';
import { ModuleType, User } from './types';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentModule(ModuleType.DASHBOARD);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderModule = () => {
    switch (currentModule) {
      case ModuleType.OPTIMIZATION:
        return <OptimizationModule />;
      case ModuleType.INVENTORY:
        return <InventoryModule />;
      case ModuleType.FINANCIAL:
        return <FinancialModule />;
      case ModuleType.LEVERAGE:
        return <LeverageModule />;
      case ModuleType.RISK:
        return <RiskModule />;
      case ModuleType.PRODUCTION_COST:
        return <ProductionCostModule />;
      case ModuleType.ADMIN_PANEL:
        return <AdminPanel />;
      case ModuleType.PREDICTIONS:
        return <PredictionsModule />;
      default:
        return <Dashboard onChangeModule={setCurrentModule} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentModule={currentModule} 
      onModuleChange={setCurrentModule} 
      user={user}
      onLogout={handleLogout}
      onUserUpdate={handleUserUpdate}
    >
      {renderModule()}
    </Layout>
  );
};

export default App;
