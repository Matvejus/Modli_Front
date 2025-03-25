import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, ShieldCheck, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gown } from '@/app/interfaces/Gown'
import { Certificate } from '@/app/interfaces/Certificate'

// Define an interface for the certificate object


interface GownCertificatesTableProps {
  gowns: Gown[]
}

export default function GownCertificatesTable({ gowns }: GownCertificatesTableProps) {
  // Get all unique certificate names
  const allCertificates = Array.from(
    new Set(
      gowns.flatMap(gown => 
        gown.certificates.map(cert => cert.name)
      )
    )
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle><ShieldCheck className="inline-block mr-2" />Social Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gown</TableHead>
              {allCertificates.map(certName => (
                <TableHead key={certName}>{certName}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {gowns.map((gown) => (
              <TableRow key={gown.id}>
                <TableCell className="font-medium">{gown.name}</TableCell>
                {allCertificates.map(certName => (
                  <TableCell key={`${gown.id}-${certName}`}>
                    {gown.certificates.some(cert => 
                      typeof cert === 'object' ? cert.name === certName : cert === certName
                    ) ? (
                      <Check className="text-green-500" aria-label={`${gown.name} has ${certName} certificate`} />
                    ) : (
                      <X className="text-red-500" aria-label={`${gown.name} does not have ${certName} certificate`} />
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