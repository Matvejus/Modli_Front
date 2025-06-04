"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp, Leaf, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Gown } from "@/app/interfaces/Gown"

interface InvestmentCalculatorProps {
  selectedGowns: Gown[]
}

interface InvestmentResult {
  gownId: string
  gownName: string
  isReusable: boolean
  totalGownsNeeded: number
  totalInitialCost: number
  totalLaundryCost: number
  totalWasteCost: number
  totalInvestmentCost: number
  costPerUse: number
  totalEmissions: number
  totalWashes: number
  replacementCycles: number
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
      let totalGownsNeeded: number
      let replacementCycles: number
      let totalWashes: number
      let totalLaundryCost = 0
      let totalWasteCost = 0

      if (gown.reusable && gown.washes) {
        // For reusable gowns: calculate how many gowns needed based on wash cycles
        const usesPerGown = gown.washes
        totalGownsNeeded = Math.ceil(totalUsesOverPeriod / usesPerGown)
        replacementCycles = Math.ceil(totalUsesOverPeriod / usesPerGown)
        totalWashes = Math.min(totalUsesOverPeriod, totalGownsNeeded * usesPerGown)

        // Calculate laundry cost (cost per wash * total uses)
        totalLaundryCost = (gown.laundry_cost || 0) * totalUsesOverPeriod
      } else {
        // For single-use gowns: one gown per use
        totalGownsNeeded = totalUsesOverPeriod
        replacementCycles = totalUsesOverPeriod
        totalWashes = 0

        // Calculate waste cost (cost per gown * total gowns)
        totalWasteCost = (gown.emission_impacts.waste || 0) * totalGownsNeeded
      }

      const totalInitialCost = totalGownsNeeded * gown.cost
      const totalInvestmentCost = totalInitialCost + totalLaundryCost + totalWasteCost
      const costPerUse = totalInvestmentCost / totalUsesOverPeriod

      // Calculate total emissions (CO2 equivalent per use * total uses)
      const totalEmissions = gown.emission_impacts.CO2 * totalUsesOverPeriod

      return {
        gownId: gown.id,
        gownName: gown.name,
        isReusable: gown.reusable,
        totalGownsNeeded,
        totalInitialCost,
        totalLaundryCost,
        totalWasteCost,
        totalInvestmentCost,
        costPerUse,
        totalEmissions,
        totalWashes,
        replacementCycles,
      }
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
          <div className="rounded-full bg-blue-100 p-2">
            <Calculator className="h-5 w-5 text-blue-600" />
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
                Total Cost
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
                return (a.totalInvestmentCost - b.totalInvestmentCost) * multiplier
              } else {
                return (a.totalEmissions - b.totalEmissions) * multiplier
              }
            })
            .map((result) => (
              <Card key={result.gownId} className="border-l-4 border-l-blue-500">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Total Investment Cost</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        €{result.totalInvestmentCost.toLocaleString()}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Initial: €{result.totalInitialCost.toLocaleString()}</p>
                        {result.isReusable && result.totalLaundryCost > 0 && (
                          <p className="text-blue-600 font-medium">
                            + Laundry: €{result.totalLaundryCost.toLocaleString()}
                          </p>
                        )}
                        {!result.isReusable && result.totalWasteCost > 0 && (
                          <p className="text-orange-600 font-medium">
                            + Waste: €{result.totalWasteCost.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Cost per Use</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">€{result.costPerUse.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        Over {(usesPerDay * workingDaysPerYear * investmentPeriod).toLocaleString()} total uses
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Total CO₂ Emissions</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{result.totalEmissions.toFixed(1)} kg</p>
                      <p className="text-xs text-muted-foreground">
                        CO₂-equivalent over {investmentPeriod} year{investmentPeriod > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">
                          {result.isReusable ? "Replacement Cycles" : "Disposal Count"}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{result.replacementCycles.toLocaleString()}</p>
                      {result.isReusable && (
                        <p className="text-xs text-muted-foreground">
                          {result.totalWashes.toLocaleString()} total washes
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Purchase Cost per Gown:</span>
                        <p className="font-medium">
                          €{selectedGowns.find((g) => g.id === result.gownId)?.cost.toFixed(2)}
                        </p>
                      </div>
                      {result.isReusable && (
                        <>
                          <div>
                            <span className="text-muted-foreground">Max Washes per Gown:</span>
                            <p className="font-medium">{selectedGowns.find((g) => g.id === result.gownId)?.washes}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Laundry Cost per Use:</span>
                            <p className="font-medium text-blue-600">
                              €
                              {selectedGowns
                                .find((g) => g.id === result.gownId)
                                ?.laundry_cost?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </>
                      )}
                      {!result.isReusable && (
                        <div>
                          <span className="text-muted-foreground">Waste Cost per Gown:</span>
                          <p className="font-medium text-orange-600">
                            €
                            {selectedGowns.find((g) => g.id === result.gownId)?.emission_impacts.waste?.toFixed(2) ||
                              "0.00"}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">CO₂ per Use:</span>
                        <p className="font-medium">
                          {selectedGowns.find((g) => g.id === result.gownId)?.emission_impacts.CO2.toFixed(2)} kg
                        </p>
                      </div>
                    </div>
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
                  <span className="font-medium">Most Cost-Effective (total investment):</span>
                  <span className="text-green-600 font-bold">
                    {
                      results.reduce((min, current) =>
                        current.totalInvestmentCost < min.totalInvestmentCost ? current : min,
                      ).gownName
                    }{" "}
                    (€{Math.min(...results.map((r) => r.totalInvestmentCost)).toLocaleString()})
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
                  <span className="font-medium">Lowest Initial Investment:</span>
                  <span className="text-blue-600 font-bold">
                    {
                      results.reduce((min, current) =>
                        current.totalInitialCost < min.totalInitialCost ? current : min,
                      ).gownName
                    }{" "}
                    (€{Math.min(...results.map((r) => r.totalInitialCost)).toLocaleString()})
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
