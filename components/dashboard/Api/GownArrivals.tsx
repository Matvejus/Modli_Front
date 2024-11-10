import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface GownData {
  new_arrivals: [number, number][];
}


const Arrivals = ({ gownName, gownData }: { gownName: string; gownData: GownData }) => {
  return (
    <Card key={gownName} className="mb-6">
      <CardHeader>
        <CardTitle>{gownName}</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">New Arrivals</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gownData.new_arrivals.map(([week, amount], index) => (
              <TableRow key={index}>
                <TableCell>{week}</TableCell>
                <TableCell>{amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default Arrivals