import type { Gown } from "@/app/interfaces/Gown"
import type { InvestmentResult } from "@/app/interfaces/InvestmentCalculator"

export interface InvestmentParameters {
  numberOfGownsToInvest: number
  planningHorizon: number
  annualGownUse: number
}

export interface EmissionBreakdown {
  reusableEmissions: number
  disposableEmissions: number
  totalEmissions: number
}

// Function to fetch default disposable gown data from backend using existing endpoint
async function fetchDefaultDisposableGown(): Promise<Gown | null> {
  try {
    const response = await fetch("/api/emissions/selected-gowns-emissions/?ids=7", {
      credentials: "include",
    })
    if (!response.ok) {
      throw new Error("Failed to fetch default disposable gown")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching default disposable gown:", error)
    return null
  }
}

export async function calculateInvestmentResults(
  selectedGowns: Gown[],
  parameters: InvestmentParameters,
): Promise<InvestmentResult[]> {
  if (selectedGowns.length === 0) return []

  const { numberOfGownsToInvest, planningHorizon, annualGownUse } = parameters
  const totalUsesOverHorizon = annualGownUse * planningHorizon
  const lossPercentage = 0 // No loss assumed
  const reductionFactor = 1 // No reduction since no loss

  // Check if we need to fetch default disposable gown data
  const hasDisposableGown = selectedGowns.some((gown) => !gown.reusable)
  let defaultDisposableGown: Gown | null = null

  if (!hasDisposableGown) {
    // Fetch default disposable gown data from backend using ID 7
    defaultDisposableGown = await fetchDefaultDisposableGown()
    console.log("defaultDisposableGown", defaultDisposableGown)
  }

  return selectedGowns.map((gown) => {
    const actualGownsToInvest = gown.reusable ? numberOfGownsToInvest : 0

    const result: InvestmentResult = {
      gownId: gown.id,
      gownName: gown.name,
      isReusable: gown.reusable,
      numberOfGownsToInvest: actualGownsToInvest,
      planningHorizon,
      annualGownUse,
      lossPercentage,
      maxGownUsesWithReduction: 0,
      totalUsesOverHorizon,
      actualUsesForOpex: 0,
      extraDisposableGownsNeeded: 0,
      capex: 0,
      opex: 0,
      extraDisposableCost: 0,
      totalExpenses: 0,
      co2Breakdown: { reusableEmissions: 0, disposableEmissions: 0, totalEmissions: 0 },
      waterBreakdown: { reusableEmissions: 0, disposableEmissions: 0, totalEmissions: 0 },
      energyBreakdown: { reusableEmissions: 0, disposableEmissions: 0, totalEmissions: 0 },
      utilizationRate: 0,
      costPerUse: 0,
    }

    if (gown.reusable && gown.washes && actualGownsToInvest > 0) {
      // REUSABLE GOWN CALCULATIONS
      const maxUsesWithoutReduction = actualGownsToInvest * gown.washes
      result.maxGownUsesWithReduction = Math.floor(maxUsesWithoutReduction * reductionFactor)

      // CAPEX: Initial investment in reusable gowns
      result.capex = actualGownsToInvest * gown.cost

      // Check if we need extra disposable gowns
      if (totalUsesOverHorizon > result.maxGownUsesWithReduction) {
        result.extraDisposableGownsNeeded = totalUsesOverHorizon - result.maxGownUsesWithReduction
      } else {
        result.extraDisposableGownsNeeded = 0
      }

      // OPEX for reusable gowns
      const opexPerUse = gown.laundry_cost + gown.waste_cost - gown.residual_value
      const actualUsesForOpex = Math.min(totalUsesOverHorizon, result.maxGownUsesWithReduction)
      result.opex = opexPerUse * actualUsesForOpex

      // EXTRA DISPOSABLE COST
      if (result.extraDisposableGownsNeeded > 0) {
        // First try to find a disposable gown in selected gowns
        const disposableGown = selectedGowns.find((g) => !g.reusable)

        let disposableGownCost: number
        let disposableWasteCost: number

        if (disposableGown) {
          // Use selected disposable gown data
          disposableGownCost = disposableGown.cost
          disposableWasteCost = disposableGown.waste_cost || 0
        } else if (defaultDisposableGown) {
          // Use fetched default disposable gown data (ID 7)
          disposableGownCost = defaultDisposableGown.cost
          disposableWasteCost = defaultDisposableGown.waste_cost || 0
        } else {
          // Fallback to hardcoded values only if backend fetch failed
          disposableGownCost = 0.81
          disposableWasteCost = 0
        }

        result.extraDisposableCost = result.extraDisposableGownsNeeded * (disposableGownCost + disposableWasteCost)
      }

      // EMISSIONS CALCULATIONS
      const reusableUses = Math.min(totalUsesOverHorizon, result.maxGownUsesWithReduction)
      const disposableUses = result.extraDisposableGownsNeeded

      result.co2Breakdown.reusableEmissions = Math.floor(gown.emission_impacts.CO2 * reusableUses)
      result.waterBreakdown.reusableEmissions = Math.floor(gown.emission_impacts.Water * reusableUses)
      result.energyBreakdown.reusableEmissions = Math.floor(gown.emission_impacts.Energy * reusableUses)

      if (disposableUses > 0) {
        // First try to find a disposable gown in selected gowns
        const disposableGown = selectedGowns.find((g) => !g.reusable)

        if (disposableGown) {
          // Use selected disposable gown emissions data
          result.co2Breakdown.disposableEmissions = Math.floor(disposableGown.emission_impacts.CO2 * disposableUses)
          result.waterBreakdown.disposableEmissions = Math.floor(disposableGown.emission_impacts.Water * disposableUses)
          result.energyBreakdown.disposableEmissions = Math.floor(
            disposableGown.emission_impacts.Energy * disposableUses,
          )
        } else if (defaultDisposableGown) {
          // Use fetched default disposable gown emissions data (ID 7)
          result.co2Breakdown.disposableEmissions = Math.floor(
            defaultDisposableGown.emission_impacts.CO2 * disposableUses,
          )
          result.waterBreakdown.disposableEmissions = Math.floor(
            defaultDisposableGown.emission_impacts.Water * disposableUses,
          )
          result.energyBreakdown.disposableEmissions = Math.floor(
            defaultDisposableGown.emission_impacts.Energy * disposableUses,
          )
        } else {
          // Fallback to hardcoded values only if backend fetch failed
          result.co2Breakdown.disposableEmissions = Math.floor(0.21 * disposableUses)
          result.waterBreakdown.disposableEmissions = Math.floor(1.16 * disposableUses)
          result.energyBreakdown.disposableEmissions = Math.floor(2.59 * disposableUses)
        }
      }

      result.co2Breakdown.totalEmissions =
        result.co2Breakdown.reusableEmissions + result.co2Breakdown.disposableEmissions
      result.waterBreakdown.totalEmissions =
        result.waterBreakdown.reusableEmissions + result.waterBreakdown.disposableEmissions
      result.energyBreakdown.totalEmissions =
        result.energyBreakdown.reusableEmissions + result.energyBreakdown.disposableEmissions

      result.utilizationRate = Math.min(100, (totalUsesOverHorizon / result.maxGownUsesWithReduction) * 100)
      result.actualUsesForOpex = actualUsesForOpex
    } else {
      // DISPOSABLE GOWN CALCULATIONS
      result.maxGownUsesWithReduction = 0
      result.extraDisposableGownsNeeded = totalUsesOverHorizon
      result.capex = 0

      const purchaseOpex = totalUsesOverHorizon * gown.cost
      const wasteOpex = totalUsesOverHorizon * (gown.waste_cost || 0)
      result.opex = purchaseOpex + wasteOpex
      result.extraDisposableCost = 0

      result.co2Breakdown.disposableEmissions = Math.floor(gown.emission_impacts.CO2 * totalUsesOverHorizon)
      result.waterBreakdown.disposableEmissions = Math.floor(gown.emission_impacts.Water * totalUsesOverHorizon)
      result.energyBreakdown.disposableEmissions = Math.floor(gown.emission_impacts.Energy * totalUsesOverHorizon)

      result.co2Breakdown.totalEmissions = result.co2Breakdown.disposableEmissions
      result.waterBreakdown.totalEmissions = result.waterBreakdown.disposableEmissions
      result.energyBreakdown.totalEmissions = result.energyBreakdown.disposableEmissions

      result.utilizationRate = 100
    }

    result.totalExpenses = result.capex + result.opex + result.extraDisposableCost
    result.costPerUse = result.totalExpenses / totalUsesOverHorizon

    return result
  })
}

// Helper function to calculate depreciation schedule for reusable gowns
export function calculateDepreciationSchedule(result: InvestmentResult) {
  if (!result.isReusable) return []

  const schedule = []
  const annualDepreciation = result.capex / result.planningHorizon
  const annualOperationalCost = result.opex / result.planningHorizon

  for (let year = 1; year <= result.planningHorizon; year++) {
    // Modified calculation: Book value should be investment cost minus (annual depreciation × year)
    // This means Year 1 shows the book value AFTER the first year's depreciation
    const bookValue = result.capex - annualDepreciation * year

    schedule.push({
      year,
      bookValue: Math.max(0, bookValue), // Ensure book value doesn't go below 0
      annualDepreciation,
      operationalCosts: annualOperationalCost,
    })
  }

  return schedule
}

// Helper function to calculate yearly expense schedule for disposable gowns
export function calculateDisposableSchedule(result: InvestmentResult) {
  if (result.isReusable) return []

  const schedule = []
  const totalGownsNeeded = result.totalUsesOverHorizon
  const annualUsage = result.annualGownUse

  // Calculate costs per gown from the result data
  const totalPurchaseCost = totalGownsNeeded * (result.opex / totalGownsNeeded - (result.opex / totalGownsNeeded) * 0.1) // Approximate purchase cost
  const wasteCostPerGown = (result.opex / totalGownsNeeded) * 0.1 // Approximate waste cost per gown
  const annualWasteCost = annualUsage * wasteCostPerGown

  // We need to extract the actual gown cost from somewhere
  // For now, let's calculate it from the total OPEX
  const purchaseCostPerGown = (result.opex - totalGownsNeeded * wasteCostPerGown) / totalGownsNeeded
  const totalPurchaseCostYear1 = totalGownsNeeded * purchaseCostPerGown

  for (let year = 1; year <= result.planningHorizon; year++) {
    if (year === 1) {
      // Year 1: Purchase all gowns + waste costs for year 1
      schedule.push({
        year,
        purchaseCosts: totalPurchaseCostYear1,
        wasteCosts: annualWasteCost,
        totalAnnualCosts: totalPurchaseCostYear1 + annualWasteCost,
      })
    } else {
      // Later years: Only waste costs
      schedule.push({
        year,
        purchaseCosts: 0,
        wasteCosts: annualWasteCost,
        totalAnnualCosts: annualWasteCost,
      })
    }
  }

  return schedule
}

// Improved version that takes the actual gown data
export function calculateDisposableScheduleWithGownData(result: InvestmentResult, gown: any) {
  if (result.isReusable) return []

  // Safety check: if gown is undefined, return empty array
  if (!gown) return []

  const schedule = []
  const totalGownsNeeded = result.totalUsesOverHorizon
  const annualUsage = result.annualGownUse

  // Use actual gown cost data with fallback values
  const purchaseCostPerGown = gown.cost || 0.81 // Fallback to default disposable cost
  const wasteCostPerGown = gown.waste_cost || 0

  const totalPurchaseCostYear1 = totalGownsNeeded * purchaseCostPerGown
  const annualWasteCost = annualUsage * wasteCostPerGown

  for (let year = 1; year <= result.planningHorizon; year++) {
    if (year === 1) {
      // Year 1: Purchase all gowns needed for entire horizon + waste costs for year 1 usage
      schedule.push({
        year,
        purchaseCosts: totalPurchaseCostYear1,
        wasteCosts: annualWasteCost,
        totalAnnualCosts: totalPurchaseCostYear1 + annualWasteCost,
      })
    } else {
      // Later years: Only waste costs for annual usage
      schedule.push({
        year,
        purchaseCosts: 0,
        wasteCosts: annualWasteCost,
        totalAnnualCosts: annualWasteCost,
      })
    }
  }

  return schedule
}

// Helper function to sort results
export function sortInvestmentResults(
  results: InvestmentResult[],
  sortBy: "total" | "capex" | "opex" | "emissions",
  sortOrder: "asc" | "desc",
): InvestmentResult[] {
  return [...results].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1
    if (sortBy === "total") {
      return (a.totalExpenses - b.totalExpenses) * multiplier
    } else if (sortBy === "capex") {
      return (a.capex - b.capex) * multiplier
    } else if (sortBy === "opex") {
      return (a.opex - b.opex) * multiplier
    } else {
      return (a.co2Breakdown.totalEmissions - b.co2Breakdown.totalEmissions) * multiplier
    }
  })
}
