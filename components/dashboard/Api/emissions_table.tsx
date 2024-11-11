'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon } from "lucide-react"

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
  const [sortBy, setSortBy] = useState<keyof Gown['emission_impacts'] | null>(null)
  const categories: (keyof Gown['emission_impacts'])[] = ['CO2', 'Energy', 'Water', 'Cost']

  const maxValues = {
    CO2: Math.max(...gowns.map(gown => gown.emission_impacts.CO2)),
    Energy: Math.max(...gowns.map(gown => gown.emission_impacts.Energy)),
    Water: Math.max(...gowns.map(gown => gown.emission_impacts.Water)),
    Cost: Math.max(...gowns.map(gown => gown.emission_impacts.Cost)),
  }

  const sortedGowns = [...gowns].sort((a, b) => {
    if (sortBy) {
      return b.emission_impacts[sortBy] - a.emission_impacts[sortBy]
    }
    return 0
  })

  const normalizedData = sortedGowns.map(gown => ({
    ...gown,
    normalizedImpacts: Object.fromEntries(
      categories.map(category => [
        category,
        (gown.emission_impacts[category] / maxValues[category]) * 100
      ])
    )
  }))

  const handleSort = (category: keyof Gown['emission_impacts']) => {
    setSortBy(category)
  }

  const getBarColor = (percentage: number) => {
    const intensity = Math.round(255 * (1 - percentage / 100))
    return `rgb(${intensity}, ${intensity}, ${intensity})`
  }

  const formatValue = (category: keyof Gown['emission_impacts'], value: number) => {
    switch (category) {
      case 'CO2':
        return `${value.toFixed(2)} kg eqv.`
      case 'Energy':
        return `${value.toFixed(2)} MJ`
      case 'Water':
        return `${value.toFixed(2)} L`
      case 'Cost':
        return `€${value.toFixed(2)}`
      default:
        return value.toFixed(2)
    }
  }

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
                  <TableHead key={category} className="w-1/5 sticky top-0 bg-background z-10">
                    <div className="flex items-center justify-between">
                      {category === 'CO2' ? 'CO₂' : category}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(category)}
                        className={sortBy === category ? 'text-primary' : ''}
                      >
                        <ArrowDownIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
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
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${gown.normalizedImpacts[category]}%`,
                              backgroundColor: getBarColor(gown.normalizedImpacts[category])
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          {formatValue(category, gown.emission_impacts[category])}
                        </span>
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