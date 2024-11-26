'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { useRouter } from 'next/navigation'
import EmissionsInfoModal from '@/components/modals/gown_detail'
import { LikertScale } from '@/components/dashboard/Api/LikertScale'

type Gown = {
  id: string
  name: string
  reusable: boolean
  cost: number
  washes: number
  comfort: number
  hygine: number
  certificates: string[]
}

type Emission = {
  emission_stage: string
  fibers: number
  yarn_production: number
  fabric_production: number
  finishing: number
  manufacturing: number
  packaging: number
  transport: number
  use: number
  total: number
}

interface GownDetailProps {
  params: {
    id: string
  }
}

const AnimatedSwitch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <SwitchPrimitive.Root
    checked={checked}
    onCheckedChange={onCheckedChange}
    className="w-[42px] h-[25px] bg-gray-200 rounded-full relative shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ease-in-out data-[state=checked]:bg-blue-500"
  >
    <SwitchPrimitive.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
  </SwitchPrimitive.Root>
)

export default function GownDetail({ params }: GownDetailProps) {
  const [gown, setGown] = useState<Gown | null>(null)
  const [emissions, setEmissions] = useState<Emission[]>([])
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const { id } = params
  const router = useRouter()
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

  const fetchGownDetails = useCallback(async () => {
    try {
      const gownRes = await fetch(`${API_BASE_URL}/emissions/gowns/${id}/`)
      if (!gownRes.ok) throw new Error('Failed to fetch gown details')
      const gownData = await gownRes.json()
      setGown(gownData)

      const emissionsRes = await fetch(`${API_BASE_URL}/emissions/gowns/${id}/emissions/`)
      if (!emissionsRes.ok) throw new Error('Failed to fetch emissions data')
      const emissionsData = await emissionsRes.json()
      setEmissions(emissionsData)
    } catch (error) {
      console.error("API error: ", error)
    } finally {
      setLoading(false)
    }
  }, [id, API_BASE_URL])

  useEffect(() => {
    if (id) {
      fetchGownDetails()
    }
  }, [id, fetchGownDetails])

  const handleInputChange = (field: keyof Gown, value: string | number | boolean) => {
    if (gown) {
      setGown({ ...gown, [field]: value })
      setHasChanges(true)
    }
  }

  const handleSave = async () => {
    if (!gown) return

    try {
      const response = await fetch(`${API_BASE_URL}/emissions/gowns/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gown),
      })

      if (!response.ok) {
        throw new Error('Failed to save gown details')
      }

      alert('Gown details saved successfully!')
      router.push('/gowns')
    } catch (error) {
      console.error('Error saving gown details:', error)
      alert('Failed to save gown details. Please try again.')
    }
  }

  if (loading || !gown) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{gown.name}</h1>
        <EmissionsInfoModal />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {/* <Card>
          <CardHeader>
            <CardTitle>Reusable</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm font-medium">{gown.reusable ? 'Yes' : 'No'}</span>
            <AnimatedSwitch checked={gown.reusable} onCheckedChange={(checked) => handleInputChange('reusable', checked)} />
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader>
            <CardTitle>Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              type="number" 
              value={gown.cost.toFixed(2)} 
              onChange={(e) => handleInputChange('cost', parseFloat(e.target.value))} 
              prefix="$" 
            />
          </CardContent>
        </Card>
        {gown.reusable && (
          <Card>
            <CardHeader>
              <CardTitle>Washes</CardTitle>
            </CardHeader>
            <CardContent>
              <Input 
                type="number" 
                value={gown.washes} 
                onChange={(e) => handleInputChange('washes', parseInt(e.target.value))} 
              />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {gown.certificates.map((certificate, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm font-medium text-left">
                      {certificate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comfort</CardTitle>
          </CardHeader>
          <CardContent>
            <LikertScale
              value={gown.comfort}
              onChange={(value) => handleInputChange('comfort', value)}
              name="comfort"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hygiene</CardTitle>
          </CardHeader>
          <CardContent>
            <LikertScale
              value={gown.hygine}
              onChange={(value) => handleInputChange('hygine', value)}
              name="hygiene"
            />
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={hasChanges ? handleSave : () => router.push('/gowns')} 
        className="mb-6"
      >
        {hasChanges ? 'Save Changes' : 'Back'}
      </Button>

      <h2 className="text-2xl font-semibold mb-4">Emissions</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Stage</TableHead>
              <TableHead className="whitespace-nowrap">Fibers</TableHead>
              <TableHead className="whitespace-nowrap">Yarn Production</TableHead>
              <TableHead className="whitespace-nowrap">Fabric Production</TableHead>
              <TableHead className="whitespace-nowrap">Finishing</TableHead>
              <TableHead className="whitespace-nowrap">Manufacturing</TableHead>
              <TableHead className="whitespace-nowrap">Transport</TableHead>
              <TableHead className="whitespace-nowrap">Use</TableHead>
              <TableHead className="whitespace-nowrap">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emissions.map((emission, index) => (
              <TableRow key={index}>
                <TableCell>{emission.emission_stage} KG</TableCell>
                <TableCell>{emission.fibers.toFixed(2)}</TableCell>
                <TableCell>{emission.yarn_production.toFixed(2)}</TableCell>
                <TableCell>{emission.fabric_production.toFixed(2)}</TableCell>
                <TableCell>{emission.finishing.toFixed(2)}</TableCell>
                <TableCell>{emission.manufacturing.toFixed(2)}</TableCell>
                <TableCell>{emission.transport.toFixed(2)}</TableCell>
                <TableCell>{emission.use.toFixed(2)}</TableCell>
                <TableCell>{emission.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

