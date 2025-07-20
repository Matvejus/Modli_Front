"use client"

import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import type { Gown } from "@/app/interfaces/Gown"
import {
  calculateInvestmentResults,
  calculateDepreciationSchedule,
  calculateDisposableScheduleWithGownData,
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
    const worksheetData = []

    // Add headers with gown names
    const headers = ["", ...selectedGownData.map((gown) => gown.name)]
    worksheetData.push(headers)
    worksheetData.push([]) // Empty row

    // USER INPUT Section
    worksheetData.push(["USER INPUT", ...Array(selectedGownData.length).fill("")])

    // Reusable
    worksheetData.push(["Reusable", ...selectedGownData.map((gown) => (gown.reusable ? "Yes" : "No"))])

    // Purchase cost (€ per gown)
    worksheetData.push(["Purchase cost (€ per gown)", ...selectedGownData.map((gown) => gown.cost.toFixed(2))])

    // Laundry cost (€/gown/wash)
    worksheetData.push([
      "Laundry cost (€/gown/wash)",
      ...selectedGownData.map((gown) => (gown.reusable && gown.laundry_cost ? gown.laundry_cost.toFixed(2) : "n/a")),
    ])

    // Max. number of washes expected
    worksheetData.push([
      "Max. number of washes expected",
      ...selectedGownData.map((gown) => (gown.reusable ? gown.washes : "n/a")),
    ])

    // Perceived hygiene (1-5 Likert scale)
    worksheetData.push([
      "Perceived hygiene (1-5 Likert scale)",
      ...selectedGownData.map((gown) => (gown.hygine === 0 ? "n/a" : gown.hygine)),
    ])

    // Perceived Comfort (1-5 Likert scale)
    worksheetData.push([
      "Perceived Comfort (1-5 Likert scale)",
      ...selectedGownData.map((gown) => (gown.comfort === 0 ? "n/a" : gown.comfort)),
    ])

    // Residual value (€/gown)
    worksheetData.push(["Residual value (€/gown)", ...selectedGownData.map((gown) => gown.residual_value.toFixed(2))])

    // Waste cost (€/gown)
    worksheetData.push([
      "Waste cost (€/gown)",
      ...selectedGownData.map((gown) => (gown.waste_cost ? gown.waste_cost.toFixed(2) : "n/a")),
    ])

    // Social Certifications
    worksheetData.push([
      "Social Certifications",
      ...selectedGownData.map((gown) => gown.certificates.map((cert) => cert.name).join(", ")),
    ])

    worksheetData.push([]) // Empty row

    // GOWN COMPARISON Section
    worksheetData.push(["GOWN COMPARISON", ...Array(selectedGownData.length).fill("")])

    // CO₂ Impact (CO₂-eq per 1 use)
    worksheetData.push([
      "CO₂ Impact (CO₂-eq per 1 use)",
      ...selectedGownData.map((gown) => gown.emission_impacts.CO2.toFixed(2)),
    ])

    // Energy Impact (MJ-eq per 1 use)
    worksheetData.push([
      "Energy Impact (MJ-eq per 1 use)",
      ...selectedGownData.map((gown) => gown.emission_impacts.Energy.toFixed(2)),
    ])

    // Water Impact (L per 1 use)
    worksheetData.push([
      "Water Impact (L per 1 use)",
      ...selectedGownData.map((gown) => gown.emission_impacts.Water.toFixed(2)),
    ])

    // Purchase cost (€ per 1 use)
    worksheetData.push([
      "Purchase cost (€ per 1 use)",
      ...selectedGownData.map((gown) => gown.emission_impacts.purchase_cost.toFixed(2)),
    ])

    // Laundry Costs (€ per gown per use)
    worksheetData.push([
      "Laundry Costs (€ per 1 use)",
      ...selectedGownData.map((gown) =>
        gown.emission_impacts.laundry_cost ? gown.emission_impacts.laundry_cost.toFixed(2) : "n/a",
      ),
    ])

    // Waste Costs (€ per gown)
    worksheetData.push([
      "Waste Costs (€ per 1 use)",
      ...selectedGownData.map((gown) => (gown.emission_impacts.waste ? gown.emission_impacts.waste.toFixed(4) : "n/a")),
    ])

    // Residual Value (€ per gown)
    worksheetData.push([
      "Residual Value (€ per 1 use)",
      ...selectedGownData.map((gown) => gown.emission_impacts.residual_value.toFixed(4)),
    ])

    worksheetData.push([]) // Empty row

    // TOTAL COST (€ per 1 use)
    worksheetData.push([
      "TOTAL COST (€ per 1 use)",
      ...selectedGownData.map((gown) => {
        // Calculate total cost per use
        const purchaseCost = gown.emission_impacts.purchase_cost
        const laundryCost = gown.laundry_cost || 0
        const wasteCost = gown.emission_impacts.waste || 0
        const residualValue = gown.emission_impacts.residual_value || 0

        let totalCostPerUse
        if (gown.reusable) {
          // For reusable: (purchase cost per use) + (laundry cost per use) + (waste cost per use) - (residual value per use)
          totalCostPerUse = purchaseCost + laundryCost + wasteCost - residualValue
        } else {
          // For disposable: purchase cost + waste cost (no laundry, no residual value)
          totalCostPerUse = purchaseCost + wasteCost
        }

        return totalCostPerUse.toFixed(2)
      }),
    ])

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // Set column widths for better readability
    const colWidths = [
      { wch: 35 }, // First column (labels)
      ...selectedGownData.map(() => ({ wch: 20 })), // Data columns
    ]
    worksheet["!cols"] = colWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, "Gown Comparison")

    // WORKSHEET 2: Investment Analysis
    const investmentResults = calculateInvestmentResults(selectedGownData, investmentParameters)

    if (investmentResults.length > 0) {
      const investmentWorksheetData = []

      // Investment Parameters Section
      investmentWorksheetData.push(
        ["User Input", "Value"],
        ["Units purchased", investmentParameters.numberOfGownsToInvest.toLocaleString()],
        ["Investment period (years)", investmentParameters.planningHorizon.toString()],
        ["Annual usage (expected)", investmentParameters.annualGownUse.toLocaleString()],
        [""], // Empty row
      )

      // Financial Analysis Section
      investmentWorksheetData.push(
        ["Cost Comparison Analysis", ...investmentResults.map((r) => r.gownName)],
        ["Gown Type", ...investmentResults.map((r) => (r.isReusable ? "Reusable" : "Disposable"))],
        [""],
        ["Total Investment Cost (€)", ...investmentResults.map((r) => r.capex.toLocaleString())],
        ["Total Operational Cost (€)", ...investmentResults.map((r) => r.opex.toLocaleString())],
        ["Total Cost (€)", ...investmentResults.map((r) => r.totalExpenses.toLocaleString())],
        [""],
      )

      // Environmental Impact Section
      investmentWorksheetData.push(
        ["Total Environmental Impact", ...investmentResults.map((r) => r.gownName)],
        [
          "Total CO₂ Emissions (kg CO₂-eq)",
          ...investmentResults.map((r) => r.co2Breakdown.totalEmissions.toLocaleString()),
        ],
        ["Total Water Usage (L)", ...investmentResults.map((r) => r.waterBreakdown.totalEmissions.toLocaleString())],
        [
          "Total Energy Usage (MJ-eq)",
          ...investmentResults.map((r) => r.energyBreakdown.totalEmissions.toLocaleString()),
        ],
        [""],
      )

      // Cost Breakdown Tables for ALL Gowns (both reusable and disposable)
      investmentWorksheetData.push(["Cost Breakdown Analysis"], [""])

      investmentResults.forEach((result, index) => {
        const correspondingGown = selectedGownData.find((g) => g.id === result.gownId)

        if (index > 0) {
          investmentWorksheetData.push([""]) // Add space between gowns
        }

        investmentWorksheetData.push([`${result.gownName}`])

        if (result.isReusable) {
          // Reusable gown depreciation schedule
          const depreciationSchedule = calculateDepreciationSchedule(result)

          investmentWorksheetData.push(["Year", "Book Value (€)", "Annual Depreciation (€)", "Operational Costs (€)"])

          depreciationSchedule.forEach((row) => {
            investmentWorksheetData.push([
              `Year ${row.year}`,
              Math.round(row.bookValue).toLocaleString(),
              Math.round(row.annualDepreciation).toLocaleString(),
              Math.round(row.operationalCosts).toLocaleString(),
            ])
          })
        } else {
          // Disposable gown yearly expense schedule
          const disposableSchedule = calculateDisposableScheduleWithGownData(result, correspondingGown)

          investmentWorksheetData.push(["Year", "Purchase Costs (€)", "Waste Costs (€)", "Total Annual Costs (€)"])

          disposableSchedule.forEach((row) => {
            investmentWorksheetData.push([
              `Year ${row.year}`,
              Math.round(row.purchaseCosts).toLocaleString(),
              Math.round(row.wasteCosts).toLocaleString(),
              Math.round(row.totalAnnualCosts).toLocaleString(),
            ])
          })
        }

        investmentWorksheetData.push([""]) // Empty row after each table
      })

      const investmentWorksheet = XLSX.utils.aoa_to_sheet(investmentWorksheetData)
      XLSX.utils.book_append_sheet(workbook, investmentWorksheet, "Investment Analysis")
    }

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, "Gown_analysis.xlsx")
  }

  return (
    <div className="mb-3 flex justify-end">
      <Button onClick={downloadSelectedGownsAsXLSX} disabled={selectedGowns.length === 0}>
        Export data
      </Button>
    </div>
  )
}

export default XLSXdownload
