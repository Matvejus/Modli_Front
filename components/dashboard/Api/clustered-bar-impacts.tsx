import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string; // e.g., 'CO2EQ', 'WATER', etc.
  [gownName: string]: number | string; // Dynamic gown names as keys with numeric impact values
}


const ClusteredBarChart = ({ chartData }: {chartData: ChartData[]}) => {
  const colors = ["#2C3E50", "#2980B9", "#3498DB", "#1ABC9C", "#16A085", "#ECF0F1", "#BDC3C7"];
  
  // Filter out gowns with 0 impacts across all envpars
  const filteredChartData = chartData.filter(dataPoint => 
    Object.values(dataPoint).some(value => typeof value === 'number' && value > 0)
  );

  const gownNames = Object.keys(filteredChartData[0] || {}).filter(key => key !== 'name')

  return (
    <Card className="py-3">
      <CardHeader>
        <CardTitle>Total Impact Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {gownNames.map((gown, index) => (
                <Bar key={gown} dataKey={gown} fill={colors[index]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClusteredBarChart