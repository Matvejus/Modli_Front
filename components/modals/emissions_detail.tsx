"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDownIcon } from 'lucide-react'
import { Gown } from '@/app/interfaces/Gown'

interface GownComparisonModalProps {
  gowns: Gown[]
}

const categories = ['CO2', 'Water', 'Energy'] as const
type Category = typeof categories[number]

export default function GownComparisonModal({ gowns }: GownComparisonModalProps) {
  const [isOpen, setIsOpen] = useState(false)
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
        {formatted} (
        <span className={percentageColor}>
          {percentageDifference > 0 ? `+${percentageFormatted}` : percentageFormatted}%
        </span>
        )
      </>
    )
  }

  const renderTable = (category: Category) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Gown Name</TableHead>
          <TableHead className="w-[200px]">
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGowns.map((gown) => (
          <TableRow key={gown.id}>
            <TableCell className="font-medium">{gown.name}</TableCell>
            <TableCell>
              <span className="text-sm">
                {formatValue(category, gown.emission_impacts[category], sortedGowns[0].emission_impacts[category])}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mx-3">
          <InfoCircledIcon className="mr-2 h-4 w-4" /> Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white text-black border-2 border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Detailed Gown Comparison</DialogTitle>
          <DialogDescription className="text-gray-600">
            Comparison of gowns based on CO2, Water, and Energy impacts.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="CO2" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="CO2">CO₂</TabsTrigger>
            <TabsTrigger value="Water">Water</TabsTrigger>
            <TabsTrigger value="Energy">Energy</TabsTrigger>
          </TabsList>
          <TabsContent value="CO2" className="mt-4">
            {renderTable('CO2')}
          </TabsContent>
          <TabsContent value="Water" className="mt-4">
            {renderTable('Water')}
          </TabsContent>
          <TabsContent value="Energy" className="mt-4">
            {renderTable('Energy')}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

