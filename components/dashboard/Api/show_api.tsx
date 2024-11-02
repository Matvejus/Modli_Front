import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  
  interface GownImpactTablesProps {
    results: {
      [key: string]: {
        Impacts: {
          stages: {
            [key: string]: {
              [key: string]: number
            }
          }
          total_impact: {
            [key: string]: number
          }
        }
      }
    }
  }
  
  export default function GownImpactTables({ results }: GownImpactTablesProps) {
    if (!results) return null
  
    const gowns = Object.keys(results)
    const impactTypes = Object.keys(results[gowns[0]].Impacts.ARRIVALMOM)
    const stages = Object.keys(results[gowns[0]].Impacts.stages)
  
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gowns.map((gown) => (
          <Card key={gown}>
            <CardHeader>
              <CardTitle>{gown} Impact Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stage / Impact</TableHead>
                    {impactTypes.map((impact) => (
                      <TableHead key={impact}>{impact}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stages.map((stage) => (
                    <TableRow key={stage}>
                      <TableCell className="font-medium">{stage}</TableCell>
                      {impactTypes.map((impact) => (
                        <TableCell key={`${stage}-${impact}`}>
                          {results[gown].Impacts.stages[stage][impact].toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">Total Impact</TableCell>
                    {impactTypes.map((impact) => (
                      <TableCell key={`total-${impact}`}>
                        {results[gown].Impacts.total_impact[impact].toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }