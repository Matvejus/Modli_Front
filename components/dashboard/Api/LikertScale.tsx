import React from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const options = [
  { value: 1, label: 'Very Poor' },
  { value: 2, label: 'Poor' },
  { value: 3, label: 'Average' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Very Good' },
]

interface LikertScaleProps {
  value: number
  onChange: (value: number) => void
  name: string // Add this line
}

export function LikertScale({ value, onChange, name }: LikertScaleProps) {
  return (
    <RadioGroup
      value={value.toString()}
      onValueChange={(val) => onChange(parseInt(val))}
      className="flex justify-between"
    >
      {options.map((option) => (
        <div key={option.value} className="flex flex-col items-center">
          <RadioGroupItem
            value={option.value.toString()}
            id={`${name}-${option.value}`}
            className="sr-only"
          />
          <Label
            htmlFor={`${name}-${option.value}`}
            className="flex flex-col items-center space-y-2 cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
              {value === option.value && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </span>
            <span className="text-xs text-center">{option.label}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
