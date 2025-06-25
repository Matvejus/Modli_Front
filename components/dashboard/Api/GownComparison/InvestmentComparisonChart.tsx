"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

interface InvestmentResult {
  gownId: string
  gownName: string
  isReusable: boolean
  numberOfGownsToInvest: number
  planningHorizon: number
  annualGownUse: number
  capex: number
  opex: number
  extraDisposableCost: number
  totalExpenses: number
  costPerUse: number
}

interface InvestmentComparisonChartProps {
  results: InvestmentResult[]
  selectedGowns: any[] // Gown type from your interface
}

export default function InvestmentComparisonChart({ results, selectedGowns }: InvestmentComparisonChartProps) {
  if (results.length === 0) return null

  // Prepare data for the simple CAPEX vs OPEX stacked chart
  const prepareChartData = () => {
    return results
      .map((result) => {
        const gown = selectedGowns.find((g) => g.id === result.gownId)
        if (!gown) return null

        // For the chart, we want to show total OPEX including extra disposable costs
        const totalOpex = result.opex + result.extraDisposableCost

        return {
          name: result.gownName.length > 12 ? `${result.gownName.substring(0, 12)}...` : result.gownName,
          fullName: result.gownName,
          CAPEX: result.capex,
          OPEX: totalOpex,
          isReusable: result.isReusable,
          // Store individual components for tooltip
          baseOpex: result.opex,
          extraDisposableCost: result.extraDisposableCost,
          totalExpenses: result.totalExpenses,
        }
      })
      .filter((item): item is NonNullable<typeof item> => !!item)
  }

  const chartData = prepareChartData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-muted-foreground mb-2">{data.isReusable ? "Reusable Gown" : "Disposable Gown"}</p>

          {/* CAPEX */}
          <p style={{ color: "#4472C4" }}>CAPEX: €{data.CAPEX.toLocaleString()}</p>

          {/* OPEX breakdown */}
          <p style={{ color: "#E15759" }}>OPEX: €{data.OPEX.toLocaleString()}</p>

          {/* Show OPEX breakdown if there are extra disposable costs */}
          {data.extraDisposableCost > 0 && (
            <div className="ml-4 text-xs text-muted-foreground">
              <p>• Base OPEX: €{data.baseOpex.toLocaleString()}</p>
              <p>• Extra Disposables: €{data.extraDisposableCost.toLocaleString()}</p>
            </div>
          )}

          <div className="mt-2 pt-2 border-t">
            <p className="font-medium">Total: €{data.totalExpenses.toLocaleString()}</p>
          </div>
        </div>
      )
    }
    return null
  }

  // Calculate max value for better Y-axis scaling
  const maxValue = Math.max(...chartData.map((d) => d.CAPEX + d.OPEX))
  const yAxisMax = Math.ceil(maxValue / 50) * 50 // Round up to nearest 50

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          CAPEX vs OPEX Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} angle={0} textAnchor="middle" height={60} />
                <YAxis
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                  fontSize={12}
                  domain={[0, yAxisMax]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {/* Stacked bars with colors matching the reference image */}
                <Bar dataKey="CAPEX" stackId="a" fill="#4472C4" name="CAPEX" />
                <Bar dataKey="OPEX" stackId="a" fill="#E15759" name="OPEX" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary insights
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3">Cost Structure Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-600">Highest CAPEX:</span>
                <p className="text-muted-foreground">
                  {chartData.reduce((max, current) => (current.CAPEX > max.CAPEX ? current : max)).fullName} (€
                  {chartData
                    .reduce((max, current) => (current.CAPEX > max.CAPEX ? current : max))
                    .CAPEX.toLocaleString()}
                  )
                </p>
              </div>
              <div>
                <span className="font-medium text-red-600">Highest OPEX:</span>
                <p className="text-muted-foreground">
                  {chartData.reduce((max, current) => (current.OPEX > max.OPEX ? current : max)).fullName} (€
                  {chartData.reduce((max, current) => (current.OPEX > max.OPEX ? current : max)).OPEX.toLocaleString()})
                </p>
              </div>
              <div>
                <span className="font-medium text-green-600">Lowest Total Cost:</span>
                <p className="text-muted-foreground">
                  {
                    chartData.reduce((min, current) => (current.totalExpenses < min.totalExpenses ? current : min))
                      .fullName
                  }{" "}
                  (€
                  {chartData
                    .reduce((min, current) => (current.totalExpenses < min.totalExpenses ? current : min))
                    .totalExpenses.toLocaleString()}
                  )
                </p>
              </div>
              <div>
                <span className="font-medium text-purple-600">CAPEX vs OPEX Ratio:</span>
                <div className="text-muted-foreground">
                  {chartData.map((item, index) => (
                    <p key={index}>
                      {item.name}:{" "}
                      {item.CAPEX > 0
                        ? `${((item.CAPEX / (item.CAPEX + item.OPEX)) * 100).toFixed(0)}% CAPEX`
                        : "100% OPEX"}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cost breakdown table */}
          {/* <div className="mt-4">
            <h4 className="font-medium mb-3">Detailed Cost Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">Gown Type</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">CAPEX (€)</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">OPEX (€)</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">Total (€)</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">Cost per Use (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.gownId}>
                      <td className="border border-gray-300 px-3 py-2 font-medium">{result.gownName}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right">{result.capex.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right">
                        {(result.opex + result.extraDisposableCost).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-medium">
                        {result.totalExpenses.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right">{result.costPerUse.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
