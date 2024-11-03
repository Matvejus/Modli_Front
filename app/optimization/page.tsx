'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Arrivals from '@/components/dashboard/Api/GownArrivals'
import ClusteredBarChart from '@/components/dashboard/Api/clustered-bar-impacts'
import UsageChart from '@/components/dashboard/Api/GownUsage'
import GownImpactsStacked from '@/components/dashboard/Api/stacked-bar-impacts'
import OptimizationSpecifications from '../../components/dashboard/Api/OptimizationSpecifications' // Import the new component



export default function OptimizationPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [specifications, setSpecifications] = useState({
    usage_per_week: 1000,
    pickups_per_week: 2,
    optimizer: ["WATER"], // Keep it as an array
    loss_percentage: 0.001
  })

  const handleSpecificationChange = (key, value) => {
    setSpecifications(prev => ({
      ...prev,
      [key]: key === 'loss_percentage' ? parseFloat(value) : parseInt(value, 10),
      optimizer: key === 'optimizer' ? [value] : prev.optimizer // Ensure optimizer is always an array with one value
    }))
  }

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
      ],
      "specifications": {
        "usage_per_week": specifications.usage_per_week,
        "pickups_per_week": specifications.pickups_per_week,
        "optimizer": specifications.optimizer,
        "loss_percentage": specifications.loss_percentage
      }
    }

    // Log the optimization data to the terminal
    console.log("Sending optimization data:", JSON.stringify(optimizationData, null, 2));

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
        // Correctly access the total_impact from the new structure
        dataPoint[gownName] = Number(gownData.Impacts.total_impact[category].toFixed(2))
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

  const prepareStackedData = (results) => {
    // Prepare the data structure for the stacked bar chart
    return Object.entries(results.results).reduce((acc, [gownName, gownData]) => {
      acc[gownName] = gownData.Impacts.stages; // Assuming stages are directly available in the gownData
      return acc;
    }, {});
  }

  const renderClusteredBarChart = (chartData) => {
    return <ClusteredBarChart chartData={chartData} />
  }
  const renderUsageChart = (usageData) => {
    return <UsageChart usageData={usageData} />
  }



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Optimization Results</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Optimization Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <OptimizationSpecifications 
            specifications={specifications} 
            handleSpecificationChange={handleSpecificationChange} 
          />
        </CardContent>
      </Card>

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
          <GownImpactsStacked stackedData={prepareStackedData(results)} />
        </div>
      )}
    </div>
  )
}
