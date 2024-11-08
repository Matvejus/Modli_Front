'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Gown {
  id: string
  name: string
  cost: number
  washes?: number
  emission_impacts: {
    CO2: number
    Energy: number
    Water: number
    Cost: number
  }
}

interface GownComparisonTableProps {
  gowns: Gown[]
}

export default function GownComparisonTable({ gowns }: GownComparisonTableProps) {
  const categories = ['CO2', 'Energy', 'Water', 'Cost']

  const maxValues = {
    CO2: Math.max(...gowns.map(gown => gown.emission_impacts.CO2)),
    Energy: Math.max(...gowns.map(gown => gown.emission_impacts.Energy)),
    Water: Math.max(...gowns.map(gown => gown.emission_impacts.Water)),
    Cost: Math.max(...gowns.map(gown => gown.emission_impacts.Cost)),
  }

  const normalizedData = gowns.map(gown => ({
    ...gown,
    normalizedImpacts: Object.fromEntries(
      categories.map(category => [
        category,
        (gown.emission_impacts[category as keyof typeof gown.emission_impacts] / maxValues[category as keyof typeof maxValues]) * 100
      ])
    )
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gown Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] flex flex-col">
        <div className="overflow-y-auto flex-grow">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5 sticky top-0 bg-background z-10">Gown</TableHead>
                {categories.map(category => (
                  <TableHead key={category} className="w-1/5 sticky top-0 bg-background z-10">{category}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {normalizedData.map(gown => (
                <TableRow key={gown.id}>
                  <TableCell className="font-medium">{gown.name}</TableCell>
                  {categories.map(category => (
                    <TableCell key={category} className="p-2">
                      <div className="flex flex-col items-start">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${gown.normalizedImpacts[category]}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{gown.normalizedImpacts[category].toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}