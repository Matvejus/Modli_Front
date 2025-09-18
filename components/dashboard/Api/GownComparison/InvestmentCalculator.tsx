"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, Building, Cog, AlertTriangle, Leaf, Droplets, Zap, ShoppingCart } from 'lucide-react'
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
  const [isCalculating, setIsCalculating] = useState(false)
  const [hasCalculated, setHasCalculated] = useState(false)

  const calculateInvestment = async () => {
    if (selectedGowns.length === 0) return

    // Validate that all required fields are filled
    if (!numberOfGownsToInvest || !planningHorizon || !annualGownUse) {
      alert("Please fill in all required fields before calculating.")
      return
    }

    const parameters: InvestmentParameters = {
      numberOfGownsToInvest,
      planningHorizon,
      annualGownUse,
    }

    setIsCalculating(true)
    try {
      const calculatedResults = await calculateInvestmentResults(selectedGowns, parameters)
      setResults(calculatedResults)
      setHasCalculated(true)
    } catch (error) {
      console.error("Error calculating investment results:", error)
      alert("Error calculating investment results. Please try again.")
    } finally {
      setIsCalculating(false)
    }
  }

  // Only trigger parameter change callback, not calculations
  useEffect(() => {
    if (onParametersChange) {
      onParametersChange({
        numberOfGownsToInvest: numberOfGownsToInvest ?? 0,
        planningHorizon: planningHorizon ?? 0,
        annualGownUse: annualGownUse ?? 0,
      })
    }
  }, [numberOfGownsToInvest, planningHorizon, annualGownUse, onParametersChange])

  // Reset results when gowns change
  useEffect(() => {
    setResults([])
    setHasCalculated(false)
  }, [selectedGowns])

  // Check if all required fields are filled
  const canCalculate = numberOfGownsToInvest && planningHorizon && annualGownUse && selectedGowns.length > 0

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
                Units purchased (reusable gowns) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="gowns-investment"
                type="number"
                min="1"
                placeholder="Enter number of gowns"
                value={numberOfGownsToInvest === undefined ? "" : numberOfGownsToInvest}
                onChange={(e) => setNumberOfGownsToInvest(e.target.value === "" ? undefined : Number(e.target.value))}
                className="border-black"
                disabled={isCalculating}
              />
            </div>

            {/* Other Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="planning-horizon" className="text-black font-medium">
                  Investment period (years) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="planning-horizon"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="Enter years"
                  value={planningHorizon === undefined ? "" : planningHorizon}
                  onChange={(e) => setPlanningHorizon(e.target.value === "" ? undefined : Number(e.target.value))}
                  className="border-black"
                  disabled={isCalculating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual-use" className="text-black font-medium">
                  Annual usage (expected) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="annual-use"
                  type="number"
                  min="1"
                  placeholder="Enter annual usage"
                  value={annualGownUse === undefined ? "" : annualGownUse}
                  onChange={(e) => setAnnualGownUse(e.target.value === "" ? undefined : Number(e.target.value))}
                  className="border-black"
                  disabled={isCalculating}
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={calculateInvestment}
                disabled={!canCalculate || isCalculating}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isCalculating ? (
                  <>
                    <Calculator className="h-4 w-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Cost
                  </>
                )}
              </Button>
            </div>

            {!canCalculate && (
              <p className="text-sm text-muted-foreground text-center">
                Please fill in all required fields to perform the cost comparison analysis.
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {hasCalculated && results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4 text-black px-4">Investment Cost versus Operational Cost</h3>
            {sortedResults.map((result) => {
              // Find the corresponding gown data for accurate table calculations
              const correspondingGown = selectedGowns.find((g) => g.id === result.gownId)

              // Calculate disposable gown unit cost for display
              const getDisposableGownUnitCost = () => {
                if (result.extraDisposableGownsNeeded === 0) return 0
                
                // First try to find a selected disposable gown
                const selectedDisposableGown = selectedGowns.find((g) => !g.reusable)
                if (selectedDisposableGown) {
                  return selectedDisposableGown.cost + (selectedDisposableGown.waste_cost || 0)
                }
                
                // Otherwise calculate from the total extra disposable cost
                return result.extraDisposableCost / result.extraDisposableGownsNeeded
              }

              const disposableUnitCost = getDisposableGownUnitCost()

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
                      className={`grid grid-cols-1 md:grid-cols-2 ${result.extraDisposableCost > 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 mb-4 items-start`}
                    >
                      <div className="space-y-2 p-3 bg-blue-50 rounded-lg h-full">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Total Investment Cost</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">€{result.capex.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.isReusable
                            ? `${result.numberOfGownsToInvest.toLocaleString()} gowns × €${correspondingGown?.cost.toFixed(0)}`
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
                            {result.extraDisposableGownsNeeded.toLocaleString()} disposable gowns × €{disposableUnitCost.toFixed(2)} (Unit of disposable + waste cost)
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
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
        )}
      </CardContent>
    </Card>
  )
}