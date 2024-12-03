import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Gown {
    id: string
    name: string
    hygine: number // Keep the typo if it's intentional
    comfort: number
    emission_impacts: {
        CO2: number
        Energy: number
        Water: number
      }
  }

interface GownHygineProps {
  gowns: Gown[]
}

export default function GownComparison({ gowns }: GownHygineProps) {
  const renderLikertScale = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {[0, 1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`w-5 h-5 ${
              value < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-500">{rating}/5</span>
      </div>
    )
  }

  return (
    <Card>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Gown Name</TableHead>
                <TableHead>Hygiene Rating</TableHead>
                <TableHead>Comfort Rating</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {gowns.map((gown) => (
                <TableRow key={gown.id}>
                    <TableCell className="font-medium">{gown.name}</TableCell>
                    <TableCell>
                    {renderLikertScale(gown.hygine)}
                    <span className="sr-only">{gown.hygine} out of 5 stars</span>
                    </TableCell>
                    <TableCell>
                    {renderLikertScale(gown.comfort)}
                    <span className="sr-only">{gown.comfort} out of 5 stars</span>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}