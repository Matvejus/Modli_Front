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
// import GownTotalUsage from '@/components/dashboard/Api/GownTotalUsage'
import GownComparisonTable from '@/components/dashboard/Api/emissions_table'

// Define the Gown interface
interface Gown {
  gown: string;
  id: string; // Unique identifier for the gown
  name: string; // Name of the gown
  cost: number; // Cost of the gown
  reusable: boolean; // Indicates if the gown is reusable
  washes?: number; // Optional number of washes
  emission_impacts: {
    CO2: number; // CO2 emissions
    Energy: number; // Energy consumption
    Water: number; // Water usage
    Cost: number; // Cost impact
    production: number; // Production impact
    transportation: number; // Transportation impact
    washing: number; // Washing impact
    disposal: number; // Disposal impact
  };
}

interface GownData {
  name: string;
  Impacts: {
    total_impact: {
      [gown: string]: number;
    };
    stages: string;
    new_arrivals: [number, number][];
  };
  usage_values: number[];
  new_arrivals: { amount: number }[];
}

interface Results {
  results: {
    [name: string]: GownData;
  };
}

export default function GownsPage() {
  const [reusableGowns, setReusableGowns] = useState<Gown[]>([])
  const [singleUseGowns, setSingleUseGowns] = useState<Gown[]>([])
  const [selectedGowns, setSelectedGowns] = useState<string[]>([])
  const [selectedGownData, setSelectedGownData] = useState<Gown[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [specifications, setSpecifications] = useState({
    usage_per_week: 1000,
    pickups_per_week: 2,
    optimizer: ["WATER"],
    loss_percentage: 0.001
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

  const handleSpecificationChange = (key: keyof typeof specifications, value: string | number) => {
    setSpecifications(prev => ({
      ...prev,
      [key]: key === 'loss_percentage' ? parseFloat(value as string) : parseInt(value as string, 10),
      optimizer: key === 'optimizer' ? [value as string] : prev.optimizer
    }))
  }

const fetchGowns = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/emissions/gowns/`);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();

    // Map data to match the Gown structure and include emission_impacts directly
    const formattedData: Gown[] = data.map((gown: Gown) => ({
      ...gown,
      emission_impacts: gown.emission_impacts, // Keep the structure as-is
    }));

    setReusableGowns(formattedData.filter((gown) => gown.reusable));
    setSingleUseGowns(formattedData.filter((gown) => !gown.reusable));
  } catch (error) {
    console.error("API error: ", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchGowns()
  }, [])

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
      const emissionsResponse = await fetch(`${API_BASE_URL}/emissions/gown_emissions/`);
      if (!emissionsResponse.ok) throw new Error("Failed to fetch emissions data");
      const emissionsData = await emissionsResponse.json();
  
      // Filter only selected gowns and format for optimization
      const optimizationData = {
        gowns: selectedGowns.map(gownId => {
          const gownData = emissionsData.find((g: Gown) => g.gown === gownId);
  
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
        setResults({results: data.results});
      } else {
        setError(data.error || 'An error occurred during optimization');
      }
    } catch (error) {
      setError('An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (results: { [gownName: string]: GownData }) => {
    
    const impactCategories = ['CO2EQ', 'WATER', 'ENERGY', 'MONEY'];
  
    return impactCategories.map(category => {
      const dataPoint: { name: string; [key: string]: number | string } = { name: category };
      Object.entries(results.results).forEach(([gownName, gownData]) => {
        const impact = gownData.Impacts?.total_impact?.[category] ?? 0; // Use fallback of 0 if undefined
        dataPoint[gownName] = typeof impact === 'number' ? Number(impact.toFixed(2)) : 0;
      });
      return dataPoint;
    });
  };
  
  const prepareUsageData = (data: Results | { [gownNname: string]: GownData }) => {
    const isResults = (data: any): data is Results => 'results' in data;
  
    const gownData = isResults(data) ? data.results : data;
    const gownNames = Object.keys(gownData);
  
    const maxLength = Math.max(
      ...gownNames.map(name => gownData[name]?.usage_values?.length || 0)
    );
  
    return Array.from({ length: maxLength }, (_, index) => {
      const dataPoint: { week: number; [key: string]: number } = { week: index + 1 };
      gownNames.forEach(name => {
        dataPoint[name] = gownData[name]?.usage_values?.[index] || 0;
      });
      return dataPoint;
    });
  };
  
  const prepareStackedData = (results: Results) => {
    return Object.entries(results.results).reduce<{
      [key: string]: {
        Impacts: {
          stages: { [stage: string]: { [impact: string]: number } };
          total_impact: { [impact: string]: number };
        };
      };
    }>((acc, [gownName, gownData]) => {
      if (gownData.Impacts) {
        acc[gownName] = {
          Impacts: {
            stages: gownData.Impacts.stages,
            total_impact: gownData.Impacts.total_impact
          }
        };
      }
      return acc;
    }, {});
  };

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
            <CardTitle>Gowns</CardTitle>
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
            {selectedGownData.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Selected Gowns Comparison</h4>
                <GownComparisonTable gowns={selectedGownData} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <ClusteredBarChart chartData={prepareChartData(results.results)} />
        <GownImpactsStacked stackedData={prepareStackedData(results.results)} />
        <UsageChart usageData={prepareUsageData(results.results)} />
      </div>
        )}
    </div>
  )
}