'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import GownEmissionChart from './gown-emission-chart'

interface Gown {
  id: string
  name: string
  cost: number
  washes?: number
  emissionImpacts: {
    production: number
    transportation: number
    washing: number
    disposal: number
  }
}

interface GownListProps {
  title: string
  gowns: Gown[]
  selectedGowns: string[]
  onGownSelection: (id: string) => void
}

export default function GownList({ title, gowns, selectedGowns, onGownSelection }: GownListProps) {
  const [selectedGownData, setSelectedGownData] = useState<Gown[]>([])

  useEffect(() => {
    if (gowns) {
      setSelectedGownData(gowns.filter(gown => selectedGowns.includes(gown.id)))
    }
  }, [selectedGowns, gowns])

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {gowns && gowns.map((gown) => (
        <div key={gown.id} className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
          <div className="flex items-center">
            <Checkbox
              id={`gown-${gown.id}`}
              checked={selectedGowns.includes(gown.id)}
              onCheckedChange={() => onGownSelection(gown.id)}
              aria-labelledby={`gown-label-${gown.id}`}
              className="mr-2"
            />
            <label id={`gown-label-${gown.id}`} htmlFor={`gown-${gown.id}`} className="text-sm">
              {gown.name} - €{gown.cost} per p.{gown.washes ? ` - ${gown.washes} washes` : ''}
            </label>
          </div>
          <Link href={`/gowns/${gown.id}`} className="text-blue-600 hover:underline text-sm">
            Edit
          </Link>
        </div>
      ))}
      {selectedGownData.length > 0 && (
  <div className="mt-6">
    <h4 className="text-md font-semibold mb-2">Selected Gowns Comparison</h4>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Cost (€)</TableHead>
          <TableHead>Washes</TableHead>
          <TableHead>Cost per Wash (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedGownData.map((gown) => (
          <TableRow key={gown.id}>
            <TableCell>{gown.name}</TableCell>
            <TableCell>{gown.cost.toFixed(2)}</TableCell>
            <TableCell>{gown.washes || 'N/A'}</TableCell>
            <TableCell>
              {gown.washes ? (gown.cost / gown.washes).toFixed(2) : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}
    </div>
  )
}