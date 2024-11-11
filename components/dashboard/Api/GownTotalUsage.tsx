'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GownData {
  new_arrivals: { amount: number }[]
}

interface Results {
  [gownName: string]: GownData
}

interface GownTotalUsageProps {
  totalUsage: GownData
}

export default function GownTotalUsage({ totalUsage }: GownTotalUsageProps) {
  const calculateTotalUsage = (gownData: GownData) => {
    return gownData.new_arrivals.reduce((total, item) => total + item.amount, 0)
  }

  const gownTotals = Object.entries(totalUsage)
    .map(([gownName, gownData]) => ({
      name: gownName,
      total: calculateTotalUsage(gownData)
    }))
    .filter(gown => gown.total > 0)

  return (
    <div className="w-full max-w-7xl mx-auto py-3">
      <h2 className="text-2xl font-semibold mb-4">Gown Usage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gownTotals.map((gown) => (
          <Card key={gown.name} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">{gown.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center">{gown.total.toLocaleString()}</p>
              <p className="text-sm text-gray-500 text-center mt-2">Total Usage</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}