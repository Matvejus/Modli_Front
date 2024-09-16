"use client"

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#888456']

const generateRandomData = (categories: string[], datasetCount: number) => {
  return categories.map(category => ({
    name: category,
    ...Object.fromEntries(
      Array.from({ length: datasetCount }, (_, i) => [
        `Dataset ${i + 1}`,
        Math.floor(Math.random() * 100) + 1
      ])
    )
  }))
}

const CustomLegend = ({ categories }: { categories: string[] }) => (
  <ul className="flex flex-wrap justify-center gap-4 mt-4">
    {categories.map((category, index) => (
      <li key={`legend-${index}`} className="flex items-center">
        <span
          className="w-3 h-3 mr-2 inline-block"
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        ></span>
        <span>{category}</span>
      </li>
    ))}
  </ul>
)

export default function StackedDonutChart() {
  const categories = ["Fibers", "Yarn production", "Fabric production", "Finishing",  "Transport", "Manufacturing" ]
  const datasetCount = 2
  const data = generateRandomData(categories, datasetCount)

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {Array.from({ length: datasetCount }, (_, datasetIndex) => (
            <Pie
              key={`dataset-${datasetIndex}`}
              data={data}
              dataKey={`Dataset ${datasetIndex + 1}`}
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60 + datasetIndex * 40}
              outerRadius={90 + datasetIndex * 40}
              fill="#8884d8"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          ))}
          <Tooltip 
            formatter={(value, name, props) => [`${value} (${props.dataKey})`, name]}
          />
          {/* Passing categories instead of payload */}
          <Legend content={<CustomLegend categories={categories} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
