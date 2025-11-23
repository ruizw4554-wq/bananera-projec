
import { OptimizationInputs, OptimizationResult, InventoryInputs, InventoryResult, FinancialInputs, FinancialResult, LeverageInputs, LeverageResult, LeveragePoint, ProductionCostInputs, ProductionCostResult } from '../types';

/**
 * SOLVER FOR LINEAR PROGRAMMING (2 Variables)
 * Max Z = (P1 * ExR) * X1 + P2 * X2
 * Subject to:
 * 1. X1 + X2 <= MaxCajas
 * 2. X2 >= MinNational
 * 3. L1*X1 + L2*X2 <= MaxHours
 * 4. X1, X2 >= 0
 * 
 * Approach: Find vertices of the feasible region and evaluate Z.
 */
export const solveOptimization = (inputs: OptimizationInputs): OptimizationResult => {
  const { 
    priceExportUSD, priceNationalMXN, exchangeRate, 
    maxCajas, minNational, laborExport, laborNational, maxLaborHours 
  } = inputs;

  const profitExport = priceExportUSD * exchangeRate;
  const profitNational = priceNationalMXN;

  // Define lines for intersection calculation
  // L1: x + y = maxCajas  => y = maxCajas - x
  // L2: y = minNational
  // L3: laborExport*x + laborNational*y = maxLaborHours 
  //     => y = (maxLaborHours - laborExport*x) / laborNational
  // Axes: x=0, y=0

  const potentialPoints: {x: number, y: number}[] = [];

  // Intersection of L1 & L2
  // x + minNational = maxCajas => x = maxCajas - minNational
  potentialPoints.push({ x: maxCajas - minNational, y: minNational });

  // Intersection of L2 & L3
  // laborExport*x + laborNational*minNational = maxLaborHours
  // x = (maxLaborHours - laborNational*minNational) / laborExport
  if (laborExport !== 0) {
    potentialPoints.push({ x: (maxLaborHours - laborNational * minNational) / laborExport, y: minNational });
  }

  // Intersection of L1 & L3
  // x + y = maxCajas => y = maxCajas - x
  // laborExport*x + laborNational*(maxCajas - x) = maxLaborHours
  // x(laborExport - laborNational) = maxLaborHours - laborNational*maxCajas
  if (laborExport !== laborNational) {
    const x = (maxLaborHours - laborNational * maxCajas) / (laborExport - laborNational);
    const y = maxCajas - x;
    potentialPoints.push({ x, y });
  }

  // Intersection with axes (Corner points)
  potentialPoints.push({ x: 0, y: minNational }); // Minimum viable y
  potentialPoints.push({ x: 0, y: maxLaborHours / laborNational }); // Max y by labor
  potentialPoints.push({ x: 0, y: maxCajas }); // Max y by volume
  // x-intercepts if y=minNational is not binding?
  // For safety, let's check reasonable bounds.
  
  // Filter valid points
  const validPoints = potentialPoints.filter(p => {
    const x = p.x;
    const y = p.y;
    
    // Basic non-negativity and logic check
    if (x < 0 || y < 0) return false;
    if (isNaN(x) || isNaN(y)) return false;

    // Constraint 1: Capacity
    if (x + y > maxCajas + 0.001) return false; // epsilon for float
    // Constraint 2: Min National
    if (y < minNational - 0.001) return false;
    // Constraint 3: Labor
    if ((laborExport * x + laborNational * y) > maxLaborHours + 0.001) return false;

    return true;
  });

  if (validPoints.length === 0) {
    return { exportUnits: 0, nationalUnits: 0, maxProfit: 0, isFeasible: false };
  }

  // Evaluate Z
  let bestPoint = validPoints[0];
  let maxZ = -1;

  validPoints.forEach(p => {
    const z = (p.x * profitExport) + (p.y * profitNational);
    if (z > maxZ) {
      maxZ = z;
      bestPoint = p;
    }
  });

  return {
    exportUnits: Math.floor(bestPoint.x),
    nationalUnits: Math.floor(bestPoint.y),
    maxProfit: maxZ,
    isFeasible: true
  };
};

/**
 * INVENTORY (EOQ)
 */
export const calculateInventory = (inputs: InventoryInputs): InventoryResult => {
  const { demandAnnual, orderingCost, holdingCostPerUnit } = inputs;
  if (holdingCostPerUnit === 0) return { eoq: 0, ordersPerYear: 0, totalCost: 0 };

  const eoq = Math.sqrt((2 * demandAnnual * orderingCost) / holdingCostPerUnit);
  const ordersPerYear = eoq > 0 ? demandAnnual / eoq : 0;
  const totalCost = (orderingCost * ordersPerYear) + (holdingCostPerUnit * eoq / 2);

  return { eoq, ordersPerYear, totalCost };
};

/**
 * FINANCIAL (NPV, IRR, Payback)
 */
export const calculateFinancials = (inputs: FinancialInputs): FinancialResult => {
  const { initialInvestment, annualCashFlow, projectLife, discountRate } = inputs;
  const rate = discountRate / 100;
  
  // NPV
  let van = -initialInvestment;
  const cashFlows: number[] = [-initialInvestment];
  
  for (let t = 1; t <= projectLife; t++) {
    van += annualCashFlow / Math.pow(1 + rate, t);
    cashFlows.push(annualCashFlow);
  }

  // Payback
  const payback = annualCashFlow > 0 ? initialInvestment / annualCashFlow : 0;

  // IRR (Newton-Raphson Approximation)
  // Function: f(r) = -Inv + Sum(CF / (1+r)^t) = 0
  let guess = 0.1; // Initial guess 10%
  for (let i = 0; i < 20; i++) {
    let npv = -initialInvestment;
    let derivative = 0;
    
    for (let t = 1; t <= projectLife; t++) {
      const term = Math.pow(1 + guess, t);
      npv += annualCashFlow / term;
      derivative -= (t * annualCashFlow) / (term * (1 + guess));
    }
    
    const newGuess = guess - (npv / derivative);
    if (Math.abs(newGuess - guess) < 0.0001) {
      guess = newGuess;
      break;
    }
    guess = newGuess;
  }
  
  return {
    van,
    tir: guess * 100,
    payback,
    cashFlows
  };
};

/**
 * LEVERAGE & ROE
 */
export const calculateLeverageAnalysis = (inputs: LeverageInputs): LeverageResult => {
  const { operatingIncome, interestRate, maxDebt, stepSize } = inputs;
  const rate = interestRate / 100;
  
  let bestRoe = -1;
  let optimalDebt = 0;
  const dataPoints: LeveragePoint[] = [];

  for (let debt = 0; debt <= maxDebt; debt += stepSize) {
    const interest = debt * rate;
    const netIncome = operatingIncome - interest;
    
    const capital = operatingIncome - debt; 
    
    let roe = 0;
    if (capital > 0) {
      roe = (netIncome / capital) * 100;
    }

    if (roe > bestRoe) {
      bestRoe = roe;
      optimalDebt = debt;
    }

    dataPoints.push({
      debt,
      interest,
      netIncome,
      roe
    });
  }

  return {
    optimalDebt,
    maxROE: bestRoe,
    dataPoints
  };
};

/**
 * PRODUCTION COST (Unit Costing)
 */
export const calculateProductionCost = (inputs: ProductionCostInputs): ProductionCostResult => {
  const totalCost = 
    inputs.landPreparation.cost +
    inputs.planting.cost +
    inputs.insecticides.cost +
    inputs.inspections.cost +
    inputs.fertilizers.cost +
    inputs.labor.cost +
    inputs.fungicides.cost +
    inputs.pruning.cost +
    inputs.bagging.cost +
    inputs.harvestPacking.cost;

  const totalPlants = inputs.hectares * inputs.plantsPerHectare;
  const totalWeightKg = totalPlants * inputs.bunchWeightKg;
  
  // Cost per bunch
  const costPerBunch = totalPlants > 0 ? totalCost / totalPlants : 0;
  
  // Cost per Kg (Total Cost / Total Estimated Weight)
  const costPerKg = totalWeightKg > 0 ? totalCost / totalWeightKg : 0;
  const costPerHectare = inputs.hectares > 0 ? totalCost / inputs.hectares : 0;

  const categoryBreakdown = [
    { name: 'Prep. Tierra', value: inputs.landPreparation.cost },
    { name: 'Siembra', value: inputs.planting.cost },
    { name: 'Insecticidas', value: inputs.insecticides.cost },
    { name: 'Revisadas', value: inputs.inspections.cost },
    { name: 'Fertilizantes', value: inputs.fertilizers.cost },
    { name: 'Mano de Obra', value: inputs.labor.cost },
    { name: 'Fungicidas', value: inputs.fungicides.cost },
    { name: 'Desperillado', value: inputs.pruning.cost },
    { name: 'Embolsado', value: inputs.bagging.cost },
    { name: 'Cosecha/Empaque', value: inputs.harvestPacking.cost },
  ].filter(item => item.value > 0);

  // Specific Efficiency Calculations
  const safeDiv = (num: number, den: number | undefined) => (den && den > 0) ? num / den : 0;

  const insecticideCostPerLiter = safeDiv(inputs.insecticides.cost, inputs.insecticides.quantity);
  const fertilizerCostPerSack = safeDiv(inputs.fertilizers.cost, inputs.fertilizers.quantity); // Changed to PerSack
  const fungicideCostPerLiter = safeDiv(inputs.fungicides.cost, inputs.fungicides.quantity);
  const pruningCostPerBunch = safeDiv(inputs.pruning.cost, inputs.pruning.quantity);
  const baggingCostPerBunch = safeDiv(inputs.bagging.cost, inputs.bagging.quantity);
  const packingCostPerBox = safeDiv(inputs.harvestPacking.cost, inputs.harvestPacking.quantity);

  return {
    totalCost,
    totalPlants,
    totalWeightKg,
    costPerBunch,
    costPerKg,
    costPerHectare,
    categoryBreakdown,
    // New Metrics
    insecticideCostPerLiter,
    fertilizerCostPerSack,
    fungicideCostPerLiter,
    pruningCostPerBunch,
    baggingCostPerBunch,
    packingCostPerBox
  };
};
