"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Single dataset with random values for desktop and mobile
const chartData = [
  {
    month: "January",
    desktop: getRandomValue(1000, 2000), // Random desktop value
    mobile: getRandomValue(500, 1000),   // Random mobile value
  }
]

const chartConfig = {
  desktop: {
    label: "Single-use",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Resuable",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function GaugeChartEnergy() {
  const totalVisitors = chartData[0].desktop + chartData[0].mobile

  return (
    <div className="flex items-center max-h-[100px]">
      <ChartContainer
        config={chartConfig}
        className="mx-auto flex my-auto aspect-square w-full max-w-[250px] "
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={80}
          outerRadius={130}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 16}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="fill-muted-foreground"
                      >
                        Energy MJ eq.
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="desktop"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-desktop)"
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="mobile"
            fill="var(--color-mobile)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}