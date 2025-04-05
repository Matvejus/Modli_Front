"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  // Tooltip descriptions for each category
  const tooltipDescriptions: Record<string, string> = {
    "Purchase costs": "The initial cost of acquiring the gown. This is typically a one-time expense per gown.",
    "Waste costs":
      "The cost associated with disposing of the gown at the end of its lifecycle, including environmental fees.",
    Laundry: "The cost of cleaning and sterilizing the gown between uses. This accumulates over the gown's lifetime.",
    "Residual Value": "The remaining value of the gown after its expected use. This is subtracted from total costs.",
    Total:
      "The sum of all costs (Purchase + Waste + Laundry) minus the Residual Value, representing the total economic impact.",
  }

  // Custom X Axis with tooltips
  const CustomXAxis = (props: any) => {
    const { x, y, width, height, payload } = props

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
          {payload.value}
        </text>
        <foreignObject x={-10} y={20} width={20} height={20}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <span className="sr-only">More information about {payload.value}</span>
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltipDescriptions[payload.value]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </foreignObject>
      </g>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Wallet className="inline-block mr-2" />
          Economic Impact (per 1 use)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <TooltipProvider>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={CustomXAxis} interval={0} height={70} />
                <YAxis tick={{ fontSize: 12 }} width={60} label={{ value: "€", angle: -90, position: "insideLeft" }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ paddingTop: "0px" }} />

                {gowns.map((gown, index) => (
                  <Bar key={gown.name} dataKey={gown.name} fill={colors[index % colors.length]} name={gown.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}

export default EconomicImpacts

