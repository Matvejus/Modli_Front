"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import type { Gown } from "@/app/interfaces/Gown"

interface EconomicImpactsTableProps {
  gowns: Gown[]
}

export default function EconomicImpactsTable({ gowns }: EconomicImpactsTableProps) {
  const uses = 1 // Per 1 use as specified

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Gown Name</th>
              <th className="text-right py-2 font-medium">Purchase costs (€)</th>
              <th className="text-right py-2 font-medium">Waste costs (€)</th>
              <th className="text-right py-2 font-medium">
                Laundry costs (€)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <span className="sr-only">More information about laundry costs</span>
                      <Info className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cost per use for washing and processing reusable gowns</p>
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="text-right py-2 font-medium">
                Residual value (€)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <span className="sr-only">More information about residual value</span>
                      <Info className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Potential monetary value of isolation gowns/material at end-of-life</p>
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="text-right py-2 font-medium">Total cost (€)</th>
            </tr>
          </thead>
          <tbody>
            {gowns.map((gown) => {
              // Calculate the same values as in the chart
              const purchaseCost = Number.parseFloat((gown.emission_impacts.purchase_cost ?? 0).toFixed(2)) * uses
              const wasteCost = Number.parseFloat((gown.emission_impacts.waste ?? 0).toFixed(2)) * uses
              const laundryCost = Number.parseFloat((gown.laundry_cost ?? 0).toFixed(2)) * uses
              const residualValue = Number.parseFloat((gown.emission_impacts.residual_value ?? 0).toFixed(4)) * uses

              // Total cost calculation (residual value is subtracted as it's a benefit)
              const totalCost = purchaseCost + wasteCost + laundryCost - residualValue

              return (
                <tr key={gown.id} className="border-b">
                  <td className="py-2 font-medium">{gown.name}</td>
                  <td className="text-right py-2">{purchaseCost.toFixed(2)}</td>
                  <td className="text-right py-2">{wasteCost.toFixed(2)}</td>
                  <td className="text-right py-2">{gown.reusable ? laundryCost.toFixed(2) : "n/a"}</td>
                  <td className="text-right py-2">{residualValue.toFixed(4)}</td>
                  <td className="text-right py-2 font-medium">{totalCost.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  )
}
