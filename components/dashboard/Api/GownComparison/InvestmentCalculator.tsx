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
import type { Gown } from "@/app/interfaces/Gown"

export interface InvestmentCalculatorProps {
  selectedGowns: Gown[]
  onParametersChange?: (params: InvestmentParameters) => void
}

import type { InvestmentResult } from "@/app/interfaces/InvestmentCalculator"
import {
  calculateInvestmentResults,
  sortInvestmentResults,
  type InvestmentParameters,
} from "@/lib/InvestmentCalculations"

export default function GownInvestmentCalculator({ selectedGowns, onParametersChange }: InvestmentCalculatorProps) {
  // User inputs
  const [numberOfGownsToInvest, setNumberOfGownsToInvest] = useState<number>()
  const [planningHorizon, setPlanningHorizon] = useState<number>()
  const [annualGownUse, setAnnualGownUse] = useState<number>()

  const [results, setResults] = useState<InvestmentResult[]>([])
  const [sortBy, setSortBy] = useState<"total" | "capex" | "opex" | "emissions">("total")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const calculateInvestment = () => {
    if (selectedGowns.length === 0) return

    const parameters: InvestmentParameters = {
      numberOfGownsToInvest: numberOfGownsToInvest ?? 0,
      planningHorizon: planningHorizon ?? 0,
      annualGownUse: annualGownUse ?? 0,
    }

    const calculatedResults = calculateInvestmentResults(selectedGowns, parameters)
    setResults(calculatedResults)
  }

  useEffect(() => {
    if (selectedGowns.length > 0) {
      calculateInvestment()
    }
  }, [selectedGowns, numberOfGownsToInvest, planningHorizon, annualGownUse])

  useEffect(() => {
    if (onParametersChange) {
      onParametersChange({
        numberOfGownsToInvest: numberOfGownsToInvest ?? 0,
        planningHorizon: planningHorizon ?? 0,
        annualGownUse: annualGownUse ?? 0,
      })
    }
  }, [numberOfGownsToInvest, planningHorizon, annualGownUse, onParametersChange])

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

  // Sort results for display
  const sortedResults = sortInvestmentResults(results, sortBy, sortOrder)

  return (
    <Card className="border-none bg-white shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-100 p-2">
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold">Cost Comparison Analysis</CardTitle>
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
              {/* <p className="text-xs text-muted-foreground">Specify the exact number of reusable gowns to purchase</p> */}
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
        {/* {results.length > 1 && (
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
        {/* <div className="p-4 rounded-lg">
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
        </div> */}

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4 text-black px-4">Investment versus Operational cost</h3>
          {sortedResults.map((result) => {
            // Find the corresponding gown data for accurate table calculations
            const correspondingGown = selectedGowns.find((g) => g.id === result.gownId)

            return (
              <Card key={result.gownId} className="">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {result.gownName}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.isReusable ? "bg-green-100 text-green-800" : ""
                      }`}
                    >
                      {result.isReusable ? "Reusable" : ""}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div
                    className={`grid grid-cols-${result.extraDisposableCost > 0 ? "4" : "3"} gap-4 mb-4 items-start`}
                  >
                    <div className="space-y-2 p-3 bg-blue-50 rounded-lg h-full">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Total Investment Cost</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">€{result.capex.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.isReusable
                          ? `${result.numberOfGownsToInvest.toLocaleString()} gowns × €${correspondingGown?.cost.toFixed(2)}`
                          : "No initial investment"}
                      </p>
                    </div>
                    <div className="space-y-2 p-3 bg-orange-50 rounded-lg h-full">
                      <div className="flex items-center gap-2">
                        <Cog className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Total Operational Cost</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">€{result.opex.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.isReusable
                          ? "(Laundry costs + Waste costs - Residual value) × Actual Uses"
                          : "Purchase costs + Waste costs"}
                      </p>
                    </div>
                    {result.extraDisposableCost > 0 && (
                      <div className="space-y-2 p-3 bg-red-50 rounded-lg h-full">
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
                    <div className="space-y-2 p-3 bg-green-50 rounded-lg h-full">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Total Cost</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">€{result.totalExpenses.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.isReusable
                          ? `(Investment costs + Operational costs) over ${planningHorizon} years`
                          : `Total cost for ${result.totalUsesOverHorizon.toLocaleString()} gowns over ${planningHorizon} years`}
                      </p>
                    </div>
                  </div>

                  {/* Add Depreciation/Expense Table for ALL Gowns with gown data */}
                  <div className="mb-4">
                    <InvestmentDepreciationTable result={result} gown={correspondingGown} />
                  </div>

                  {/* Emissions Section with Donut Charts */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-3 text-green-800">Total Environmental Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <EmissionDonutChart
                        breakdown={result.co2Breakdown}
                        title="CO₂ Impact"
                        unit="kg CO₂-eq"
                        color="#10b981"
                        icon={Leaf}
                      />
                      <EmissionDonutChart
                        breakdown={result.waterBreakdown}
                        title="Water Impact"
                        unit="L"
                        color="#3b82f6"
                        icon={Droplets}
                      />
                      <EmissionDonutChart
                        breakdown={result.energyBreakdown}
                        title="Energy Impact"
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
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
