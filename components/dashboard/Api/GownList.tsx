'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import GownEmissionChart from './GownRadar'

interface Gown {
  id: string
  name: string
  cost: number
  washes?: number
  emission_impacts: {
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
    if (selectedGowns.length > 0) {
      fetch(`http://159.65.192.81/emissions/api/selected-gowns-emissions/?ids=${selectedGowns.join(',')}`)
        .then(response => response.json())
        .then(data => setSelectedGownData(data))
        .catch(error => console.error('Error fetching selected gowns data:', error))
    } else {
      setSelectedGownData([])
    }
  }, [selectedGowns])

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
    </div>
  )
}