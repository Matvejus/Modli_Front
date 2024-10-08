"use client"

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from "recharts"

const data = [
  { name: "Manufactoring", dataset1: Math.floor(Math.random() * 100), dataset2: Math.floor(Math.random() * 100) },
  { name: "Spinning", dataset1: Math.floor(Math.random() * 100), dataset2: Math.floor(Math.random() * 100) },
  { name: "Finishing", dataset1: Math.floor(Math.random() * 100), dataset2: Math.floor(Math.random() * 100) },
  { name: "Transport", dataset1: Math.floor(Math.random() * 100), dataset2: Math.floor(Math.random() * 100) },
  { name: "Use", dataset1: Math.floor(Math.random() * 100), dataset2: Math.floor(Math.random() * 100) },
]

export function OverviewRadar() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart outerRadius={150} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        {/* <PolarRadiusAxis angle={90} domain={[0, 100]} /> */}
        <Radar
          name="Single-use"
          dataKey="dataset1"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
        <Radar
          name="Reusable"
          dataKey="dataset2"
          stroke="hsl(var(--chart-2))"
          fill="hsl(var(--chart-2))"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}