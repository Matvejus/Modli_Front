"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, DollarSign, Building, Cog, AlertTriangle, Leaf, Droplets, Zap, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmissionDonutChart } from "./InvestmentEmissionsDonughtChart"
import InvestmentDepreciationTable from "./InvestmentDepreciationTable"
import type { InvestmentCalculatorProps, InvestmentResult } from "@/app/interfaces/InvestmentCalculator"

export default function GownInvestmentCalculator({ selectedGowns }: InvestmentCalculatorProps) {
  // User inputs
  const [numberOfGownsToInvest, setNumberOfGownsToInvest] = useState<number>(0)
  const [planningHorizon, setPlanningHorizon] = useState<number>(0)
  const [annualGownUse, setAnnualGownUse] = useState<number>(0)

  const [results, setResults] = useState<InvestmentResult[]>([])
  const [sortBy, setSortBy] = useState<"total" | "capex" | "opex" | "emissions">("total")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const calculateInvestment = () => {
    if (selectedGowns.length === 0) return

    const totalUsesOverHorizon = annualGownUse * planningHorizon
    const lossPercentage = 0 // No loss assumed
    const reductionFactor = 1 // No reduction since no loss

    const calculatedResults: InvestmentResult[] = selectedGowns.map((gown) => {
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
          const disposableGown = selectedGowns.find((g) => !g.reusable)
          const disposableGownCost = disposableGown?.cost || 0.81
          const disposableWasteCost = disposableGown?.waste_cost || 0
          result.extraDisposableCost = result.extraDisposableGownsNeeded * (disposableGownCost + disposableWasteCost)
        }

        // EMISSIONS CALCULATIONS
        const reusableUses = Math.min(totalUsesOverHorizon, result.maxGownUsesWithReduction)
        const disposableUses = result.extraDisposableGownsNeeded

        result.co2Breakdown.reusableEmissions = Math.floor(gown.emission_impacts.CO2 * reusableUses)
        result.waterBreakdown.reusableEmissions = Math.floor(gown.emission_impacts.Water * reusableUses)
        result.energyBreakdown.reusableEmissions = Math.floor(gown.emission_impacts.Energy * reusableUses)

        if (disposableUses > 0) {
          const disposableGown = selectedGowns.find((g) => !g.reusable)
          if (disposableGown) {
            result.co2Breakdown.disposableEmissions = Math.floor(disposableGown.emission_impacts.CO2 * disposableUses)
            result.waterBreakdown.disposableEmissions = Math.floor(
              disposableGown.emission_impacts.Water * disposableUses,
            )
            result.energyBreakdown.disposableEmissions = Math.floor(
              disposableGown.emission_impacts.Energy * disposableUses,
            )
          } else {
            result.co2Breakdown.disposableEmissions = Math.floor(0.5 * disposableUses)
            result.waterBreakdown.disposableEmissions = Math.floor(2.0 * disposableUses)
            result.energyBreakdown.disposableEmissions = Math.floor(8.0 * disposableUses)
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

    setResults(calculatedResults)
  }

  useEffect(() => {
    if (selectedGowns.length > 0) {
      calculateInvestment()
    }
  }, [selectedGowns, numberOfGownsToInvest, planningHorizon, annualGownUse])

  if (selectedGowns.length === 0) {
    return (
      <Card className="border-none bg-white shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-100 p-2">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-bold">Investment Analysis (CAPEX/OPEX)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select gowns above to see investment analysis.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none bg-white shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-100 p-2">
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold">Cost Comparison Analysis (CAPEX/OPEX)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Input Parameters */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gowns-investment" className="text-black font-medium">
                Units purchased
              </Label>
              <Input
                id="gowns-investment"
                type="number"
                min="1"
                value={numberOfGownsToInvest}
                onChange={(e) => setNumberOfGownsToInvest(Number(e.target.value))}
                className="border-black"
              />
              <p className="text-xs text-muted-foreground">Specify the exact number of reusable gowns to purchase</p>
            </div>

            {/* Other Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="planning-horizon" className="text-black font-medium">
                  Investment period (years)
                </Label>
                <Input
                  id="planning-horizon"
                  type="number"
                  min="1"
                  max="20"
                  value={planningHorizon}
                  onChange={(e) => setPlanningHorizon(Number(e.target.value))}
                  className="border-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual-use" className="text-black font-medium">
                  Annual usage (expected)
                </Label>
                <Input
                  id="annual-use"
                  type="number"
                  min="1"
                  value={annualGownUse}
                  onChange={(e) => setAnnualGownUse(Number(e.target.value))}
                  className="border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sorting Controls */}
        {results.length > 1 && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">Sort by:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "total" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("total")}
                className="flex items-center gap-1"
              >
                <DollarSign className="h-4 w-4" />
                Total Expenses
                {sortBy === "total" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }}
                    className="ml-1"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                )}
              </Button>
              <Button
                variant={sortBy === "capex" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("capex")}
                className="flex items-center gap-1"
              >
                <Building className="h-4 w-4" />
                CAPEX
                {sortBy === "capex" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }}
                    className="ml-1"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                )}
              </Button>
              <Button
                variant={sortBy === "opex" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("opex")}
                className="flex items-center gap-1"
              >
                <Cog className="h-4 w-4" />
                OPEX
                {sortBy === "opex" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }}
                    className="ml-1"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                )}
              </Button>
              <Button
                variant={sortBy === "emissions" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("emissions")}
                className="flex items-center gap-1"
              >
                <Leaf className="h-4 w-4" />
                CO₂ Emissions
                {sortBy === "emissions" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }}
                    className="ml-1"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Backend Calculations Display */}
        <div className="p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4 text-black">Maximum possible uses and utilization rate</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Gown Type</th>
                  <th className="text-right py-2 font-medium">Gowns Purchased</th>
                  <th className="text-right py-2 font-medium">Max Uses</th>
                  <th className="text-right py-2 font-medium">Extra Disposable Needed</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.gownId} className="border-b">
                    <td className="py-2 font-medium">{result.gownName}</td>
                    <td className="text-right py-2">
                      {result.isReusable ? result.numberOfGownsToInvest.toLocaleString() : "n/a"}
                    </td>
                    <td className="text-right py-2">
                      {result.isReusable ? result.maxGownUsesWithReduction.toLocaleString() : "0"}
                    </td>
                    <td className="text-right py-2">{result.extraDisposableGownsNeeded.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4 text-black px-4">Investment versus Operational cost</h3>
          {results
            .sort((a, b) => {
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
            .map((result) => (
              <Card key={result.gownId} className="">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {result.gownName}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.isReusable ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {result.isReusable ? "Reusable" : "Disposable"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-${result.extraDisposableCost > 0 ? "4" : "3"} gap-4 mb-4`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Total investment cost</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">€{result.capex.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.isReusable
                          ? `${result.numberOfGownsToInvest.toLocaleString()} gowns × €${selectedGowns.find((g) => g.id === result.gownId)?.cost.toFixed(2)}`
                          : "No initial investment"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Cog className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Total Operational cost</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">€{result.opex.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.isReusable ? "(Laundry + Waste - Residual) × Actual Uses" : "Purchase + Waste costs"}
                      </p>
                    </div>
                    {result.extraDisposableCost > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium">Extra Disposables</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                          €{result.extraDisposableCost.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result.extraDisposableGownsNeeded.toLocaleString()} disposable gowns needed
                        </p>
                      </div>
                    )}
                    <div className="space-y-2 bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Total Expenses</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">€{result.totalExpenses.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">€{result.costPerUse.toFixed(2)} per use</p>
                    </div>
                  </div>

                  {/* Add Depreciation Table for Reusable Gowns */}
                  {result.isReusable && (
                    <div className="mb-4">
                      <InvestmentDepreciationTable
                        result={result}
                        selectedGown={selectedGowns.find((g) => g.id === result.gownId)}
                      />
                    </div>
                  )}

                  {/* Emissions Section with Donut Charts */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-3 text-green-800">Total Environmental Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <EmissionDonutChart
                        breakdown={result.co2Breakdown}
                        title="CO₂ Emissions"
                        unit="kg CO₂-eq"
                        color="#10b981"
                        icon={Leaf}
                      />
                      <EmissionDonutChart
                        breakdown={result.waterBreakdown}
                        title="Water Usage"
                        unit="L"
                        color="#3b82f6"
                        icon={Droplets}
                      />
                      <EmissionDonutChart
                        breakdown={result.energyBreakdown}
                        title="Energy Usage"
                        unit="MJ-eq"
                        color="#f59e0b"
                        icon={Zap}
                      />
                    </div>
                  </div>

                  {/* Capacity Warning */}
                  {result.isReusable && result.extraDisposableGownsNeeded > 0 && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Capacity Exceeded:</strong> Your reusable gown investment can only cover{" "}
                        {result.maxGownUsesWithReduction.toLocaleString()} uses out of{" "}
                        {result.totalUsesOverHorizon.toLocaleString()} total demand. You'll need{" "}
                        {result.extraDisposableGownsNeeded.toLocaleString()} additional disposable gowns costing €
                        {result.extraDisposableCost.toLocaleString()}.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
