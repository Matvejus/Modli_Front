import { Gown } from "@/app/interfaces/Gown"

export interface InvestmentCalculatorProps {
  selectedGowns: Gown[]
}

export interface InvestmentResult {
  gownId: string
  gownName: string
  isReusable: boolean
  // User inputs
  numberOfGownsToInvest: number
  planningHorizon: number
  annualGownUse: number
  lossPercentage: number
  // Backend calculations
  maxGownUsesWithReduction: number
  totalUsesOverHorizon: number
  actualUsesForOpex: number // Add this new field
  extraDisposableGownsNeeded: number
  // Financial results
  capex: number
  opex: number
  extraDisposableCost: number
  totalExpenses: number
  // Emissions results with breakdown
  co2Breakdown: EmissionBreakdown
  waterBreakdown: EmissionBreakdown
  energyBreakdown: EmissionBreakdown
  // Additional metrics
  utilizationRate: number
  costPerUse: number
}