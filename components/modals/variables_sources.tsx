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
          <InfoCircledIcon className="mr-2 h-4 w-4" /> click here to view variables and sources used
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-black border-2 border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold"></DialogTitle>
          <DialogDescription className="text-gray-600">
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4 text-black">This button will open PDF in the future</h2>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
