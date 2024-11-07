import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const colors = ["#2980B9", "#3498DB", "#1ABC9C", "#16A085", "#ECF0g1", "#BDC3C7", "#2C3E50"];

export default function GownImpactsStacked({ stackedData }) {
  // Check if stackedData is available and has at least one gown
  if (!stackedData || Object.keys(stackedData).length === 0) return <div>No data available</div>;

  // Get the first gown data
  const gownData = Object.values(stackedData)[0];

  // Check if gownData and its properties exist
  if (!gownData || !gownData.Impacts || !gownData.Impacts.total_impact) {
    return <div>No valid gown data available</div>;
  }

  // Derive impactTypes and stages from the gownData
  const impactTypes = Object.keys(gownData.Impacts.total_impact);
  const stages = Object.keys(gownData.Impacts.stages);

  // Flatten the data structure for chart compatibility
  const transformedData = Object.entries(stackedData).map(([gownName, gownData]) => {
    const transformedGown = { name: gownName };
    stages.forEach((stage) => {
      impactTypes.forEach((impact) => {
        transformedGown[`${stage}_${impact}`] = gownData.Impacts.stages[stage]?.[impact] || 0;
      });
    });
    return transformedGown;
  }).filter(gown => {
    // Check if all impacts are zero
    return stages.some(stage => impactTypes.some(impact => gown[`${stage}_${impact}`] > 0));
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {impactTypes.map((impact) => (
        <Card key={impact} className="w-full">
          <CardHeader>
            <CardTitle>{impact} Impact</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={Object.fromEntries(
                stages.map((stage, index) => [
                  stage,
                  { label: stage, color: colors[index % colors.length] },
                ])
              )}
              className="flex justify-center"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transformedData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {stages.map((stage, index) => (
                    <Bar
                      key={stage}
                      dataKey={`${stage}_${impact}`}
                      stackId="a"
                      fill={colors[index % colors.length]}
                      name={stage}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
