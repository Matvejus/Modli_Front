import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export interface EmissionBreakdown {
    reusableEmissions: number
    disposableEmissions: number
    totalEmissions: number
  }

export const EmissionDonutChart = ({
    breakdown,
    title,
    unit,
    color,
    icon: Icon,
  }: {
    breakdown: EmissionBreakdown
    title: string
    unit: string
    color: string
    icon: any
  }) => {
    const data = []
  
    if (breakdown.reusableEmissions > 0) {
      data.push({
        name: "Reusable Gowns",
        value: breakdown.reusableEmissions,
        color: "#10b981", // green
      })
    }
  
    if (breakdown.disposableEmissions > 0) {
      data.push({
        name: "Disposable Gowns",
        value: breakdown.disposableEmissions,
        color: "#f59e0b", // amber
      })
    }
  
    // If only one type, use the main color
    if (data.length === 1) {
      data[0].color = color
    }
  
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4`} style={{ color }} />
          <span className="text-sm font-medium">{title}</span>
        </div>
  
        <div className="relative h-32 w-32 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={data.length > 1 ? 2 : 0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
  
          {/* Center text showing total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold" style={{ color }}>
              {breakdown.totalEmissions.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">{unit}</div>
          </div>
        </div>
  
        {/* Legend */}
        {data.length > 1 && (
          <div className="space-y-1 text-xs">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground">
                  {entry.name}: {entry.value.toLocaleString()} {unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }