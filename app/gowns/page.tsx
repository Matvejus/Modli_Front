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
import GownList from '@/components/dashboard/Api/GownList'



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
              <Button onClick={handleCompareGowns} className="w-full mt-4">Compare Selected Gowns</Button>
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
              <Button onClick={handleOptimizePortfolio} className="w-full mt-4">Optimize Portfolio</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
}
