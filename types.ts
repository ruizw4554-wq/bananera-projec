
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  OPTIMIZATION = 'OPTIMIZATION',
  INVENTORY = 'INVENTORY',
  FINANCIAL = 'FINANCIAL',
  LEVERAGE = 'LEVERAGE',
  RISK = 'RISK',
  PRODUCTION_COST = 'PRODUCTION_COST',
  ADMIN_PANEL = 'ADMIN_PANEL',
  PREDICTIONS = 'PREDICTIONS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role?: 'ADMIN' | 'USER';
}

// Generic Storage Type
export interface SavedScenario<T> {
  id: string;
  name: string;
  date: string;
  data: T;
}

// Optimization Types
export interface OptimizationInputs {
  priceExportUSD: number;
  priceNationalMXN: number;
  exchangeRate: number;
  maxCajas: number;
  minNational: number;
  laborExport: number; // hours per unit
  laborNational: number; // hours per unit
  maxLaborHours: number;
}

export interface OptimizationResult {
  exportUnits: number;
  nationalUnits: number;
  maxProfit: number;
  isFeasible: boolean;
}

// Inventory Types
export interface InventoryInputs {
  demandAnnual: number;
  orderingCost: number;
  holdingCostPerUnit: number;
}

export interface InventoryResult {
  eoq: number;
  ordersPerYear: number;
  totalCost: number;
}

// Financial Types
export interface FinancialInputs {
  initialInvestment: number;
  annualCashFlow: number;
  projectLife: number;
  discountRate: number; // percentage 0-100
}

export interface FinancialResult {
  van: number;
  tir: number; // percentage
  payback: number; // years
  cashFlows: number[];
}

// Leverage Types
export interface LeverageInputs {
  operatingIncome: number; // EBIT
  interestRate: number; // percentage
  maxDebt: number;
  stepSize: number;
}

export interface LeveragePoint {
  debt: number;
  interest: number;
  netIncome: number;
  roe: number;
}

export interface LeverageResult {
  optimalDebt: number;
  maxROE: number;
  dataPoints: LeveragePoint[];
}

// Risk Types
export interface RiskInputs {
  baseExchangeRate: number;
  exportVolume: number;
  priceUSD: number;
  fixedCostsMXN: number;
}

// Production Cost Types
export interface ActivityLog {
  date: string;
  cost: number;
  quantity?: number; // Liters, Bunches, Boxes, Bultos etc.
  weightPerUnit?: number; // Kg per Bulto, etc.
}

export interface ProductionCostInputs {
  hectares: number;
  plantsPerHectare: number;
  bunchWeightKg: number; // Changed from totalWeightKg to average bunch weight
  
  // Activities
  landPreparation: ActivityLog;
  planting: ActivityLog;
  insecticides: ActivityLog; // Quantity = Liters
  inspections: ActivityLog; // Revisadas
  fertilizers: ActivityLog; // Quantity = Bultos, WeightPerUnit = Kg
  labor: ActivityLog;
  fungicides: ActivityLog; // Quantity = Liters
  pruning: ActivityLog; // Desperillado (Quantity = Bunches)
  bagging: ActivityLog; // Embolsado (Quantity = Bunches)
  harvestPacking: ActivityLog; // Cosecha y Empaque (Quantity = Boxes)
}

export interface ProductionCostResult {
  totalCost: number;
  totalPlants: number;
  totalWeightKg: number; // Calculated
  costPerBunch: number;
  costPerKg: number;
  costPerHectare: number;
  categoryBreakdown: { name: string; value: number }[];
  
  // Specific Efficiency Metrics
  insecticideCostPerLiter: number;
  fertilizerCostPerSack: number; // Changed from CostPerLiter to CostPerSack (Bulto)
  fungicideCostPerLiter: number;
  pruningCostPerBunch: number;
  baggingCostPerBunch: number;
  packingCostPerBox: number;
}
