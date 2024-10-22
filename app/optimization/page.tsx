'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default async function OptimizationPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const startOptimization = async () => {
    setLoading(true)
    setError(null)

    const optimizationData = {
      "gowns": [
        {
          "name": "Cotton",
          "reusable": 0,
          "impacts": {
            "envpars": ["CO2EQ", "WATER", "ENERGY", "MONEY"],
            "stages": ["NEWARRIVALS", "LAUNDRY", "LOST", "EOL", "ARRIVALMOM"],
            "params": [
              [8, 3, 15, 0.7],
              [0, 0, 0, 0],
              [1, 1, 1, 0],
              [3, 0, -8, -0.08],
              [90, 0, 95, 9]
            ]
          }
        },
        {
          "name": "PET",
          "reusable": 1,
          "impacts": {
            "envpars": ["CO2EQ", "WATER", "ENERGY", "MONEY"],
            "stages": ["NEWARRIVALS", "LAUNDRY", "LOST", "EOL", "ARRIVALMOM"],
            "params": [
              [25, 80, 18, 18],
              [0.8, 0.9, 1.1, 0.35],
              [1, 1, 1, 0],
              [-8, -35, -9, -0.9],
              [95, 0, 98, 9.5]
            ]
          }
        },
        {
          "name": "Polyester",
          "reusable": 1,
          "impacts": {
            "envpars": ["CO2EQ", "WATER", "ENERGY", "MONEY"],
            "stages": ["NEWARRIVALS", "LAUNDRY", "LOST", "EOL", "ARRIVALMOM"],
            "params": [
              [35, 18, 28, 9],
              [0.9, 1.1, 0.6, 0.28],
              [1, 1, 1, 0],
              [3.5, 0, -9, -0.09],
              [98, 0, 97, 9.8]
            ]
          }
        },
        {
          "name": "Silk",
          "reusable": 1,
          "impacts": {
            "envpars": ["CO2EQ", "WATER", "ENERGY", "MONEY"],
            "stages": ["NEWARRIVALS", "LAUNDRY", "LOST", "EOL", "ARRIVALMOM"],
            "params": [
              [15, 8, 38, 7],
              [0.9, 1.1, 0.6, 0.28],
              [1, 1, 1, 0],
              [3.5, 0, -9, -0.09],
              [87, 0, 77, 400]
            ]
          }
        }
      ],
      "specifications": {
        "usage_per_week": 1000,
        "pickups_per_week": 2,
        "optimizer": ["ENERGY"],
        "loss_percentage": 0.001
      }
    }

    try {
      const response = await fetch('/api/start-optimization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optimizationData),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data.results)
      } else {
        setError(data.error || 'An error occurred during optimization')
      }
    } catch (error) {
      setError('An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  const prepareChartData = (results) => {
    const impactCategories = ['CO2EQ', 'WATER', 'ENERGY', 'MONEY']
    return impactCategories.map(category => {
      const dataPoint = { name: category }
      Object.entries(results.results).forEach(([gownName, gownData]) => {
        dataPoint[gownName] = Number(gownData.total_impact[category].toFixed(2))
      })
      return dataPoint
    })
  }

  const prepareUsageData = (results) => {
    const gownNames = Object.keys(results.results)
    const maxLength = Math.max(...gownNames.map(name => results.results[name].usage_values.length))
    
    return Array.from({ length: maxLength }, (_, index) => {
      const dataPoint = { week: index + 1 }
      gownNames.forEach(name => {
        dataPoint[name] = results.results[name].usage_values[index] || 0
      })
      return dataPoint
    })
  }

  const renderGownResults = (gownName, gownData) => {
    return (
      <Card key={gownName} className="mb-6">
        <CardHeader>
          <CardTitle>{gownName}</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">New Arrivals</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gownData.new_arrivals.map(([week, amount], index) => (
                <TableRow key={index}>
                  <TableCell>{week}</TableCell>
                  <TableCell>{amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  const renderClusteredBarChart = (chartData) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658']
    const gownNames = Object.keys(chartData[0]).filter(key => key !== 'name')

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Total Impact Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {gownNames.map((gown, index) => (
                  <Bar key={gown} dataKey={gown} fill={colors[index]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderUsageChart = (usageData) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658']
    const gownNames = Object.keys(usageData[0]).filter(key => key !== 'week')

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gown Usage Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                {gownNames.map((gown, index) => (
                  <Line 
                    key={gown} 
                    type="monotone" 
                    dataKey={gown} 
                    stroke={colors[index]} 
                    dot={false} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Optimization Results</h1>

      <Button
        onClick={startOptimization}
        className="mb-6"
        disabled={loading}
      >
        {loading ? 'Optimizing...' : 'Start Optimization'}
      </Button>

      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}

      {results && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          {renderClusteredBarChart(prepareChartData(results))}
          {renderUsageChart(prepareUsageData(results))}
        </div>
      )}
    </div>
  )
}