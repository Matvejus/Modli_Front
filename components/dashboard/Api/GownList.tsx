'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Gown } from '@/app/interfaces/Gown'

interface GownListProps {
  title: string | React.ReactNode
  gowns: Gown[]
  selectedGowns: string[]
  onGownSelection: (id: string) => void
}

export default function GownList({ title, gowns, selectedGowns, onGownSelection }: GownListProps) {
  const [_selectedGownData, setSelectedGownData] = useState<Gown[]>([])
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
  useEffect(() => {
    if (selectedGowns.length > 0) {
      fetch(`${API_BASE_URL}/emissions/api/selected-gowns-emissions/?ids=${selectedGowns.join(',')}`)
        .then(response => response.json())
        .then(data => setSelectedGownData(data))
        .catch(error => console.error('Error fetching selected gowns data:', error))
    } else {
      setSelectedGownData([])
    }
  }, [selectedGowns])

  return (
    <div className="mb-3">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {/* {selectedGownData.length > 0 && (
        <div>
          <h4>Selected Gowns:</h4>
          {selectedGownData.map(gown => (
            <div key={gown.id}>{gown.name}</div>
          ))}
        </div>
      )} */}
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
              {/* {gown.name} - €{gown.cost} per p.{gown.washes ? ` - ${gown.washes} washes` : ''} */}
              {gown.name}
            </label>
          </div>
          <button 
            onClick={() => window.location.href = `/gowns/${gown.id}`} 
            className="border border-black text-black-600 hover:bg-black hover:text-white text-sm px-2 py-1 rounded"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  )
}