'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import GownList from '@/components/dashboard/Api/GownList'
import GownEmissionChart from '@/components/dashboard/Api/GownRadar'
import OptimizationSpecifications from '@/components/dashboard/Api/OptimizationSpecifications'
import ClusteredBarChart from '@/components/dashboard/Api/clustered-bar-impacts'
import UsageChart from '@/components/dashboard/Api/GownUsage'
import GownImpactsStacked from '@/components/dashboard/Api/stacked-bar-impacts'
import VariablesAndSourcesModal from '@/components/modals/variables_sources'
import GownTotalUsage from '@/components/dashboard/Api/GownTotalUsage'

interface Gown {
  id: string
  name: string
  cost: number
  washes?: number
  emission_impacts: {
    CO2: number
    Energy: number
    Water: number
    Cost: number
  }
}

export default function GownsPage() {
  const [reusableGowns, setReusableGowns] = useState<Gown[]>([])
  const [singleUseGowns, setSingleUseGowns] = useState<Gown[]>([])
  const [selectedGowns, setSelectedGowns] = useState<string[]>([])
  const [selectedGownData, setSelectedGownData] = useState<Gown[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [specifications, setSpecifications] = useState({
    usage_per_week: 1000,
    pickups_per_week: 2,
    optimizer: ["WATER"],
    loss_percentage: 0.001
  })

  const handleSpecificationChange = (key, value) => {
    setSpecifications(prev => ({
      ...prev,
      [key]: key === 'loss_percentage' ? parseFloat(value) : parseInt(value, 10),
      optimizer: key === 'optimizer' ? [value] : prev.optimizer
    }))
  }

  const fetchGowns = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/emissions/gowns/')
      if (!response.ok) throw new Error('Failed to fetch data')
      const data = await response.json()
      setReusableGowns(data.filter(gown => gown.reusable))
      setSingleUseGowns(data.filter(gown => !gown.reusable))
    } catch (error) {
      console.error("API error: ", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGowns()
  }, [])

  useEffect(() => {
    if (selectedGowns.length > 0) {
      fetch(`http://127.0.0.1:8000/emissions/api/selected-gowns-emissions/?ids=${selectedGowns.join(',')}`)
        .then(response => response.json())
        .then(data => setSelectedGownData(data))
        .catch(error => console.error('Error fetching selected gowns data:', error))
    } else {
      setSelectedGownData([])
    }
  }, [selectedGowns])

  const handleGownSelection = (gownId: string) => {
    setSelectedGowns(prev => 
      prev.includes(gownId) ? prev.filter(id => id !== gownId) : [...prev, gownId]
    )
  }

  const startOptimization = async () => {
    setLoading(true);
    setError(null);
  
    // Fetch emissions data for selected gowns
    try {
      const emissionsResponse = await fetch(`http://127.0.0.1:8000/emissions/gown_emissions/`);
      if (!emissionsResponse.ok) throw new Error("Failed to fetch emissions data");
      const emissionsData = await emissionsResponse.json();
  
      // Filter only selected gowns and format for optimization
      const optimizationData = {
        gowns: selectedGowns.map(gownId => {
          const gownData = emissionsData.find(g => g.gown === gownId);
  
          return {
            name: gownData.name,
            reusable: gownData.reusable ? 1 : 0,
            impacts: {
              envpars: ["CO2EQ", "WATER", "ENERGY", "MONEY"],
              stages: ["NEWARRIVALS", "LAUNDRY", "LOST", "EOL", "ARRIVALMOM"],
              params: [
                [gownData.emissions.CO2, gownData.emissions.Water, gownData.emissions.Energy, gownData.emissions.Cost],  // NEWARRIVALS
                gownData.reusable ? [1, 1, 0.5, 0.3] : [0, 0, 0, 0],  // LAUNDRY, depends on reusability
                [1, 1, 1, 0],  // Static LOST
                [4, 0, -10, -0.1],  // Static EOL
                [100, 0, 100, 10]  // Static ARRIVALMOM
              ]
            }
          };
        }),
        specifications: {
          usage_per_week: specifications.usage_per_week,
          pickups_per_week: specifications.pickups_per_week,
          optimizer: specifications.optimizer,
          loss_percentage: specifications.loss_percentage
        }
      };
  
      // Start the optimization with the structured data
      const response = await fetch('/api/start-optimization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optimizationData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setResults(data.results);
      } else {
        setError(data.error || 'An error occurred during optimization');
      }
    } catch (error) {
      setError('An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (results) => {
    const impactCategories = ['CO2EQ', 'WATER', 'ENERGY', 'MONEY']
    return impactCategories.map(category => {
      const dataPoint = { name: category }
      Object.entries(results.results).forEach(([gownName, gownData]) => {
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
    return Object.entries(results.results).reduce((acc, [gownName, gownData]) => {
      acc[gownName] = {
        Impacts: gownData.Impacts,
        stages: gownData.Impacts.stages
      };
      return acc;
    }, {});
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Circular Procurement Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            Compare the economic, social, and environmental impact of different isolation gowns.
          </p>
          <VariablesAndSourcesModal />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Gowns List</CardTitle>
          </CardHeader>
          <CardContent>
            <GownList 
              title="Reusable Gowns"
              gowns={reusableGowns} 
              selectedGowns={selectedGowns} 
              onGownSelection={handleGownSelection} 
            />
            <GownList 
              title="Single-use Gowns"
              gowns={singleUseGowns} 
              selectedGowns={selectedGowns} 
              onGownSelection={handleGownSelection} 
            />
            {selectedGownData.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Selected Gowns Comparison</h4>
                <GownEmissionChart gowns={selectedGownData} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <OptimizationSpecifications 
              specifications={specifications} 
              handleSpecificationChange={handleSpecificationChange} 
            />
            <Button
              onClick={startOptimization}
              className="mb-6"
              disabled={loading}
            >
              {loading ? 'Optimizing...' : 'Start Optimization'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <GownTotalUsage results={results.results} />
          <ClusteredBarChart chartData={prepareChartData(results)} />
          <GownImpactsStacked stackedData={prepareStackedData(results)} />
          <UsageChart usageData={prepareUsageData(results)} />
        </div>
      )}
    </div>
  )
}