"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Fibers",
    total: Math.floor(Math.random() * 5000) + 1000,
    revenue: Math.floor(Math.random() * 4000) + 500, // Second dataset
  },
  {
    name: "Yarn",
    total: Math.floor(Math.random() * 5000) + 1000,
    revenue: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: "Fabric production",
    total: Math.floor(Math.random() * 5000) + 1000,
    revenue: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: "Finishing",
    total: Math.floor(Math.random() * 5000) + 1000,
    revenue: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: "Transport",
    total: Math.floor(Math.random() * 5000) + 1000,
    revenue: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: "Manufacturing",
    total: Math.floor(Math.random() * 5000) + 1000,
    revenue: Math.floor(Math.random() * 4000) + 500,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        {/* First dataset */}
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
        {/* Second dataset */}
        <Bar
          dataKey="revenue"
          fill="hsl(var(--chart-2))" // Different color for second dataset
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
