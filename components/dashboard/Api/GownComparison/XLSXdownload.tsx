"use client"

import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import type { Gown } from "@/app/interfaces/Gown"
import {
  calculateInvestmentResults,
  calculateDepreciationSchedule,
  type InvestmentParameters,
} from "@/lib/InvestmentCalculations"

interface XLSXdownloadProps {
  selectedGownData: Gown[]
  selectedGowns: string[]
  // Investment calculation parameters
  investmentParameters?: InvestmentParameters
}

const XLSXdownload = ({
  selectedGownData,
  selectedGowns,
  investmentParameters = {
    numberOfGownsToInvest: 8000,
    planningHorizon: 5,
    annualGownUse: 36500,
  },
}: XLSXdownloadProps) => {
  const downloadSelectedGownsAsXLSX = () => {
    if (selectedGownData.length === 0) {
      alert("Please select at least one gown to download data.")
      return
    }

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // WORKSHEET 1: Gown Comparison Data
    const headers = ["", ...selectedGownData.map((gown) => gown.name)]
    const fields = [
      { field: "Reusable", value: selectedGownData.map((gown) => (gown.reusable ? "Yes" : "No")) },
      { field: "Purchase cost (€ per gown)", value: selectedGownData.map((gown) => gown.cost.toFixed(2)) },
      {
        field: "Purchase cost (€ per 1 use)",
        value: selectedGownData.map((gown) => gown.emission_impacts.purchase_cost.toFixed(2)),
      },
      { field: "Max. number of washes expected", value: selectedGownData.map((gown) => gown.washes || "n/a") },
      {
        field: "Perceived hygiene (1-5 Likert scale)",
        value: selectedGownData.map((gown) => (gown.hygine === 0 ? "n/a" : gown.hygine)),
      },
      {
        field: "Perceived Comfort (1-5 Likert scale)",
        value: selectedGownData.map((gown) => (gown.comfort === 0 ? "n/a" : gown.comfort)),
      },
      {
        field: "Social Certifications",
        value: selectedGownData.map((gown) => gown.certificates.map((cert) => cert.name).join(", ")),
      },
      {
        field: "CO₂ Impact (CO₂-eq per 1 use)",
        value: selectedGownData.map((gown) => gown.emission_impacts.CO2.toFixed(2)),
      },
      {
        field: "Energy Impact (MJ-eq per 1 use)",
        value: selectedGownData.map((gown) => gown.emission_impacts.Energy.toFixed(2)),
      },
      {
        field: "Water Impact (L per 1 use)",
        value: selectedGownData.map((gown) => gown.emission_impacts.Water.toFixed(2)),
      },
      {
        field: "Laundry Costs (€ per gown per use)",
        value: selectedGownData.map((gown) =>
          gown.emission_impacts.laundry_cost ? gown.emission_impacts.laundry_cost.toFixed(2) : "n/a",
        ),
      },
      {
        field: "Waste Costs (€ per gown)",
        value: selectedGownData.map((gown) =>
          gown.emission_impacts.waste ? gown.emission_impacts.waste.toFixed(2) : "n/a",
        ),
      },
      {
        field: "Residual Value (€ per gown)",
        value: selectedGownData.map((gown) => gown.emission_impacts.residual_value.toFixed(2)),
      },
    ]

    const worksheetData = [headers, ...fields.map((f) => [f.field, ...f.value])]
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Gowns")

    // WORKSHEET 2: Investment Analysis
    const investmentResults = calculateInvestmentResults(selectedGownData, investmentParameters)

    if (investmentResults.length > 0) {
      const investmentWorksheetData = []

      // Investment Parameters Section
      investmentWorksheetData.push(
        ["Investment Parameters", "Value"],
        ["Units purchased", investmentParameters.numberOfGownsToInvest.toLocaleString()],
        ["Investment period (years)", investmentParameters.planningHorizon.toString()],
        ["Annual usage (expected)", investmentParameters.annualGownUse.toLocaleString()],
        [
          "Total uses over horizon",
          (investmentParameters.annualGownUse * investmentParameters.planningHorizon).toLocaleString(),
        ],
        [""], // Empty row
      )

      // Financial Analysis Section
      investmentWorksheetData.push(
        ["FINANCIAL ANALYSIS", ...investmentResults.map((r) => r.gownName)],
        ["Type", ...investmentResults.map((r) => (r.isReusable ? "Reusable" : "Disposable"))],
        [""],
        ["CAPEX (€)", ...investmentResults.map((r) => r.capex.toLocaleString())],
        ["OPEX (€)", ...investmentResults.map((r) => r.opex.toLocaleString())],
        ["Extra Disposable Cost (€)", ...investmentResults.map((r) => r.extraDisposableCost.toLocaleString())],
        ["Total Expenses (€)", ...investmentResults.map((r) => r.totalExpenses.toLocaleString())],
        ["Cost per Use (€)", ...investmentResults.map((r) => r.costPerUse.toFixed(2))],
        [""],
      )

      // Capacity Analysis Section
      investmentWorksheetData.push(
        ["CAPACITY ANALYSIS", ...investmentResults.map((r) => r.gownName)],
        [
          "Gowns Purchased",
          ...investmentResults.map((r) => (r.isReusable ? r.numberOfGownsToInvest.toLocaleString() : "n/a")),
        ],
        [
          "Max Uses",
          ...investmentResults.map((r) => (r.isReusable ? r.maxGownUsesWithReduction.toLocaleString() : "0")),
        ],
        ["Extra Disposables Needed", ...investmentResults.map((r) => r.extraDisposableGownsNeeded.toLocaleString())],
        ["Utilization Rate (%)", ...investmentResults.map((r) => r.utilizationRate.toFixed(1))],
        [""],
      )

      // Environmental Impact Section
      investmentWorksheetData.push(
        ["ENVIRONMENTAL IMPACT", ...investmentResults.map((r) => r.gownName)],
        ["Total CO₂ Emissions (kg)", ...investmentResults.map((r) => r.co2Breakdown.totalEmissions.toLocaleString())],
        ["Total Water Usage (L)", ...investmentResults.map((r) => r.waterBreakdown.totalEmissions.toLocaleString())],
        ["Total Energy Usage (MJ)", ...investmentResults.map((r) => r.energyBreakdown.totalEmissions.toLocaleString())],
        [""],
      )

      // Depreciation Schedule for Reusable Gowns
      const reusableResults = investmentResults.filter((r) => r.isReusable)
      if (reusableResults.length > 0) {
        investmentWorksheetData.push(["DEPRECIATION SCHEDULE"], [""])

        reusableResults.forEach((result, index) => {
          const depreciationSchedule = calculateDepreciationSchedule(result)

          if (index > 0) {
            investmentWorksheetData.push([""]) // Add space between gowns
          }

          investmentWorksheetData.push(
            [`${result.gownName} - Depreciation Schedule`],
            ["Year", "Book Value (€)", "Annual Depreciation (€)", "Operational Costs (€)"],
          )

          depreciationSchedule.forEach((row) => {
            investmentWorksheetData.push([
              `Year ${row.year}`,
              Math.round(row.bookValue).toLocaleString(),
              Math.round(row.annualDepreciation).toLocaleString(),
              Math.round(row.operationalCosts).toLocaleString(),
            ])
          })

          investmentWorksheetData.push([""]) // Empty row after each table
        })
      }

      const investmentWorksheet = XLSX.utils.aoa_to_sheet(investmentWorksheetData)
      XLSX.utils.book_append_sheet(workbook, investmentWorksheet, "Investment Analysis")
    }

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, "gown_analysis_complete.xlsx")
  }

  return (
    <div className="mb-3 flex justify-end">
      <Button onClick={downloadSelectedGownsAsXLSX} disabled={selectedGowns.length === 0} className="bg-white text-black">
        Export data
      </Button>
    </div>
  )
}

export default XLSXdownload
