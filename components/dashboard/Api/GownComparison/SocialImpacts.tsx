"use client"

import { Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Gown } from '@/app/interfaces/Gown'

interface SocialImpactProps {
  gowns: Gown[]
}

const SocialImpacts = ({ gowns }: SocialImpactProps) => {
  const colors = ["#2C3E50", "#1ABC9C", "#F39C12"];
  
  const chartData = [
    { name: 'Local FTE', ...gowns.reduce((acc, gown) => ({ ...acc, [gown.name]: gown.fte_local.toFixed(2) }), {}) },
    { name: 'Extra FTE', ...gowns.reduce((acc, gown) => ({ ...acc, [gown.name]: gown.fte_local_extra.toFixed(2) }), {}) },
  ];

  const gownNames = gowns.map(gown => gown.name);

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
          {payload.value}
        </text>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <foreignObject x="-12" y="20" width="24" height="24">
                <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <span className="sr-only">More information</span>
                  <Info className="h-4 w-4" />
                </button>
              </foreignObject>
            </TooltipTrigger>
            <TooltipContent>
              <p>{payload.value === 'Local FTE' ? 'Local societal benefits, measured in the creation of hours of paid work.' : 'Societal benefits in paid working hours for people with a distance to the labor market.'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </g>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Social Impact (1 gown use)</CardTitle>
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
                tick={<CustomXAxisTick />}
                interval={0}
                angle={0}
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                width={50}
                label={{ value: 'Hours ', angle: -90, position: 'insideLeft' }}
              />
              <RechartsTooltip />
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

export default SocialImpacts

