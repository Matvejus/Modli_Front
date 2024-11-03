import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

interface Gown {
  id: string
  name: string
  cost: number
  washes?: number
}

interface GownListProps {
  title: string
  gowns: Gown[]
  selectedGowns: string[]
  onGownSelection: (id: string) => void
}

export default function GownList({ title, gowns, selectedGowns, onGownSelection }: GownListProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {gowns.map((gown) => (
        <div key={gown.id} className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
          <div className="flex items-center">
            <Checkbox
              id={`gown-${gown.id}`}
              checked={selectedGowns.includes(gown.id)}
              onCheckedChange={() => onGownSelection(gown.id)}
              aria-labelledby={`gown-label-${gown.id}`}
              className="mr-2"
            />
            <label id={`gown-label-${gown.id}`} htmlFor={`gown-${gown.id}`} className="text-sm">
              {gown.name} - €{gown.cost} per p.{gown.washes ? ` - ${gown.washes} washes` : ''}
            </label>
          </div>
          <Link href={`/gowns/${gown.id}`} className="text-blue-600 hover:underline text-sm">
            Edit
          </Link>
        </div>
      ))}
    </div>
  )
}