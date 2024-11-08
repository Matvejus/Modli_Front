'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InfoCircledIcon } from "@radix-ui/react-icons"

export default function EmissionsInfoModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <InfoCircledIcon className="mr-2 h-4 w-4" /> View Emissions Information
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-black border-2 border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Production Phase Emissions</DialogTitle>
          <DialogDescription className="text-gray-600">
            Detailed information on emissions generated during the production phase of medical gowns.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4 text-black">1. Emissions Overview:</h2>
            <p className="mb-4 text-gray-800">
              The data presented on this page focuses on the environmental impact associated with the production phase of both single-use and reusable gowns. It includes emissions related to raw material sourcing, yarn and fabric production, finishing, manufacturing, and transportation.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4 text-black">2. Single-use vs. Reusable Gowns:</h2>
            <p className="mb-4 text-gray-800">
              Single-use gowns have a one-time production and disposal impact, while reusable gowns account for multiple production and washing cycles. This data allows comparison of environmental trade-offs between these gown types, helping in making informed decisions for sustainable gown choices.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
