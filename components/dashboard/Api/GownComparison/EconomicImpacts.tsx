"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Gown } from "@/app/interfaces/Gown"
import { Wallet } from "lucide-react"

interface EconomicImpactProps {
  gowns: Gown[]
}

const EconomicImpacts = ({ gowns }: EconomicImpactProps) => {
  const colors = ["#2C3E50", "#1ABC9C", "#E74C3C", "#3498DB", "#9B59B6", "#34495E", "#F1C40F"]
  const uses = 1

  // Define the categories we want to display
  const categories = ["Purchase costs", "Waste costs", "Laundry", "Residual Value", "Total"]

  // Transform data to have categories on x-axis and gowns as bars
  const transformedData = categories.map((category) => {
    const dataPoint: Record<string, any> = {
      category: category,
    }

    gowns.forEach((gown) => {
      if (category === "Purchase costs") {
        dataPoint[gown.name] = Number.parseFloat((gown.emission_impacts.purchase_cost ?? 0).toFixed(3)) * uses
      } else if (category === "Waste costs") {
        dataPoint[gown.name] = Number.parseFloat((gown.emission_impacts.waste ?? 0).toFixed(3)) * uses
      } else if (category === "Laundry") {
        dataPoint[gown.name] = Number.parseFloat((gown.laundry_cost ?? 0).toFixed(3)) * uses
      } else if (category === "Residual Value") {
        dataPoint[gown.name] = Number.parseFloat((gown.emission_impacts.residual_value ?? 0).toFixed(3)) * uses
      } else if (category === "Total") {
        // Sum all impacts for the total
        const purchaseCost = Number.parseFloat((gown.emission_impacts.purchase_cost ?? 0).toFixed(3)) * uses
        const wasteCost = Number.parseFloat((gown.emission_impacts.waste ?? 0).toFixed(3)) * uses
        const laundryCost = Number.parseFloat((gown.laundry_cost ?? 0).toFixed(3)) * uses
        const residualValue = Number.parseFloat((gown.emission_impacts.residual_value ?? 0).toFixed(3)) * uses

        // Note: Residual value is typically subtracted as it's a benefit, not a cost
        dataPoint[gown.name] = purchaseCost + wasteCost + laundryCost - residualValue
      }
    })

    return dataPoint
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Wallet className="inline-block mr-2" />
          Economic Impact (per 1 use)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} interval={0} angle={0} textAnchor="middle" height={70} />
              <YAxis tick={{ fontSize: 12 }} width={60} label={{ value: "€", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />

              {gowns.map((gown, index) => (
                <Bar key={gown.name} dataKey={gown.name} fill={colors[index % colors.length]} name={gown.name} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default EconomicImpacts

