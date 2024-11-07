'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'

interface Gown {
  id: string
  name: string
  cost: number
  washes?: number
  emissionImpacts: {
    production: number
    transportation: number
    washing: number
    disposal: number
  }
}

interface GownEmissionChartProps {
  gowns: Gown[]
}

export default function GownEmissionChart({ gowns }: GownEmissionChartProps) {
  const emissionData = [
    { category: 'Production', fullMark: 150 },
    { category: 'Transportation', fullMark: 150 },
    { category: 'Washing', fullMark: 150 },
    { category: 'Disposal', fullMark: 150 },
  ]

  gowns.forEach((gown) => {
    emissionData.forEach((data) => {
      data[gown.name] = gown.emissionImpacts[data.category.toLowerCase() as keyof typeof gown.emissionImpacts]
    })
  })

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Gown Emission Impact Comparison</CardTitle>
        <CardDescription>Radar chart comparing emission impacts across different categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ...Object.fromEntries(gowns.map((gown, index) => [
              gown.name,
              { label: gown.name, color: colors[index % colors.length] }
            ]))
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={emissionData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
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