"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Calculator,
  DollarSign,
  Building,
  Cog,
  AlertTriangle,
  Leaf,
  Droplets,
  Zap,
  ShoppingCart,
  Hash,
  Euro,
} from "lucide-react"
import type { Gown } from "@/app/interfaces/Gown"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmissionDonutChart, type EmissionBreakdown } from "./InvestmentEmissionsDonughtChart"

interface InvestmentCalculatorProps {
  selectedGowns: Gown[]
}

interface InvestmentResult {
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

export default function GownInvestmentCalculator({ selectedGowns }: InvestmentCalculatorProps) {
  // Investment mode: 'gowns' or 'budget'
  const [investmentMode, setInvestmentMode] = useState<"gowns" | "budget">("gowns")

  // User inputs
  const [numberOfGownsToInvest, setNumberOfGownsToInvest] = useState<number>(8000)
  const [investmentBudget, setInvestmentBudget] = useState<number>(400000) // Default budget
  const [planningHorizon, setPlanningHorizon] = useState<number>(5)
  const [annualGownUse, setAnnualGownUse] = useState<number>(36500)
  const [lossPercentage, setLossPercentage] = useState<number>(5)

  const [results, setResults] = useState<InvestmentResult[]>([])
  const [sortBy, setSortBy] = useState<"total" | "capex" | "opex" | "emissions">("total")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Calculate number of gowns based on budget for each selected gown
  const calculateGownsFromBudget = (gown: Gown, budget: number): number => {
    if (!gown.reusable) return 0 // Budget mode only applies to reusable gowns
    return Math.floor(budget / gown.cost)
  }

  const calculateInvestment = () => {
    if (selectedGowns.length === 0) return

    const totalUsesOverHorizon = annualGownUse * planningHorizon
    const reductionFactor = (100 - lossPercentage) / 100

    const calculatedResults: InvestmentResult[] = selectedGowns.map((gown) => {
      // Determine number of gowns based on mode
      let actualGownsToInvest: number
      if (investmentMode === "budget" && gown.reusable) {
        actualGownsToInvest = calculateGownsFromBudget(gown, investmentBudget)
      } else {
        actualGownsToInvest = gown.reusable ? numberOfGownsToInvest : 0
      }

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

        // Maximum number of gown uses from reusable gowns, with user-defined reduction accounted for lost
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

        // OPEX for reusable gowns: (laundry cost + waste cost - residual values) * maxGownUsesWithReduction
        const opexPerUse = gown.laundry_cost + gown.waste_cost - gown.residual_value
        result.opex = opexPerUse * result.maxGownUsesWithReduction

        // EXTRA DISPOSABLE COST: Cost of additional disposable gowns needed when capacity is exceeded
        if (result.extraDisposableGownsNeeded > 0) {
          // Find a disposable gown cost from selected gowns or use a default
          const disposableGown = selectedGowns.find((g) => !g.reusable)
          const disposableGownCost = disposableGown?.cost || 0.81 // Default disposable cost
          const disposableWasteCost = disposableGown?.waste_cost || 0

          result.extraDisposableCost = result.extraDisposableGownsNeeded * (disposableGownCost + disposableWasteCost)
        }

        // EMISSIONS CALCULATIONS with breakdown
        const reusableUses = Math.min(totalUsesOverHorizon, result.maxGownUsesWithReduction)
        const disposableUses = result.extraDisposableGownsNeeded

        // Reusable emissions (based on actual uses covered by reusable gowns)
        result.co2Breakdown.reusableEmissions = Math.floor(gown.emission_impacts.CO2 * reusableUses)
        result.waterBreakdown.reusableEmissions = Math.floor(gown.emission_impacts.Water * reusableUses)
        result.energyBreakdown.reusableEmissions = Math.floor(gown.emission_impacts.Energy * reusableUses)

        // Disposable emissions (if extra disposables are needed)
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
            // Use default disposable emissions if no disposable gown selected
            result.co2Breakdown.disposableEmissions = Math.floor(0.5 * disposableUses) // Default CO2
            result.waterBreakdown.disposableEmissions = Math.floor(2.0 * disposableUses) // Default Water
            result.energyBreakdown.disposableEmissions = Math.floor(8.0 * disposableUses) // Default Energy
          }
        }

        // Total emissions
        result.co2Breakdown.totalEmissions =
          result.co2Breakdown.reusableEmissions + result.co2Breakdown.disposableEmissions
        result.waterBreakdown.totalEmissions =
          result.waterBreakdown.reusableEmissions + result.waterBreakdown.disposableEmissions
        result.energyBreakdown.totalEmissions =
          result.energyBreakdown.reusableEmissions + result.energyBreakdown.disposableEmissions

        // Utilization rate
        result.utilizationRate = Math.min(100, (totalUsesOverHorizon / result.maxGownUsesWithReduction) * 100)
      } else {
        // DISPOSABLE GOWN CALCULATIONS

        result.maxGownUsesWithReduction = 0 // No reusable capacity
        result.extraDisposableGownsNeeded = totalUsesOverHorizon // All uses need disposable gowns

        // CAPEX: No initial investment for disposables
        result.capex = 0

        // OPEX: All gown purchases + waste costs
        const purchaseOpex = totalUsesOverHorizon * gown.cost
        const wasteOpex = totalUsesOverHorizon * (gown.waste_cost || 0)
        result.opex = purchaseOpex + wasteOpex

        // No extra disposable cost for disposable gowns
        result.extraDisposableCost = 0

        // EMISSIONS CALCULATIONS - all from disposable gowns
        result.co2Breakdown.disposableEmissions = Math.floor(gown.emission_impacts.CO2 * totalUsesOverHorizon)
        result.waterBreakdown.disposableEmissions = Math.floor(gown.emission_impacts.Water * totalUsesOverHorizon)
        result.energyBreakdown.disposableEmissions = Math.floor(gown.emission_impacts.Energy * totalUsesOverHorizon)

        result.co2Breakdown.totalEmissions = result.co2Breakdown.disposableEmissions
        result.waterBreakdown.totalEmissions = result.waterBreakdown.disposableEmissions
        result.energyBreakdown.totalEmissions = result.energyBreakdown.disposableEmissions

        result.utilizationRate = 100 // Always 100% for disposables
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
  }, [
    selectedGowns,
    numberOfGownsToInvest,
    investmentBudget,
    investmentMode,
    planningHorizon,
    annualGownUse,
    lossPercentage,
  ])

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
          <CardTitle className="text-xl font-bold">Investment Analysis (CAPEX/OPEX)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Input Parameters */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="space-y-4">
            {/* Investment Mode Tabs */}
            <Tabs value={investmentMode} onValueChange={(value) => setInvestmentMode(value as "gowns" | "budget")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gowns" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Number of Gowns
                </TabsTrigger>
                <TabsTrigger value="budget" className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Investment Budget
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gowns" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="gowns-investment" className="text-black font-medium">
                    Number of reusable gowns to buy (CAPEX)
                  </Label>
                  <Input
                    id="gowns-investment"
                    type="number"
                    min="1"
                    value={numberOfGownsToInvest}
                    onChange={(e) => setNumberOfGownsToInvest(Number(e.target.value))}
                    className="border-black"
                  />
                  <p className="text-xs text-muted-foreground">
                    Specify the exact number of reusable gowns to purchase
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="investment-budget" className="text-black font-medium">
                    Investment budget (€) for reusable gowns
                  </Label>
                  <Input
                    id="investment-budget"
                    type="number"
                    min="1"
                    value={investmentBudget}
                    onChange={(e) => setInvestmentBudget(Number(e.target.value))}
                    className="border-black"
                  />
                  <p className="text-xs text-muted-foreground">
                    The number of gowns will be calculated based on your budget and gown cost
                  </p>
                  {/* Show calculated gowns for each selected reusable gown */}
                  {selectedGowns.filter((g) => g.reusable).length > 0 && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Calculated gowns for budget:</p>
                      {selectedGowns
                        .filter((g) => g.reusable)
                        .map((gown) => (
                          <div key={gown.id} className="text-xs text-muted-foreground">
                            {gown.name}: {calculateGownsFromBudget(gown, investmentBudget).toLocaleString()} gowns (€
                            {gown.cost.toFixed(2)} each)
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Other Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="planning-horizon" className="text-black font-medium">
                  Planning horizon (in years)
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
                  Number of annual gown uses
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
              <div className="space-y-2">
                <Label htmlFor="loss-percentage" className="text-black font-medium">
                  Loss percentage (%)
                </Label>
                <Input
                  id="loss-percentage"
                  type="number"
                  min="0"
                  max="50"
                  value={lossPercentage}
                  onChange={(e) => setLossPercentage(Number(e.target.value))}
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
                  <th className="text-right py-2 font-medium">Max Uses ({lossPercentage}% reduction)</th>
                  <th className="text-right py-2 font-medium">Extra Disposable Needed</th>
                  <th className="text-right py-2 font-medium">Utilization Rate</th>
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
                    <td className="text-right py-2">{result.utilizationRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4 text-black px-4">Investment cost</h3>

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
                        <span className="text-sm font-medium">CAPEX</span>
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
                        <span className="text-sm font-medium">OPEX</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">€{result.opex.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.isReusable ? "(Laundry + Waste - Residual) × Max Uses" : "Purchase + Waste costs"}
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

                  {/* Capacity Analysis */}
                  {result.isReusable && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Capacity Analysis</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Gowns purchased:</span>
                          <p className="font-medium">{result.numberOfGownsToInvest.toLocaleString()} gowns</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Maximum possible uses:</span>
                          <p className="font-medium">{result.maxGownUsesWithReduction.toLocaleString()} uses</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Demand:</span>
                          <p className="font-medium">{result.totalUsesOverHorizon.toLocaleString()} uses</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Utilization:</span>
                          <p className="font-medium">{result.utilizationRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  )}

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

        {/* Summary Comparison */}
        {results.length > 1 && (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Investment Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lowest Total Expenses:</span>
                  <span className="text-black font-bold">
                    {
                      results.reduce((min, current) => (current.totalExpenses < min.totalExpenses ? current : min))
                        .gownName
                    }{" "}
                    (€{Math.min(...results.map((r) => r.totalExpenses)).toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lowest CAPEX:</span>
                  <span className="text-black font-bold">
                    {results.reduce((min, current) => (current.capex < min.capex ? current : min)).gownName} (€
                    {Math.min(...results.map((r) => r.capex)).toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lowest OPEX:</span>
                  <span className="text-black font-bold">
                    {results.reduce((min, current) => (current.opex < min.opex ? current : min)).gownName} (€
                    {Math.min(...results.map((r) => r.opex)).toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lowest CO₂ Emissions:</span>
                  <span className="text-black font-bold">
                    {
                      results.reduce((min, current) =>
                        current.co2Breakdown.totalEmissions < min.co2Breakdown.totalEmissions ? current : min,
                      ).gownName
                    }{" "}
                    ({Math.min(...results.map((r) => r.co2Breakdown.totalEmissions)).toLocaleString()} kg)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
