"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon } from 'lucide-react'
import GownComparisonModal from '@/components/modals/emissions_detail'

interface Gown {
  id: string
  name: string
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

const categories = ['CO2', 'Energy', 'Water'] as const
type Category = typeof categories[number]

export default function GownComparisonTable({ gowns }: GownComparisonTableProps) {
  const [sortBy, setSortBy] = useState<Category | null>(null)

  const handleSort = (category: Category) => {
    setSortBy(sortBy === category ? null : category)
  }

  const sortedGowns = [...gowns].sort((a, b) => {
    if (sortBy) {
      return a.emission_impacts[sortBy] - b.emission_impacts[sortBy]
    }
    return 0
  })

  const formatValue = (category: Category, value: number, lowestValue: number) => {
    const formatted = (() => {
      switch (category) {
        case 'CO2':
          return `${value.toFixed(2)} kg eqv.`
        case 'Energy':
          return `${value.toFixed(2)} MJ`
        case 'Water':
          return `${value.toFixed(2)} L`
        default:
          return value.toFixed(2)
      }
    })()

    if (value === lowestValue) return formatted

    const percentageDifference = ((value - lowestValue) / lowestValue) * 100
    const percentageFormatted = percentageDifference.toFixed(0)
    const percentageColor = percentageDifference > 0 ? 'text-red-500' : 'text-green-500'

    return (
      <>
        {formatted} 
        {/* (
        <span className={percentageColor}>
          {percentageDifference > 0 ? `+${percentageFormatted}` : percentageFormatted}%
        </span>
        ) */}
      </>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gown Comparison per 1 use</span>
          <GownComparisonModal gowns={gowns} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Gown Name</TableHead>
                {categories.map(category => (
                  <TableHead key={category} className="w-[200px]">
                    <div className="flex items-center justify-between">
                      <span>{category === 'CO2' ? 'CO₂' : category}</span>
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
              {sortedGowns.map((gown, index) => (
                <TableRow key={gown.id}>
                  <TableCell className="font-medium">{gown.name}</TableCell>
                  {categories.map(category => {
                    const lowestValue = sortedGowns[0].emission_impacts[category]
                    return (
                      <TableCell key={category}>
                        <span className="text-sm">
                          {formatValue(category, gown.emission_impacts[category], lowestValue)}
                        </span>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

