"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, DollarSign, Building, Cog, AlertTriangle, Leaf, Droplets, Zap } from "lucide-react"
import type { Gown } from "@/app/interfaces/Gown"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  // Backend calculations
  maxGownUsesWithReduction: number
  totalUsesOverHorizon: number
  extraDisposableGownsNeeded: number
  // Financial results
  capex: number
  opex: number
  totalExpenses: number
  // Emissions results
  totalCO2: number
  totalWater: number
  totalEnergy: number
  // Additional metrics
  utilizationRate: number
  costPerUse: number
}

export default function GownInvestmentCalculator({ selectedGowns }: InvestmentCalculatorProps) {
  // User inputs
  const [numberOfGownsToInvest, setNumberOfGownsToInvest] = useState<number>(8000)
  const [planningHorizon, setPlanningHorizon] = useState<number>(5)
  const [annualGownUse, setAnnualGownUse] = useState<number>(36500)

  const [results, setResults] = useState<InvestmentResult[]>([])
  const [sortBy, setSortBy] = useState<"total" | "capex" | "opex" | "emissions">("total")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const calculateInvestment = () => {
    if (selectedGowns.length === 0) return

    const totalUsesOverHorizon = annualGownUse * planningHorizon

    const calculatedResults: InvestmentResult[] = selectedGowns.map((gown) => {
      const result: InvestmentResult = {
        gownId: gown.id,
        gownName: gown.name,
        isReusable: gown.reusable,
        numberOfGownsToInvest,
        planningHorizon,
        annualGownUse,
        maxGownUsesWithReduction: 0,
        totalUsesOverHorizon,
        extraDisposableGownsNeeded: 0,
        capex: 0,
        opex: 0,
        totalExpenses: 0,
        totalCO2: 0,
        totalWater: 0,
        totalEnergy: 0,
        utilizationRate: 0,
        costPerUse: 0,
      }

      if (gown.reusable && gown.washes) {
        // REUSABLE GOWN CALCULATIONS

        // Maximum number of gown uses from reusable gowns, with 5% reduction accounted for lost
        const maxUsesWithoutReduction = numberOfGownsToInvest * gown.washes
        result.maxGownUsesWithReduction = Math.floor(maxUsesWithoutReduction * 0.95) // 5% reduction

        // CAPEX: Initial investment in reusable gowns
        result.capex = numberOfGownsToInvest * gown.cost

        // Check if we need extra disposable gowns (OPEX)
        if (totalUsesOverHorizon > result.maxGownUsesWithReduction) {
          result.extraDisposableGownsNeeded = totalUsesOverHorizon - result.maxGownUsesWithReduction
        } else {
          result.extraDisposableGownsNeeded = 0
        }

        // OPEX for reusable gowns: (laundry cost + waste cost - residual values) * maxGownUsesWithReduction
        const opexPerUse = gown.laundry_cost + gown.waste_cost - gown.residual_value

        result.opex = opexPerUse * result.maxGownUsesWithReduction

        // EMISSIONS CALCULATIONS based on actual demand (totalUsesOverHorizon)
        result.totalCO2 = Math.floor(gown.emission_impacts.CO2 * totalUsesOverHorizon)
        result.totalWater = Math.floor(gown.emission_impacts.Water * totalUsesOverHorizon)
        result.totalEnergy = Math.floor(gown.emission_impacts.Energy * totalUsesOverHorizon)

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

        // EMISSIONS CALCULATIONS based on demand (totalUsesOverHorizon)
        result.totalCO2 = Math.floor(gown.emission_impacts.CO2 * totalUsesOverHorizon)
        result.totalWater = Math.floor(gown.emission_impacts.Water * totalUsesOverHorizon)
        result.totalEnergy = Math.floor(gown.emission_impacts.Energy * totalUsesOverHorizon)

        result.utilizationRate = 100 // Always 100% for disposables
      }

      result.totalExpenses = result.capex + result.opex
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
          <CardTitle className="text-xl font-bold">Investment Analysis (CAPEX/OPEX)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Input Parameters */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
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
                  <th className="text-right py-2 font-medium">Max Uses (5% reduction)</th>
                  <th className="text-right py-2 font-medium">Extra Disposable Needed</th>
                  <th className="text-right py-2 font-medium">Utilization Rate</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.gownId} className="border-b">
                    <td className="py-2 font-medium">{result.gownName}</td>
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
                return (a.totalCO2 - b.totalCO2) * multiplier
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">CAPEX</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">€{result.capex.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.isReusable
                          ? `${numberOfGownsToInvest.toLocaleString()} gowns × €${selectedGowns.find((g) => g.id === result.gownId)?.cost.toFixed(2)}`
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

                    <div className="space-y-2 bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Total Expenses</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">€{result.totalExpenses.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">€{result.costPerUse.toFixed(2)} per use</p>
                    </div>
                  </div>

                  {/* Emissions Section */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-3 text-green-800">Total Environmental Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">CO₂ Emissions</span>
                        </div>
                        <p className="text-xl font-bold text-green-600">{result.totalCO2.toLocaleString()} kg</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedGowns.find((g) => g.id === result.gownId)?.emission_impacts.CO2.toFixed(2)} kg per
                          use
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Water Usage</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600">{result.totalWater.toLocaleString()} L</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedGowns.find((g) => g.id === result.gownId)?.emission_impacts.Water.toFixed(2)} L per
                          use
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">Energy Usage</span>
                        </div>
                        <p className="text-xl font-bold text-yellow-600">{result.totalEnergy.toLocaleString()} MJ</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedGowns.find((g) => g.id === result.gownId)?.emission_impacts.Energy.toFixed(2)} MJ per
                          use
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Analysis */}
                  {result.isReusable && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Capacity Analysis</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                        <div>
                          <span className="text-muted-foreground">Extra Disposables:</span>
                          <p className="font-medium">{result.extraDisposableGownsNeeded.toLocaleString()}</p>
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
                        {result.extraDisposableGownsNeeded.toLocaleString()} additional disposable gowns.
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
                    {results.reduce((min, current) => (current.totalCO2 < min.totalCO2 ? current : min)).gownName} (
                    {Math.min(...results.map((r) => r.totalCO2)).toLocaleString()} kg)
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
