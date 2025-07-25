"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { Gown } from "@/app/interfaces/Gown"
import { Wallet, Info } from "lucide-react"

interface EconomicImpactProps {
  gowns: Gown[]
}

const EconomicImpacts = ({ gowns }: EconomicImpactProps) => {
  const colors = ["#2C3E50", "#1ABC9C", "#E74C3C", "#3498DB", "#9B59B6", "#34495E", "#F1C40F"]
  const uses = 1

  // Define the categories we want to display
  const categories = ["Purchase cost", "Waste cost", "Laundry cost", "Residual value", "Total cost"]

  // Transform data to have categories on x-axis and gowns as bars
  const transformedData = categories.map((category) => {
    const dataPoint: Record<string, any> = {
      category: category,
    }

    gowns.forEach((gown) => {
      if (category === "Purchase cost") {
        dataPoint[gown.name] = Number.parseFloat((gown.emission_impacts.purchase_cost ?? 0).toFixed(2)) * uses
      } else if (category === "Waste cost") {
        dataPoint[gown.name] = Number.parseFloat((gown.emission_impacts.waste ?? 0).toFixed(2)) * uses
      } else if (category === "Laundry cost") {
        dataPoint[gown.name] = Number.parseFloat((gown.laundry_cost ?? 0).toFixed(2)) * uses
      } else if (category === "Residual value") {
        dataPoint[gown.name] = Number.parseFloat((gown.emission_impacts.residual_value ?? 0).toFixed(4)) * uses
      } else if (category === "Total cost") {
        // Sum all impacts for the total
        const purchaseCost = Number.parseFloat((gown.emission_impacts.purchase_cost ?? 0).toFixed(2)) * uses
        const wasteCost = Number.parseFloat((gown.emission_impacts.waste ?? 0).toFixed(2)) * uses
        const laundryCost = Number.parseFloat((gown.laundry_cost ?? 0).toFixed(2)) * uses
        const residualValue = Number.parseFloat((gown.emission_impacts.residual_value ?? 0).toFixed(2)) * uses
        // Note: Residual value is typically subtracted as it's a benefit, not a cost
        dataPoint[gown.name] = purchaseCost + wasteCost + laundryCost - residualValue
      }
    })

    return dataPoint
  })

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Wallet className="inline-block mr-2" />
            Economic Impact (per 1 use)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[500px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  height={20}
                />
                <YAxis tick={{ fontSize: 12 }} width={60} label={{ value: "€", angle: -90, position: "insideLeft" }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                {gowns.map((gown, index) => (
                  <Bar key={gown.name} dataKey={gown.name} fill={colors[index % colors.length]} name={gown.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>

            {/* Custom tooltip overlay for Residual value */}
            <div className="absolute bottom-[57px]" style={{ left: "calc(105px + (100% - 90px) * 0.7)" }}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <span className="sr-only">More information about residual value</span>
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Potential monetary value of isolation gowns/material at end-of-life</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export default EconomicImpacts
