import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Gown } from "@/app/interfaces/Gown"

interface XLSXdownloadProps {
    selectedGownData: Gown[]
    selectedGowns: string[]
}

const XLSXdownload = ({ selectedGownData, selectedGowns }: XLSXdownloadProps) => {
  const downloadSelectedGownsAsXLSX = () => {
    if (selectedGownData.length === 0) {
      alert("Please select at least one gown to download data.")
      return
    }

    // Prepare data for XLSX with gown names as columns
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

    // Create worksheet data
    const worksheetData = [headers, ...fields.map((f) => [f.field, ...f.value])]

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Gowns")

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, "selected_gowns_data.xlsx")
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