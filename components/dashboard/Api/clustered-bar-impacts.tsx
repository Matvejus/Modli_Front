import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const ClusteredBarChart = ({ chartData }) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#4da6ff', '#e6d8c3', '#6b7280', '#3b82f6']
  
  // Filter out gowns with 0 impacts across all envpars
  const filteredChartData = chartData.filter(dataPoint => 
    Object.values(dataPoint).some(value => value > 0)
  );

  const gownNames = Object.keys(filteredChartData[0] || {}).filter(key => key !== 'name')

  return (
    <Card className="mb-6">
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