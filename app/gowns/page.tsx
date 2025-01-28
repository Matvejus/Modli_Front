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
      fetch(`${API_BASE_URL}/emissions/api/selected-gowns-emissions/?ids=${selectedGowns.join(',')}`)
        .then(response => response.json())
        .then(data => setSelectedGownData(data))
        .catch(error => console.error('Error fetching selected gowns data:', error))
    } else {
      setSelectedGownData([])
    }
  }, [selectedGowns])

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
      { field: "ID", value: selectedGownData.map(gown => gown.id) },
      { field: "Cost €", value: selectedGownData.map(gown => gown.cost) },
      { field: "Reusable", value: selectedGownData.map(gown => gown.reusable ? "Yes" : "No") },
      { field: "Laundry Cost €", value: selectedGownData.map(gown => gown.laundry_cost) },
      { field: "Washes", value: selectedGownData.map(gown => gown.washes || "N/A") },
      { field: "Hygiene", value: selectedGownData.map(gown => gown.hygine) },
      { field: "Comfort", value: selectedGownData.map(gown => gown.comfort) },
      { field: "Certificates", value: selectedGownData.map(gown => gown.certificates.join(", ")) },
      { field: "FTE Local", value: selectedGownData.map(gown => gown.fte_local) },
      { field: "FTE Local Extra", value: selectedGownData.map(gown => gown.fte_local_extra) },
      { field: "CO2 Impact", value: selectedGownData.map(gown => gown.emission_impacts.CO2) },
      { field: "Energy Impact", value: selectedGownData.map(gown => gown.emission_impacts.Energy) },
      { field: "Water Impact", value: selectedGownData.map(gown => gown.emission_impacts.Water) },
      { field: "Cost Impact €", value: selectedGownData.map(gown => gown.emission_impacts.purchase_cost) },
      { field: "Production Costs €", value: selectedGownData.map(gown => gown.emission_impacts.production_costs) },
      { field: "Use Cost", value: selectedGownData.map(gown => gown.emission_impacts.use_cost) },
      { field: "Lost Cost", value: selectedGownData.map(gown => gown.emission_impacts.lost_cost) },
      { field: "EOL Cost", value: selectedGownData.map(gown => gown.emission_impacts.eol_cost) },
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
          <CardTitle className="text-3xl font-bold text-center">Circular Procurement Tool – Gown Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 text-center mb-3">
            Please select at least two isolation gowns from the below list – this list includes 
            commonly used materials and material combinations for (non-sterile) isolation 
            gowns. Click the edit button to add/change (if applicable) the purchase 
            cost, laundry cost, maximum number of washes, social certifications, hygiene and 
            comfort ratings. 
          </p>
          <VariablesAndSourcesModal />
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
              title="Reusable Gowns"
              gowns={reusableGowns} 
              selectedGowns={selectedGowns} 
              onGownSelection={handleGownSelection} 
            />
            <GownList 
              title="Single-use gowns"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <EconomicImpacts gowns={selectedGownData} />
        <SocialImpacts gowns={selectedGownData} />
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