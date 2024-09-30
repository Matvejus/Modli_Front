'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import * as SwitchPrimitive from '@radix-ui/react-switch'

type Gown = {
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
  const { id } = params

  useEffect(() => {
    if (id) {
      const fetchGownDetails = async () => {
        const gownRes = await fetch(`http://127.0.0.1:8000/emissions/gowns/${id}/`)
        const gownData = await gownRes.json()
        setGown(gownData)

        const emissionsRes = await fetch(`http://127.0.0.1:8000/emissions/gowns/${id}/emissions/`)
        const emissionsData = await emissionsRes.json()
        setEmissions(emissionsData)
        setLoading(false)
      }

      fetchGownDetails()
    }
  }, [id])

  if (loading || !gown) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">{gown.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Reusable</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm font-medium">{gown.reusable ? 'Yes' : 'No'}</span>
            <AnimatedSwitch checked={gown.reusable} onCheckedChange={() => {}} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="number" value={gown.cost.toFixed(2)} onChange={() => {}} prefix="$" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Washes</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="number" value={gown.washes} onChange={() => {}} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comfort</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="number" value={gown.comfort} onChange={() => {}} min={0} max={5} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hygiene</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="number" value={gown.hygine} onChange={() => {}} min={0} max={5} />
          </CardContent>
        </Card>
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
      </div>

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
              <TableHead className="whitespace-nowrap">Packaging</TableHead>
              <TableHead className="whitespace-nowrap">Transport</TableHead>
              <TableHead className="whitespace-nowrap">Use</TableHead>
              <TableHead className="whitespace-nowrap">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emissions.map((emission, index) => (
              <TableRow key={index}>
                <TableCell>{emission.emission_stage}</TableCell>
                <TableCell>{emission.fibers}</TableCell>
                <TableCell>{emission.yarn_production}</TableCell>
                <TableCell>{emission.fabric_production}</TableCell>
                <TableCell>{emission.finishing}</TableCell>
                <TableCell>{emission.manufacturing}</TableCell>
                <TableCell>{emission.packaging}</TableCell>
                <TableCell>{emission.transport}</TableCell>
                <TableCell>{emission.use}</TableCell>
                <TableCell>{emission.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}