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
    Cost: number
  }
}

interface EconomicImpactProps {
  gowns: Gown[]
}

const EconomicImpacts = ({ gowns }: EconomicImpactProps) => {
  const colors = ["#2C3E50", "#1ABC9C", "#F39C12", "#E74C3C"];
  
  const chartData = gowns.map(gown => ({
    name: gown.name,
    'Purchase costs': parseFloat(gown.emission_impacts.CO2.toFixed(2)),
    'Waste costs': parseFloat(gown.emission_impacts.Energy.toFixed(2)),
    'Residual Value': parseFloat(gown.emission_impacts.Water.toFixed(2)),
    'Laundry': parseFloat(gown.emission_impacts.Cost.toFixed(2)),
  }));

  const costCategories = ['Purchase costs', 'Waste costs', 'Residual Value', 'Laundry'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Economic Impact (1 gown use)</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                width={50}
                label={{ value: '€', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {costCategories.map((cost, index) => (
                <Bar key={cost} dataKey={cost} stackId="a" fill={colors[index % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default EconomicImpacts

