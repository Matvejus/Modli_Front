"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp, Leaf, DollarSign, Calendar, Recycle, Trash2 } from "lucide-react"
import type { Gown } from "@/app/interfaces/Gown"
import { Button } from "@/components/ui/button"
import type { InvestmentResult } from "@/app/interfaces/Investment"

interface InvestmentCalculatorProps {
  selectedGowns: Gown[]
}



export default function GownInvestmentCalculator({ selectedGowns }: InvestmentCalculatorProps) {
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(1)
  const [usesPerDay, setUsesPerDay] = useState<number>(10)
  const [workingDaysPerYear, setWorkingDaysPerYear] = useState<number>(250)
  const [results, setResults] = useState<InvestmentResult[]>([])
  const [sortBy, setSortBy] = useState<"cost" | "emissions">("cost")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const calculateInvestment = () => {
    if (selectedGowns.length === 0) return

    const totalUsesPerYear = usesPerDay * workingDaysPerYear
    const totalUsesOverPeriod = totalUsesPerYear * investmentPeriod

    const calculatedResults: InvestmentResult[] = selectedGowns.map((gown) => {
      const result: InvestmentResult = {
        gownId: gown.id,
        gownName: gown.name,
        isReusable: gown.reusable,
        totalGownsNeeded: 0,
        totalInvestmentCost: 0,
        annualDepreciation: 0,
        annualUsage: totalUsesPerYear,
        annualLaundryCosts: 0,
        totalAnnualCostReusable: 0,
        totalPurchaseCostDisposable: 0,
        totalWasteCostDisposable: 0,
        totalAnnualCostDisposable: 0,
        costPerUse: 0,
        totalEmissionsCo2: 0,
        totalEmissionsWater: 0,
        totalEmissionsEnergy: 0,
        totalEmissions: 0,
        totalWashes: 0,
        replacementCycles: 0,
      }

      if (gown.reusable && gown.washes) {
        // REUSABLE GOWN CALCULATIONS
        const usesPerGown = gown.washes
        result.totalGownsNeeded = Math.ceil(totalUsesOverPeriod / usesPerGown)
        result.replacementCycles = Math.ceil(totalUsesOverPeriod / usesPerGown)
        result.totalWashes = Math.min(totalUsesOverPeriod, result.totalGownsNeeded * usesPerGown)

        // Total investment cost reusable gowns (€) = units purchased * purchase cost per gown
        result.totalInvestmentCost = result.totalGownsNeeded * gown.cost

        // Annual Depreciation (€) = total investment cost / Investment period (years)
        result.annualDepreciation = result.totalInvestmentCost / investmentPeriod

        // Annual Laundry costs for reusable gowns (€) = Annual usage * Laundry cost per 1 use
        result.annualLaundryCosts = result.annualUsage * (gown.laundry_cost || 0)

        // Total Annual cost for reusable gowns (€) = Annual depreciation + Annual laundry costs
        result.totalAnnualCostReusable = result.annualDepreciation + result.annualLaundryCosts

        result.costPerUse = result.totalAnnualCostReusable / result.annualUsage
      } else {
        // DISPOSABLE GOWN CALCULATIONS
        result.totalGownsNeeded = totalUsesOverPeriod
        result.replacementCycles = totalUsesOverPeriod
        result.totalWashes = 0

        // Total Purchase cost disposable gowns (€) = total gowns needed * cost per gown
        result.totalPurchaseCostDisposable = result.totalGownsNeeded * gown.cost

        // Total Waste cost for disposable gowns (€) = waste cost * total gowns
        result.totalWasteCostDisposable = (gown.emission_impacts.waste || 0) * result.totalGownsNeeded

        // Total annual cost = (purchase cost + waste cost) / investment period
        result.totalAnnualCostDisposable =
          (result.totalPurchaseCostDisposable + result.totalWasteCostDisposable) / investmentPeriod

        result.costPerUse = result.totalAnnualCostDisposable / result.annualUsage
      }

      // Calculate total emissions: CO2 equivalent, Water, Energy per use  * total uses
      result.totalEmissionsCo2 = gown.emission_impacts.CO2 * totalUsesOverPeriod
      result.totalEmissionsWater = gown.emission_impacts.Water * totalUsesOverPeriod
      result.totalEmissionsEnergy = gown.emission_impacts.Energy * totalUsesOverPeriod

      return result
    })

    setResults(calculatedResults)
  }

  useEffect(() => {
    if (selectedGowns.length > 0) {
      calculateInvestment()
    }
  }, [selectedGowns, investmentPeriod, usesPerDay, workingDaysPerYear])

  if (selectedGowns.length === 0) {
    return (
      <Card className="border-none bg-white shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-100 p-2">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-bold">Investment Analysis</CardTitle>
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
          <div className="rounded-full">
            <Calculator />
          </div>
          <CardTitle className="text-xl font-bold">Investment Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="investment-period">Investment Period (Years)</Label>
            <Input
              id="investment-period"
              type="number"
              min="1"
              max="20"
              value={investmentPeriod}
              onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uses-per-day">Uses per Day</Label>
            <Input
              id="uses-per-day"
              type="number"
              min="1"
              value={usesPerDay}
              onChange={(e) => setUsesPerDay(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="working-days">Working Days per Year</Label>
            <Input
              id="working-days"
              type="number"
              min="1"
              max="365"
              value={workingDaysPerYear}
              onChange={(e) => setWorkingDaysPerYear(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Sorting Controls */}
        {results.length > 1 && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">Sort by:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "cost" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("cost")}
                className="flex items-center gap-1"
              >
                <DollarSign className="h-4 w-4" />
                Annual Cost
                {sortBy === "cost" && (
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

        {/* Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Analysis Results</h3>

          {results
            .sort((a, b) => {
              const multiplier = sortOrder === "asc" ? 1 : -1
              if (sortBy === "cost") {
                const aCost = a.isReusable ? a.totalAnnualCostReusable : a.totalAnnualCostDisposable
                const bCost = b.isReusable ? b.totalAnnualCostReusable : b.totalAnnualCostDisposable
                return (aCost - bCost) * multiplier
              } else {
                return (a.totalEmissions - b.totalEmissions) * multiplier
              }
            })
            .map((result) => (
              <Card key={result.gownId} className="border-l">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {result.gownName}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.isReusable ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {result.isReusable ? "Reusable" : "Single-use"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.isReusable ? (
                    // REUSABLE GOWN DISPLAY
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Recycle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Total Investment Cost</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            €{result.totalInvestmentCost.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.totalGownsNeeded.toLocaleString()} gowns × €
                            {selectedGowns.find((g) => g.id === result.gownId)?.cost.toFixed(2)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Annual Depreciation</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            €{result.annualDepreciation.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Over {investmentPeriod} year{investmentPeriod > 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">Annual Laundry Costs</span>
                          </div>
                          <p className="text-2xl font-bold text-yellow-600">
                            €{result.annualLaundryCosts.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.annualUsage.toLocaleString()} uses × €
                            {selectedGowns
                              .find((g) => g.id === result.gownId)
                              ?.laundry_cost?.toFixed(2) || "0.00"}
                          </p>
                        </div>

                        <div className="space-y-2 bg-yellow-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Total Annual Cost</span>
                          </div>
                          <p className="text-2xl font-bold text-orange-600">
                            €{result.totalAnnualCostReusable.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Depreciation + Laundry</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-blue-50 p-3 rounded-lg">
                        <div>
                          <span className="text-muted-foreground">Cost per Use:</span>
                          <p className="font-bold text-blue-600">€{result.costPerUse.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max Washes per Gown:</span>
                          <p className="font-medium">{selectedGowns.find((g) => g.id === result.gownId)?.washes}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Washes:</span>
                          <p className="font-medium">{result.totalWashes.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CO₂ per Use:</span>
                          <p className="font-medium">
                            {selectedGowns.find((g) => g.id === result.gownId)?.emission_impacts.CO2.toFixed(2)} kg
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    // DISPOSABLE GOWN DISPLAY
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Total Purchase Cost</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            €{result.totalPurchaseCostDisposable.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.totalGownsNeeded.toLocaleString()} gowns × €
                            {selectedGowns.find((g) => g.id === result.gownId)?.cost.toFixed(2)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">Total Waste Cost</span>
                          </div>
                          <p className="text-2xl font-bold text-red-600">
                            €{result.totalWasteCostDisposable.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.totalGownsNeeded.toLocaleString()} gowns × €
                            {selectedGowns.find((g) => g.id === result.gownId)?.emission_impacts.waste?.toFixed(2) ||
                              "0.00"}
                          </p>
                        </div>

                        <div className="space-y-2 bg-yellow-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Total Annual Cost</span>
                          </div>
                          <p className="text-2xl font-bold text-orange-600">
                            €{result.totalAnnualCostDisposable.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Purchase + Waste / {investmentPeriod} year{investmentPeriod > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-orange-50 p-3 rounded-lg">
                        <div>
                          <span className="text-muted-foreground">Cost per Use:</span>
                          <p className="font-bold text-orange-600">€{result.costPerUse.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Annual Usage:</span>
                          <p className="font-medium">{result.annualUsage.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Disposals:</span>
                          <p className="font-medium">{result.replacementCycles.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CO₂ per Use:</span>
                          <p className="font-medium">
                            {selectedGowns.find((g) => g.id === result.gownId)?.emission_impacts.CO2.toFixed(2)} kg
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Emissions Summary */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-row items-center gap-2 mb-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Environmental Impact</span>
                    </div>
                    <div className="flex flex-row gap-6">
                      <p className="text-lg font-bold text-green-600">
                        {result.totalEmissionsCo2.toFixed(1)} kg CO₂-equivalent
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {result.totalEmissionsWater.toFixed(1)} kg Water
                      </p>
                      <p className="text-lg font-bold text-yellow-500">
                        {result.totalEmissionsEnergy.toFixed(1)} mj Energy
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Over {investmentPeriod} year{investmentPeriod > 1 ? "s" : ""} (
                      {(usesPerDay * workingDaysPerYear * investmentPeriod).toLocaleString()} total uses)
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Summary Comparison */}
        {results.length > 1 && (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lowest Annual Cost:</span>
                  <span className="text-green-600 font-bold">
                    {(() => {
                      const minResult = results.reduce((min, current) => {
                        const currentCost = current.isReusable
                          ? current.totalAnnualCostReusable
                          : current.totalAnnualCostDisposable
                        const minCost = min.isReusable ? min.totalAnnualCostReusable : min.totalAnnualCostDisposable
                        return currentCost < minCost ? current : min
                      })
                      const minCost = minResult.isReusable
                        ? minResult.totalAnnualCostReusable
                        : minResult.totalAnnualCostDisposable
                      return `${minResult.gownName} (€${minCost.toLocaleString()})`
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lowest CO₂ Emissions:</span>
                  <span className="text-green-600 font-bold">
                    {
                      results.reduce((min, current) => (current.totalEmissions < min.totalEmissions ? current : min))
                        .gownName
                    }{" "}
                    ({Math.min(...results.map((r) => r.totalEmissions)).toFixed(1)} kg)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Most Cost-Effective per Use:</span>
                  <span className="text-blue-600 font-bold">
                    {results.reduce((min, current) => (current.costPerUse < min.costPerUse ? current : min)).gownName}{" "}
                    (€{Math.min(...results.map((r) => r.costPerUse)).toFixed(2)})
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
