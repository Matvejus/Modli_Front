// components/NetherlandsMap.tsx

"use client";

import { Chart } from "react-google-charts";

// Data for provinces in the Netherlands
const data = [
  ["Province", "Value"],
  ["North Holland", 500],
  ["South Holland", 700],
  ["Utrecht", 300],
  ["Gelderland", 400],
  ["North Brabant", 600],
  ["Limburg", 200],
  ["Friesland", 100],
  ["Overijssel", 450],
  ["Drenthe", 150],
  ["Flevoland", 250],
  ["Groningen", 350],
  ["Zeeland", 50],
];

// Options for customizing the map
const options = {
  region: "NL", // Netherlands region code
  displayMode: "regions",
  resolution: "provinces",
  colorAxis: {
    colors: ["#e5f5e0", "#31a354"], // Shades of green for the map
  },
  backgroundColor: "#f8f9fa", // Optional background color
  datalessRegionColor: "#f8f9fa", // Color for regions without data
};

export default function NetherlandsMap() {
  return (
    <div>
      <Chart
        chartType="GeoChart"
        width="100%"
        height="250px"
        data={data}
        options={options}
      />
    </div>
  );
}
