'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'
import VariablesAndSourcesModal from '@/components/modals/variables_sources'
import OptimizationSpecifications from '@/components/dashboard/Api/OptimizationSpecifications'

type Gown = {
  id: number
  name: string
  cost: number
  washes?: number
  reusable: boolean
}

export default function GownsPage() {
  const [reusableGowns, setReusableGowns] = useState<Gown[]>([])
  const [singleUseGowns, setSingleUseGowns] = useState<Gown[]>([])
  const [selectedGowns, setSelectedGowns] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchGowns = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/emissions/gowns/');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setReusableGowns(data.filter((gown: Gown) => gown.reusable));
        setSingleUseGowns(data.filter((gown: Gown) => !gown.reusable));
      } catch (error) {
        // API is down or there's an error - provide mock data
        console.error("API error: ", error);
  
        const mockReusableGown: Gown = {
          id: 1,
          name: 'Reusable Mock Gown',
          cost: 25,
          washes: 50,
          reusable: true,
        };
        
        const mockSingleUseGown: Gown = {
          id: 2,
          name: 'Single-use Mock Gown',
          cost: 5,
          reusable: false,
        };
        
        setReusableGowns([mockReusableGown]);
        setSingleUseGowns([mockSingleUseGown]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchGowns();
  }, []);
  

  const handleGownSelection = (gownId: number) => {
    setSelectedGowns(prev => 
      prev.includes(gownId) 
        ? prev.filter(id => id !== gownId)
        : [...prev, gownId]
    )
  }

  const handleCompareGowns = () => {
     fetch ('http://localhost:3000/')
  }

  const router = useRouter()


  const handleOptimizePortfolio = async () => {
    try {
      const optimizationData = {
        gowns: [
          {
            name: "Cotton",
            reusable: 0,
            impacts: {
              envpars: ["CO2EQ", "WATER", "ENERGY", "MONEY"],
              stages: ["NEWARRIVALS", "LAUNDRY", "LOST", "EOL", "ARRIVALMOM"],
              params: [
                [8, 3, 15, 0.7],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [3, 0, -8, -0.08],
                [90, 0, 95, 9]
              ]
            }
          },
          // Add the other gown data here...
        ],
        specifications: {
          usage_per_week: parseInt(gownsPerWeek),
          pickups_per_week: parseInt(laundryPickups),
          optimizer: ["MONEY"],
          loss_percentage: parseInt(lostGowns)
        }
      };
  
      const response = await fetch('/api/optimize-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optimizationData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to start optimization');
      }
  
      const result = await response.json();
      console.log('Optimization started:', result);
  
      // Redirect to the results page with query params
      router.push({
        pathname: '/optimization-results',
        query: { data: JSON.stringify(result) },
      }, undefined, { shallow: true });
    } catch (error) {
      console.error('Error starting optimization:', error);
    }
  };

  if (loading) 
     return <div className="flex justify-center items-center h-screen">Loading...</div>
    // Switch on/off for api on vercel without django (make dummy 2) - host django



  return (
    <div className="container mx-auto p-4 max-w-4xl">
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

      <Tabs defaultValue="compare" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compare">Compare Gowns</TabsTrigger>
          <TabsTrigger value="optimize">Optimize Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="compare">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Reusable Gowns</h3>
                {reusableGowns.map((gown) => (
                  <div key={gown.id} className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <Checkbox
                        id={`gown-${gown.id}`}
                        checked={selectedGowns.includes(gown.id)}
                        onCheckedChange={() => handleGownSelection(gown.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`gown-${gown.id}`} className="text-sm">
                        {gown.name} - €{gown.cost} per p. - {gown.washes} washes
                      </label>
                    </div>
                    <Link href={`/gowns/${gown.id}`} className="text-blue-600 hover:underline text-sm">
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Single-use Gowns</h3>
                {singleUseGowns.map((gown) => (
                  <div key={gown.id} className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <Checkbox
                        id={`gown-${gown.id}`}
                        checked={selectedGowns.includes(gown.id)}
                        onCheckedChange={() => handleGownSelection(gown.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`gown-${gown.id}`} className="text-sm">
                        {gown.name} - €{gown.cost} per p.
                      </label>
                    </div>
                    <Link href={`/gowns/${gown.id}`} className="text-blue-600 hover:underline text-sm">
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
              <Button onClick={handleCompareGowns} className="w-full">Compare Selected Gowns</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="optimize">
          <Card>
            <CardContent className="pt-6 space-y-4">
                <OptimizationSpecifications 
                specifications={specifications} 
                handleSpecificationChange={handleSpecificationChange} 
              />
              <Button onClick={handleOptimizePortfolio} className="w-full">Optimize Portfolio</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
