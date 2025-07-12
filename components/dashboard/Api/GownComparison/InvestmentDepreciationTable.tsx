"use client"

interface InvestmentResult {
  gownId: string
  gownName: string
  isReusable: boolean
  numberOfGownsToInvest: number
  planningHorizon: number
  capex: number
  opex: number
}

interface InvestmentDepreciationTableProps {
  result: InvestmentResult
}

export default function InvestmentDepreciationTable({ result }: InvestmentDepreciationTableProps) {
  if (!result.isReusable) {
    return null // Only show for reusable gowns
  }

  // Calculate depreciation schedule
  const calculateDepreciationSchedule = () => {
    const schedule = []
    const annualDepreciation = result.capex / result.planningHorizon
    const annualOperationalCost = result.opex / result.planningHorizon

    for (let year = 1; year <= result.planningHorizon; year++) {
      const bookValue = result.capex - annualDepreciation * (year - 1)

      schedule.push({
        year,
        bookValue: Math.max(0, bookValue),
        annualDepreciation,
        operationalCosts: annualOperationalCost,
      })
    }

    return schedule
  }

  const depreciationSchedule = calculateDepreciationSchedule()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-3 text-left font-medium">Year</th>
            <th className="border border-gray-300 px-4 py-3 text-right font-medium">Book Value Reusable Gown</th>
            <th className="border border-gray-300 px-4 py-3 text-right font-medium">Annual Depreciation</th>
            <th className="border border-gray-300 px-4 py-3 text-right font-medium">Operational Costs Reusable Gown</th>
          </tr>
        </thead>
        <tbody>
          {depreciationSchedule.map((row) => (
            <tr key={row.year} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 font-medium">Year {row.year}</td>
              <td className="border border-gray-300 px-4 py-3 text-right">
                {Math.round(row.bookValue).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-right">
                {Math.round(row.annualDepreciation).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-right">
                {Math.round(row.operationalCosts).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
