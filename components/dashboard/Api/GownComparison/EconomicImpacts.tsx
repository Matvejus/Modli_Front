"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import type { Gown } from "@/app/interfaces/Gown"
import { Wallet } from "lucide-react"

interface EconomicImpactProps {
  gowns: Gown[]
}

// Add this interface after the EconomicImpactProps interface and before the component
interface ResidualValueDataPoint {
  washes: number
  [gownName: string]: number
}

const EconomicImpacts = ({ gowns }: EconomicImpactProps) => {
  const colors = ["#2C3E50", "#1ABC9C", "#E74C3C", "#3498DB", "#9B59B6", "#34495E", "#F1C40F"]
  const uses = 1
  const chartData = gowns.map((gown) => ({
    name: gown.name,
    "Purchase costs": Number.parseFloat((gown.emission_impacts.purchase_cost ?? 0).toFixed(3)) * uses,
    "Waste costs": Number.parseFloat((gown.emission_impacts.waste ?? 0).toFixed(3)) * uses,
    // "Use costs": Number.parseFloat((gown.emission_impacts.use_cost ?? 0).toFixed(3)),
    Laundry: Number.parseFloat((gown.laundry_cost ?? 0).toFixed(3)) * uses,
    "Residual Value": Number.parseFloat((gown.emission_impacts.residual_value ?? 0).toFixed(3)) * uses,
  }))

  const costCategories = ["Purchase costs", "Waste costs", "Laundry"]

  // Generate data for residual value line chart
  // Update the generateResidualValueData function to specify the return type
  const generateResidualValueData = (): ResidualValueDataPoint[] => {
    const washCounts = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const residualValueData: ResidualValueDataPoint[] = []

    // For each gown, create a line showing how residual value increases with washes
    gowns.forEach((gown, index) => {
      const maxValue = Number.parseFloat((gown.emission_impacts.residual_value ?? 0).toFixed(3)) * uses

      washCounts.forEach((washCount) => {
        // Calculate increasing residual value (linear increase for simplicity)
        const accumulatedValue = maxValue * (washCount / 100)

        // Find or create the data point for this wash count
        let dataPoint = residualValueData.find((d) => d.washes === washCount)
        if (!dataPoint) {
          dataPoint = { washes: washCount }
          residualValueData.push(dataPoint)
        }

        // Add this gown's residual value at this wash count
        dataPoint[gown.name] = Number(accumulatedValue.toFixed(3))
      })
    })

    // Sort by wash count
    return residualValueData.sort((a, b) => a.washes - b.washes)
  }

  const residualValueData: ResidualValueDataPoint[] = generateResidualValueData()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Wallet className="inline-block mr-2" />
          Economic Impact (per 1 use)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between">
          <div className="h-[400px] w-[48%]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={0} textAnchor="middle" height={20} />
                <YAxis tick={{ fontSize: 12 }} width={50} label={{ value: "€", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                {costCategories.map((cost, index) => (
                  <Bar key={cost} dataKey={cost} stackId="a" fill={colors[index]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Line chart for Residual Value vs Washes */}
          <div className="h-[400px] w-[48%]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={residualValueData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="washes"
                  tick={{ fontSize: 12 }}
                  label={{ value: "Number of Washes", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  width={50}
                  label={{ value: "Residual Value (€)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                {gowns.map((gown, index) => (
                  <Line
                    key={gown.name}
                    type="monotone"
                    dataKey={gown.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EconomicImpacts

