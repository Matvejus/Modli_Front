import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const UsageChart = ({ usageData }) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#4da6ff', '#e6d8c3', '#6b7280', '#3b82f6']
  const gownNames = Object.keys(usageData[0]).filter(key => key !== 'week')

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Gown Usage Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {gownNames.map((gown, index) => (
                <Line 
                  key={gown} 
                  type="monotone" 
                  dataKey={gown} 
                  stroke={colors[index]} 
                  dot={false} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default UsageChart