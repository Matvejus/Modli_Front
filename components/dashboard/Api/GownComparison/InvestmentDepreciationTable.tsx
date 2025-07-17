"use client"

import { calculateDepreciationSchedule, calculateDisposableScheduleWithGownData } from "@/lib/InvestmentCalculations"

interface InvestmentResult {
  gownId: string
  gownName: string
  isReusable: boolean
  numberOfGownsToInvest: number
  planningHorizon: number
  annualGownUse: number
  totalUsesOverHorizon: number
  capex: number
  opex: number
  extraDisposableCost: number
  totalExpenses: number
}

interface InvestmentDepreciationTableProps {
  result: InvestmentResult
  gown?: any // Optional gown data for more accurate calculations
}

export default function InvestmentDepreciationTable({ result, gown }: InvestmentDepreciationTableProps) {
  if (result.isReusable) {
    // Reusable gown depreciation schedule
    const depreciationSchedule = calculateDepreciationSchedule(result)

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Year</th>
              <th className="text-right py-2 font-medium">Book Value Reusable Gown</th>
              <th className="text-right py-2 font-medium">Annual Depreciation</th>
              <th className="text-right py-2 font-medium">Operational Costs Reusable Gown</th>
            </tr>
          </thead>
          <tbody>
            {depreciationSchedule.map((row) => (
              <tr key={row.year} className="border-b">
                <td className="py-2 font-medium">Year {row.year}</td>
                <td className="text-right py-2">{Math.round(row.bookValue).toLocaleString()}</td>
                <td className="text-right py-2">{Math.round(row.annualDepreciation).toLocaleString()}</td>
                <td className="text-right py-2">{Math.round(row.operationalCosts).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    // Disposable gown yearly expense schedule
    const disposableSchedule = calculateDisposableScheduleWithGownData(result, gown)

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Year</th>
              <th className="text-right py-2 font-medium">Purchase Costs</th>
              <th className="text-right py-2 font-medium">Waste Costs</th>
              <th className="text-right py-2 font-medium">Total Annual Costs</th>
            </tr>
          </thead>
          <tbody>
            {disposableSchedule.map((row) => (
              <tr key={row.year} className="border-b">
                <td className="py-2 font-medium">Year {row.year}</td>
                <td className="text-right py-2">{Math.round(row.purchaseCosts).toLocaleString()}</td>
                <td className="text-right py-2">{Math.round(row.wasteCosts).toLocaleString()}</td>
                <td className="text-right py-2 font-medium">{Math.round(row.totalAnnualCosts).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
