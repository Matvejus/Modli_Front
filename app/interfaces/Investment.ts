export interface InvestmentResult {
    gownId: string
    gownName: string
    isReusable: boolean
    // Reusable gown calculations
    totalGownsNeeded: number
    totalInvestmentCost: number
    annualDepreciation: number
    annualUsage: number
    annualLaundryCosts: number
    totalAnnualCostReusable: number
    // Disposable gown calculations
    totalPurchaseCostDisposable: number
    totalWasteCostDisposable: number
    totalAnnualCostDisposable: number
    // Common metrics
    costPerUse: number
    totalEmissionsCo2: number
    totalEmissionsWater: number
    totalEmissionsEnergy: number
    totalEmissions: number
    totalWashes: number
    replacementCycles: number
  }