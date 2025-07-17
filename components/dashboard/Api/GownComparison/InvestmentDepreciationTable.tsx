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
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-medium">Year</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-medium">Book Value Reusable Gown</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-medium">Annual Depreciation</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-medium">
                Operational Costs Reusable Gown
              </th>
            </tr>
          </thead>
          <tbody>
            {depreciationSchedule.map((row) => (
              <tr key={row.year} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Year {row.year}</td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  {Math.round(row.bookValue).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  {Math.round(row.annualDepreciation).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  {Math.round(row.operationalCosts).toLocaleString()}
                </td>
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
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-medium">Year</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-medium">Purchase Costs</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-medium">Waste Costs</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-medium">Total Annual Costs</th>
            </tr>
          </thead>
          <tbody>
            {disposableSchedule.map((row) => (
              <tr key={row.year} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Year {row.year}</td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  {Math.round(row.purchaseCosts).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  {Math.round(row.wasteCosts).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                  {Math.round(row.totalAnnualCosts).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
