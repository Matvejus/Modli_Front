import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Gown {
    id: string
    name: string
    hygine: number // Keep the typo if it's intentional
    comfort: number
    certificates: string[]
    emission_impacts: {
        CO2: number
        Energy: number
        Water: number
      }
  }


interface GownCertificatesTableProps {
  gowns: Gown[]
}

export default function GownCertificatesTable({ gowns }: GownCertificatesTableProps) {
  // Get all unique certificates
  const allCertificates = Array.from(new Set(gowns.flatMap(gown => gown.certificates)))

  return (
    <Card>
        <CardHeader>
            <CardTitle>Social Certifications</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Gown</TableHead>
                {allCertificates.map(cert => (
                    <TableHead key={cert}>{cert}</TableHead>
                ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {gowns.map((gown) => (
                <TableRow key={gown.id}>
                    <TableCell className="font-medium">{gown.name}</TableCell>
                    {allCertificates.map(cert => (
                    <TableCell key={`${gown.id}-${cert}`}>
                        {gown.certificates.includes(cert) ? (
                        <Check className="text-green-500" aria-label={`${gown.name} has ${cert} certificate`} />
                        ) : (
                        <X className="text-red-500" aria-label={`${gown.name} does not have ${cert} certificate`} />
                        )}
                    </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}