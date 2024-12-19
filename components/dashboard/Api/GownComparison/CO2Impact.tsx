"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Gown {
  id: string
  name: string
  emission_impacts: {
    CO2: number
    Energy: number
    Water: number
  }
}

interface CO2ImpactsProps {
  gowns: Gown[]
}

const CO2Impacts = ({ gowns }: CO2ImpactsProps) => {
  const colors = ["#2C3E50", "#1ABC9C", "#F39C12"];
  
  const chartData = [
    { name: 'CO2 (kg CO2-eq)', ...gowns.reduce((acc, gown) => ({ ...acc, [gown.name]: gown.emission_impacts.CO2.toFixed(2) }), {}) },
    // { name: 'Energy (MJ-eq)', ...gowns.reduce((acc, gown) => ({ ...acc, [gown.name]: gown.emission_impacts.Energy.toFixed(2) }), {}) },
    // { name: 'Water (L)', ...gowns.reduce((acc, gown) => ({ ...acc, [gown.name]: gown.emission_impacts.Water.toFixed(2) }), {}) },
  ];

  const gownNames = gowns.map(gown => gown.name);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CO₂ Impact</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={0}
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                width={50}
                label={{ value: 'KG CO2 eq.', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {gownNames.map((gown, index) => (
                <Bar key={gown} dataKey={gown} fill={colors[index % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default CO2Impacts