import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


export interface Gown {
  id: string; // Unique identifier for the gown
  name: string; // Name of the gown
  cost: number; // Cost of the gown
  washes?: number; // Optional number of washes
  emission_impacts: {
    CO2: number; // CO2 emissions
    Energy: number; // Energy consumption
    Water: number; // Water usage
    Cost: number; // Cost impact
    production: number; // Production impact
    transportation: number; // Transportation impact
    washing: number; // Washing impact
    disposal: number; // Disposal impact
  };
  reusable: boolean; // Indicates if the gown is reusable
}

const UsageChart = ({ usageData }: { usageData: Array<{ week: number; [key: string]: number }> }) => {
  const colors = ['#627aad', '#69a480', '#d1b45b', '#338ed1', '#d2c6b1', '#4b5563', '#2c6cdc'];

  const gownNames = usageData.length > 0 ? Object.keys(usageData[0]).filter(key => key !== 'week') : [];

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