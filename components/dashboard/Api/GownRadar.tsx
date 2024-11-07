'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'

interface Gown {
  id: string
  name: string
  cost: number
  washes?: number
  emission_impacts: {
    CO2: number
    Energy: number
    Water: number
    Cost: number
  }
}

interface GownEmissionChartProps {
  gowns: Gown[]
}

export default function GownEmissionChart({ gowns }: GownEmissionChartProps) {
  const emissionData = [
    { category: 'CO2', fullMark: 100 },
    { category: 'Energy', fullMark: 100 },
    { category: 'Water', fullMark: 100 },
    { category: 'Cost', fullMark: 100 },
  ]

  const maxValues = {
    CO2: Math.max(...gowns.map(gown => gown.emission_impacts.CO2)),
    Energy: Math.max(...gowns.map(gown => gown.emission_impacts.Energy)),
    Water: Math.max(...gowns.map(gown => gown.emission_impacts.Water)),
    Cost: Math.max(...gowns.map(gown => gown.emission_impacts.Cost)),
  }

  gowns.forEach((gown) => {
    emissionData.forEach((data) => {
      const value = gown.emission_impacts[data.category as keyof typeof gown.emission_impacts]
      const maxValue = maxValues[data.category as keyof typeof maxValues]
      data[gown.name] = (value / maxValue) * 100 // Normalize to percentage
    })
  })

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Gown Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ...Object.fromEntries(gowns.map((gown, index) => [
              gown.name,
              { label: gown.name, color: colors[index % colors.length] }
            ]))
          }}
          className="h-[max]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={emissionData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              {gowns.map((gown, index) => (
                <Radar
                  key={gown.id}
                  name={gown.name}
                  dataKey={gown.name}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}