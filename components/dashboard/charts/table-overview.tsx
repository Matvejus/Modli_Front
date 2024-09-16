import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" 
 
function generateRandomData(count: number) { 
  const categories = [ 
    "Fibers", "Yarn production", "Fabric production", "Finishing",  
    "Manufacturing", "Packaging", "Transport", "Use", "End of Life" 
  ] 
   
  return Array.from({ length: count }, (_, i) => ({ 
    category: categories[i % categories.length], 
    co2: Number((Math.random() * 5).toFixed(2)), 
    energy: Number((Math.random() * 50).toFixed(1)), 
    water: Number((Math.random() * 300).toFixed(1)), 
    land: Number((Math.random() * 3).toFixed(1)) 
  })) 
} 
 
export default function RandomDataTable() { 
  const data = generateRandomData(9) 
   
  // Calculate totals 
  const totals = data.reduce((acc, item) => ({ 
    co2: acc.co2 + item.co2, 
    energy: acc.energy + item.energy, 
    water: acc.water + item.water, 
    land: acc.land + item.land 
  }), { co2: 0, energy: 0, water: 0, land: 0 }) 
 
  // Add totals to the data 
  data.push({ 
    category: "Total", 
    co2: Number(totals.co2.toFixed(2)), 
    energy: Number(totals.energy.toFixed(1)), 
    water: Number(totals.water.toFixed(1)), 
    land: Number(totals.land.toFixed(1)) 
  }) 
 
  return ( 
    <Table> 
      <TableHeader> 
        <TableRow> 
          <TableHead className="w-[150px]">Stage</TableHead> 
          <TableHead>kg CO2</TableHead> 
          <TableHead>Energy MJ</TableHead> 
          <TableHead>Water L</TableHead> 
        </TableRow> 
      </TableHeader> 
      <TableBody> 
        {data.map((item, index) => ( 
          <TableRow key={index} className={item.category === "Total" ? "font-bold" : ""}> 
            <TableCell>{item.category}</TableCell> 
            <TableCell>{item.co2}</TableCell> 
            <TableCell>{item.energy}</TableCell> 
            <TableCell>{item.water}</TableCell> 
          </TableRow> 
        ))} 
      </TableBody> 
    </Table> 
  ) 
}