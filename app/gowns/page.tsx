"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import GownList from "@/components/dashboard/Api/GownList"
// import OptimizationSpecifications from '@/components/dashboard/Api/OptimizationSpecifications'
// import ClusteredBarChart from '@/components/dashboard/Api/clustered-bar-impacts'
// import UsageChart from '@/components/dashboard/Api/GownUsage'
// import GownImpactsStacked from '@/components/dashboard/Api/stacked-bar-impacts'
import VariablesAndSourcesModal from "@/components/modals/variables_sources"
// import GownTotalUsage from '@/components/dashboard/Api/GownTotalUsage'
import GownComparisonTable from "@/components/dashboard/Api/GownComparison/EmissionsTable"
import EconomicImpacts from "@/components/dashboard/Api/GownComparison/EconomicImpacts"
import GownHygieneComparison from "@/components/dashboard/Api/GownComparison/HygineComparison"
import GownCertificatesTable from "@/components/dashboard/Api/GownComparison/CertificatesTable"
import EnergyImpacts from "@/components/dashboard/Api/GownComparison/EnergyImpact"
import WaterImpacts from "@/components/dashboard/Api/GownComparison/WaterImpact"
import CO2Impacts from "@/components/dashboard/Api/GownComparison/CO2Impact"
import type { Gown } from "../interfaces/Gown"
import { Recycle, Trash2, LineChart } from "lucide-react"
import GownInvestmentCalculator from "@/components/dashboard/Api/GownComparison/InvestmentCalculator"
import XLSXdownload from "@/components/dashboard/Api/GownComparison/XLSXdownload"

export default function GownsPage() {
  const [reusableGowns, setReusableGowns] = useState<Gown[]>([])
  const [singleUseGowns, setSingleUseGowns] = useState<Gown[]>([])
  const [selectedGowns, setSelectedGowns] = useState<string[]>([])
  const [selectedGownData, setSelectedGownData] = useState<Gown[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchGowns = async () => {
    try {
      const response = await fetch(`api/emissions/gown-list/`, {
        credentials: "include", // Add this line
      })
      if (!response.ok) throw new Error("Failed to fetch data")
      const data = await response.json()

      // Map data to match the Gown structure and include emission_impacts directly
      const formattedData: Gown[] = data.map((gown: Gown) => ({
        ...gown,
        emission_impacts: gown.emission_impacts,
      }))

      setReusableGowns(formattedData.filter((gown) => gown.reusable && gown.visible))
      setSingleUseGowns(formattedData.filter((gown) => !gown.reusable && gown.visible))
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
      fetch(`/api/emissions/selected-gowns-emissions?ids=${selectedGowns.join(",")}`, {
        credentials: "include", // Ensure cookies are sent
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch selected gowns: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => setSelectedGownData(data))
        .catch((error) => console.error("Error fetching selected gowns data:", error))
    } else {
      setSelectedGownData([])
    }
  }, [selectedGowns])
  console.log(selectedGowns)

  const handleGownSelection = (gownId: string) => {
    setSelectedGowns((prev) => {
      if (prev.includes(gownId)) {
        // If the gown is already selected, remove it
        return prev.filter((id) => id !== gownId)
      } else if (prev.length < 3) {
        // Add the gown only if the total selected is less than 3
        return [...prev, gownId]
      } else {
        // If 3 gowns are already selected, prevent adding more
        alert("You can only select up to 3 gowns.")
        return prev
      }
    })
  }

  return (
    <div className="container mx-auto pt-16 p-4 max-w-7xl relative z-20">
      <Card className="mb-3 relative z-30 border-none bg-white shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mt-2 mb-2">
            <div className="rounded-full bg-green-100 p-2">
              <LineChart className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold">Isolation Gown Comparison</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="ml-16 flex gap-4 items-start">
              <div>
                <p className="font-medium">
                  You can compare up to three isolation gowns from the list. Please follow the steps below:
                </p>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg mb-4">
              <div className="flex flex-col space-y-8">
                {" "}
                {/* Changed from gap-6 to space-y-8 for more vertical spacing */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border bg-[#F99177] text-white flex items-center justify-center font-bold hover:bg-black hover:text-white transition-colors">
                    1
                  </div>
                  <div>
                    <p className="font-medium">
                      For each gown you wish to compare, click <strong>Edit</strong> to enter the required information,
                      then make sure to click <strong>Save Changes</strong>.
                    </p>
                    <p className="text-sm text-muted-foreground">The displayed default values can be overwritten</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border bg-[#F99177] text-white flex items-center justify-center font-bold hover:bg-black hover:text-white transition-colors">
                    2
                  </div>
                  <div>
                    <p className="font-medium">
                      <strong>Tick the checkboxes</strong> next to the gowns you'd like to compare. The comparison
                      results will appear automatically below the list.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border bg-[#F99177] text-white flex items-center justify-center font-bold hover:bg-black hover:text-white transition-colors">
                    3
                  </div>
                  <div>
                    <p className="font-medium">
                      To export the data, click the <strong>Export</strong> button.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <VariablesAndSourcesModal />
          </div>
        </CardContent>
      </Card>

      <div className="mb-3">
        <Card className="relative z-30 border-none bg-white shadow-xl">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <GownList
                title={
                  <>
                    <Recycle className="inline-block mr-2" /> Reusable Gowns
                  </>
                }
                gowns={reusableGowns}
                selectedGowns={selectedGowns}
                onGownSelection={handleGownSelection}
              />
              <GownList
                title={
                  <>
                    <Trash2 className="inline-block mr-2" />
                    Single-use gowns
                  </>
                }
                gowns={singleUseGowns}
                selectedGowns={selectedGowns}
                onGownSelection={handleGownSelection}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedGownData.length > 0 && (
        <div className="pt-3 relative z-30">
          <XLSXdownload selectedGownData={selectedGownData} selectedGowns={selectedGowns} />

          <div className="mb-3">
            <GownComparisonTable gowns={selectedGownData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <CO2Impacts gowns={selectedGownData} />
            <EnergyImpacts gowns={selectedGownData} />
            <WaterImpacts gowns={selectedGownData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="col-span-3">
              <EconomicImpacts gowns={selectedGownData} />
            </div>
            {/* <div className="col-span-1">
              <SocialImpacts gowns={selectedGownData} />
            </div> */}
          </div>

          <div className="mb-3">
            <GownInvestmentCalculator selectedGowns={selectedGownData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <GownHygieneComparison gowns={selectedGownData} />
            <GownCertificatesTable gowns={selectedGownData} />
          </div>
        </div>
      )}
    </div>
  )
}
