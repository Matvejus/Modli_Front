"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string; // e.g., 'CO2EQ', 'WATER', etc.
  [gownName: string]: number | string; // Dynamic gown names as keys with numeric impact values
}

const ClusteredBarChart = ({ chartData }: { chartData: ChartData[] }) => {
  const colors = ["#2C3E50", "#2980B9", "#3498DB", "#1ABC9C", "#16A085", "#ECF0F1", "#BDC3C7"];
  
  // Filter out gowns with 0 impacts across all envpars
  const filteredChartData = chartData.filter(dataPoint => 
    Object.values(dataPoint).some(value => typeof value === 'number' && value > 0)
  );

  const gownNames = Object.keys(filteredChartData[0] || {}).filter(key => key !== 'name')

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Impact Comparison</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={filteredChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={0}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} width={60} />
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

export default ClusteredBarChart

