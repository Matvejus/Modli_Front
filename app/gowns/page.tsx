'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import GownList from '@/components/dashboard/Api/GownList'
import GownEmissionChart from '@/components/dashboard/Api/GownRadar'
// import OptimizationSpecifications from '@/components/dashboard/Api/OptimizationSpecifications'
// import ClusteredBarChart from '@/components/dashboard/Api/clustered-bar-impacts'
// import UsageChart from '@/components/dashboard/Api/GownUsage'
// import GownImpactsStacked from '@/components/dashboard/Api/stacked-bar-impacts'
import VariablesAndSourcesModal from '@/components/modals/variables_sources'
// import GownTotalUsage from '@/components/dashboard/Api/GownTotalUsage'
import GownComparisonTable from '@/components/dashboard/Api/GownComparison/EmissionsTable'
import EconomicImpacts from '@/components/dashboard/Api/GownComparison/EconomicImpacts'
import SocialImpacts from '@/components/dashboard/Api/GownComparison/SocialImpacts'
import GownHygieneComparison from '@/components/dashboard/Api/GownComparison/HygineComparison'
import GownCertificatesTable from '@/components/dashboard/Api/GownComparison/CertificatesTable'
import EnergyImpacts from '@/components/dashboard/Api/GownComparison/EnergyImpact'
import WaterImpacts from '@/components/dashboard/Api/GownComparison/WaterImpact'
import CO2Impacts from '@/components/dashboard/Api/GownComparison/CO2Impact'
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Gown } from '../interfaces/Gown'
import { Recycle, Trash2, Leaf  } from 'lucide-react';



export default function GownsPage() {
  const [reusableGowns, setReusableGowns] = useState<Gown[]>([])
  const [singleUseGowns, setSingleUseGowns] = useState<Gown[]>([])
  const [selectedGowns, setSelectedGowns] = useState<string[]>([])
  const [selectedGownData, setSelectedGownData] = useState<Gown[]>([])
  const [loading, setLoading] = useState(false)

  
  const fetchGowns = async () => {
    try {
      const response = await fetch(`api/emissions/gown-list/`, {
        credentials: 'include'  // Add this line
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      
      // Map data to match the Gown structure and include emission_impacts directly
      const formattedData: Gown[] = data.map((gown: Gown) => ({
        ...gown,
        emission_impacts: gown.emission_impacts,
      }));
      
      setReusableGowns(formattedData.filter((gown) => gown.reusable && gown.visible));
      setSingleUseGowns(formattedData.filter((gown) => !gown.reusable && gown.visible));
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
      fetch(`/api/emissions/selected-gowns-emissions?ids=${selectedGowns.join(',')}`, {
        credentials: "include", // Ensure cookies are sent
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch selected gowns: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setSelectedGownData(data))
        .catch(error => console.error('Error fetching selected gowns data:', error));
    } else {
      setSelectedGownData([]);
    }
  }, [selectedGowns]);
  console.log(selectedGowns)
  

  const handleGownSelection = (gownId: string) => {
    setSelectedGowns(prev => {
      if (prev.includes(gownId)) {
        // If the gown is already selected, remove it
        return prev.filter(id => id !== gownId);
      } else if (prev.length < 3) {
        // Add the gown only if the total selected is less than 3
        return [...prev, gownId];
      } else {
        // If 3 gowns are already selected, prevent adding more
        alert("You can only select up to 3 gowns.");
        return prev;
      }
    });
  };

  const downloadSelectedGownsAsXLSX = () => {
    if (selectedGownData.length === 0) {
      alert("Please select at least one gown to download data.")
      return
    }

    // Prepare data for XLSX with gown names as columns
    const headers = ["", ...selectedGownData.map(gown => gown.name)];
    const fields = [
      { field: "Reusable", value: selectedGownData.map(gown => gown.reusable ? "Yes" : "No") },
      { field: "Cost €", value: selectedGownData.map(gown => gown.cost) },
      { field: "Laundry Cost (€ per gown wash)", value: selectedGownData.map(gown => gown.laundry_cost) },
      { field: "Max. number of washes expected", value: selectedGownData.map(gown => gown.washes || "N/A") },
      { field: "Perceived Hygiene", value: selectedGownData.map(gown => gown.hygine === 0 ? "n/a" : gown.hygine) },
      { field: "Perceived Comfort", value: selectedGownData.map(gown => gown.comfort === 0 ? "n/a" : gown.comfort) },
      { field: "Social Certifications", value: selectedGownData.map(gown => gown.certificates.join(", ")) },
      { field: "FTE Local (per 1 gown use)", value: selectedGownData.map(gown => gown.fte_local) },
      { field: "FTE Local Extra (per 1 gown use)", value: selectedGownData.map(gown => gown.fte_local_extra) },
      { field: "CO₂-eq Impact (Unit per 1 gown use)", value: selectedGownData.map(gown => gown.emission_impacts.CO2) },
      { field: "Energy Impact (Unit per 1 gown use)", value: selectedGownData.map(gown => gown.emission_impacts.Energy) },
      { field: "Water Impact (Unit per 1 gown use)", value: selectedGownData.map(gown => gown.emission_impacts.Water) },
      { field: "Total Economic impact (€ per 1 gown use)", value: selectedGownData.map(gown => gown.emission_impacts.purchase_cost) },
      { field: "Purchase cost (€ per 1 gown use)", value: selectedGownData.map(gown => gown.emission_impacts.purchase_cost) },
      { field: "Laundry Cost (€ per 1 gown use)", value: selectedGownData.map(gown => gown.emission_impacts.purchase_cost) },
      { field: "Waste Cost (€ per 1 gown use)", value: selectedGownData.map(gown => gown.emission_impacts.production_costs) },
      { field: "EOL Residual Value (€ per 1 gown use)", value: selectedGownData.map(gown => gown.emission_impacts.eol_cost) },
    ];

    // Create worksheet data
    const worksheetData = [headers, ...fields.map(f => [f.field, ...f.value])];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Gowns");

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, "selected_gowns_data.xlsx");
  }



  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mb-3">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Gown Comparison</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">

        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-medium">
                Please decide which isolation gowns (max. 3) from the below list you want to compare.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-medium">
                For each gown you want to compare select 'edit' to provide the required information.
              </p>
              <p className="text-sm text-muted-foreground">
                The values displayed here are default values that you can overwrite.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-medium">
                Select the gowns by ticking the appropriate boxes – the comparison data will automatically show below
                the gown list.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <p className="font-medium">You can export the data by clicking the 'Export' button.</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <VariablesAndSourcesModal />
        </div>
      </CardContent>
      </Card>

      <div className="mb-3">
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <GownList 
              title={<><Recycle className="inline-block mr-2" /> Reusable Gowns</>}
              gowns={reusableGowns} 
              selectedGowns={selectedGowns} 
              onGownSelection={handleGownSelection} 
            />
            <GownList 
              title={<><Trash2 className="inline-block mr-2" />Single-use gowns</>}
              gowns={singleUseGowns} 
              selectedGowns={selectedGowns} 
              onGownSelection={handleGownSelection} 
            />
            </div>
          </CardContent>
        </Card>
      </div>
        {selectedGownData.length > 0 && (
    <div className="pt-3">
      <div className='mb-3 flex justify-end'>
        <Button onClick={downloadSelectedGownsAsXLSX} disabled={selectedGowns.length === 0}>
          Export data
        </Button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GownHygieneComparison gowns={selectedGownData} />
        <GownCertificatesTable gowns={selectedGownData} />
      </div>
  </div>
            )}
      </div>
  );
}