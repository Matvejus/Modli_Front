"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Gown } from "@/app/interfaces/Gown"
interface EconomicImpactProps {
  gowns: Gown[]
}

const EconomicImpacts = ({ gowns }: EconomicImpactProps) => {
  const colors = ["#2C3E50", "#1ABC9C", "#E74C3C", "#3498DB", "#9B59B6", "#34495E", "#F1C40F"]
  const uses = 100
  const chartData = gowns.map((gown) => ({
    name: gown.name,
    "Purchase costs": Number.parseFloat((gown.emission_impacts.purchase_cost ?? 0).toFixed(3)) * uses,
    "Waste costs": Number.parseFloat((gown.emission_impacts.waste ?? 0).toFixed(3)) * uses,
    // "Use costs": Number.parseFloat((gown.emission_impacts.use_cost ?? 0).toFixed(3)),
    'Laundry': Number.parseFloat((gown.laundry_cost ?? 0).toFixed(3)) * uses,
    "Residual Value": Number.parseFloat((gown.emission_impacts.residual_value ?? 0).toFixed(3)) * uses,
  }))

  const costCategories = ["Purchase costs", "Waste costs", "Laundry"]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Economic Impact (100 gown uses)</CardTitle>
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
          {/* New chart for Residual Value */}
          <div className="h-[400px] w-[48%]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={0} textAnchor="middle" height={45} />
                <YAxis tick={{ fontSize: 12 }} width={50} label={{ value: "€", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="Residual Value" fill={colors[6]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EconomicImpacts

