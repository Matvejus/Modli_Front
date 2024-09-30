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

export default function VariablesAndSourcesModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <InfoCircledIcon className="mr-2 h-4 w-4" /> View variables and sources
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-black border-2 border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Variables and Sources</DialogTitle>
          <DialogDescription className="text-gray-600">
            Information about gown comparison and portfolio optimization.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4 text-black">1. Gown Comparison:</h2>
            <p className="mb-4 text-gray-800">
              To compare the gowns, please mark the checkboxes of gowns that you would like based on sustainable
              parameters. Click the "Edit" button to adjust the cost, wash durability, and select certifications for
              each gown.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4 text-black">2. Portfolio Optimization:</h2>
            <p className="mb-4 text-gray-800">
              To create an optimal portfolio based on combinations of reusable and disposable gowns, please check the
              gowns that you would like the algorithm to choose from. Enter the address of your medical center and
              operational information for tailored recommendations.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}