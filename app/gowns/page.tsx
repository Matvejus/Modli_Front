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
import { InfoCircledIcon } from '@radix-ui/react-icons'

type Gown = {
  id: number
  name: string
  cost: number
  washes?: number
  reusable: boolean
}

export default function CircularProcurementTool() {
  const [reusableGowns, setReusableGowns] = useState<Gown[]>([])
  const [singleUseGowns, setSingleUseGowns] = useState<Gown[]>([])
  const [selectedGowns, setSelectedGowns] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [planningPeriod, setPlanningPeriod] = useState('3 months')
  const [gownsPerWeek, setGownsPerWeek] = useState('350')
  const [gownsPerDay, setGownsPerDay] = useState('50')
  const [laundryPickups, setLaundryPickups] = useState('2')
  const [daysUntilReturn, setDaysUntilReturn] = useState('2')
  const [healthcareLocation, setHealthcareLocation] = useState({
    city: 'Amsterdam',
    postcode: '1012 AB',
    street: 'Stationsplein'
  })
  const [laundryLocation, setLaundryLocation] = useState({
    city: 'Amsterdam',
    postcode: '1012 AB',
    street: 'Stationsplein'
  })
  const [reusablePercentage, setReusablePercentage] = useState(50)

  useEffect(() => {
    const fetchGowns = async () => {
      const response = await fetch('http://127.0.0.1:8000/emissions/gowns/')
      const data = await response.json()
      setReusableGowns(data.filter((gown: Gown) => gown.reusable))
      setSingleUseGowns(data.filter((gown: Gown) => !gown.reusable))
      setLoading(false)
    }

    fetchGowns()
  }, [])

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

  const handleOptimizePortfolio = () => {
    console.log('Optimizing portfolio')
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

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
          <Button variant="outline" className="w-full">
            <InfoCircledIcon className="mr-2 h-4 w-4" /> View variables and sources
          </Button>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planning period</label>
                  <Select onValueChange={setPlanningPeriod} defaultValue={planningPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select planning period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gowns per week</label>
                  <Input type="number" value={gownsPerWeek} onChange={(e) => setGownsPerWeek(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gowns per day</label>
                  <Input type="number" value={gownsPerDay} onChange={(e) => setGownsPerDay(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laundry pick-ups</label>
                  <Input type="number" value={laundryPickups} onChange={(e) => setLaundryPickups(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days until return</label>
                  <Input type="number" value={daysUntilReturn} onChange={(e) => setDaysUntilReturn(e.target.value)} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Healthcare Organization Location</h3>
                <div className="space-y-2">
                  <Input 
                    placeholder="City" 
                    value={healthcareLocation.city} 
                    onChange={(e) => setHealthcareLocation({...healthcareLocation, city: e.target.value})} 
                  />
                  <Input 
                    placeholder="Postcode" 
                    value={healthcareLocation.postcode} 
                    onChange={(e) => setHealthcareLocation({...healthcareLocation, postcode: e.target.value})} 
                  />
                  <Input 
                    placeholder="Street, house number" 
                    value={healthcareLocation.street} 
                    onChange={(e) => setHealthcareLocation({...healthcareLocation, street: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Laundry Location</h3>
                <div className="space-y-2">
                  <Input 
                    placeholder="City" 
                    value={laundryLocation.city} 
                    onChange={(e) => setLaundryLocation({...laundryLocation, city: e.target.value})} 
                  />
                  <Input 
                    placeholder="Postcode" 
                    value={laundryLocation.postcode} 
                    onChange={(e) => setLaundryLocation({...laundryLocation, postcode: e.target.value})} 
                  />
                  <Input 
                    placeholder="Street, house number" 
                    value={laundryLocation.street} 
                    onChange={(e) => setLaundryLocation({...laundryLocation, street: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reusable gowns in portfolio</label>
                <Slider
                  defaultValue={[reusablePercentage]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setReusablePercentage(value[0])}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{reusablePercentage}%</span>
                  <span>100%</span>
                </div>
              </div>
              <Button onClick={handleOptimizePortfolio} className="w-full">Optimize Portfolio</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}