// import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChartContainer } from "@/components/ui/chart";

// const colors = ["#2980B9", "#3498DB", "#1ABC9C", "#16A085", "#ECF0F1", "#BDC3C7", "#2C3E50"];

// // Define types for the data structure

// interface GownImpacts {
//   Impacts: {
//     [key: string]: number;
//   };
//   stages: string;
// }

// interface StackedData {
//   [gownName: string]: GownImpacts;
// }

// interface GownImpactsStackedProps {
//   stackedData: StackedData;
// }

// export default function GownImpactsStacked({ stackedData }: GownImpactsStackedProps) {
//   // Check if stackedData is available and has at least one gown
//   if (!stackedData || Object.keys(stackedData).length === 0) return <div>No data available</div>;

//   // Get the first gown data
//   const gownData = Object.values(stackedData)[0];

//   // Check if gownData and its properties exist
//   if (!gownData || !gownData.Impacts) {
//     return <div>No valid gown data available</div>;
//   }

//   // Derive impactTypes from the gownData
//   const impactTypes = Object.keys(gownData.Impacts);

//   // Parse stages from the string
//   const stages = gownData.stages;
//   console.log(stages)

//   // Flatten the data structure for chart compatibility
//   const transformedData = Object.entries(stackedData).map(([gownName, gownData]) => {
//     const transformedGown: Record<string, string | number> = { name: gownName };
//     impactTypes.forEach((impact) => {
//       transformedGown[impact] = gownData.Impacts[impact] || 0;
//     });
//     return transformedGown;
//   }).filter(gown => {
//     // Check if all impacts are zero
//     return impactTypes.some(impact => (gown[impact] as number) > 0);
//   });

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//       {impactTypes.map((impact) => (
//         <Card key={impact} className="w-full">
//           <CardHeader>
//             <CardTitle>{impact} Impact</CardTitle>
//             <CardDescription></CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ChartContainer
//               config={Object.fromEntries(
//                 stages.map((stage, index) => [
//                   stage,
//                   { label: stage, color: colors[index % colors.length] },
//                 ])
//               )}
//               className="flex justify-center h-[300px]"
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={transformedData}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar
//                     dataKey={impact}
//                     fill={colors[0]}
//                     name={impact}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </ChartContainer>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }