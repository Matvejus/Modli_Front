"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const colors = ["#2980B9", "#3498DB", "#1ABC9C", "#16A085", "#ECF0F1", "#BDC3C7", "#2C3E50"]
const stages = ["HOSPITAL", "LAUNDRY", "USAGE", "LOST", "EOL", "ARRIVALMOM", "NEWARRIVALS"]

interface GownImpacts {
  Impacts: {
    stages: {
      [stage: string]: {
        [impact: string]: number
      }
    }
    total_impact: {
      [impact: string]: number
    }
  }
}

interface StackedData {
  [gownName: string]: GownImpacts
}

interface GownImpactsStackedProps {
  stackedData: StackedData
}

export default function Component({ stackedData }: GownImpactsStackedProps) {
  if (!stackedData || Object.keys(stackedData).length === 0) return <div>No data available</div>

  const gownData = Object.values(stackedData)[0]

  if (!gownData || !gownData.Impacts) {
    return <div>No valid gown data available</div>
  }

  const impactTypes = Object.keys(gownData.Impacts.total_impact)

  const transformedData = Object.entries(stackedData).map(([gownName, gownData]) => {
    const transformedGown: Record<string, string | number> = { name: gownName }
    stages.forEach((stage) => {
      impactTypes.forEach((impact) => {
        const key = `${stage}_${impact}`
        transformedGown[key] = gownData.Impacts.stages[stage]?.[impact] || 0
      })
    })
    return transformedGown
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {impactTypes.map((impact) => (
        <Card key={impact} className="w-full">
          <CardHeader>
            <CardTitle>{impact} Impact</CardTitle>
            <CardDescription>Impact breakdown by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={Object.fromEntries(
                stages.map((stage, index) => [
                  stage,
                  { label: stage, color: colors[index % colors.length] },
                ])
              )}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transformedData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  {stages.map((stage, index) => (
                    <Bar
                      key={stage}
                      dataKey={`${stage}_${impact}`}
                      stackId="a"
                      fill={colors[index % colors.length]}
                      name={stage}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}