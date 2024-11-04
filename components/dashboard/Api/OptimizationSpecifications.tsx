import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function OptimizationSpecifications({ specifications, handleSpecificationChange }) {
  const optimizers = ["WATER", "CO2EQ", "ENERGY", "MONEY"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="usage_per_week">Usage per week</Label>
          <Input
            id="usage_per_week"
            type="number"
            value={specifications.usage_per_week}
            onChange={(e) => handleSpecificationChange('usage_per_week', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pickups_per_week">Pickups per week</Label>
          <Input
            id="pickups_per_week"
            type="number"
            value={specifications.pickups_per_week}
            onChange={(e) => handleSpecificationChange('pickups_per_week', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Optimizer</Label>
        <RadioGroup
          className="flex space-x-4"
          value={specifications.optimizer[0]}
          onValueChange={(value) => handleSpecificationChange('optimizer', value)}
        >
          {optimizers.map((optimizer) => (
            <div key={optimizer} className="flex items-center space-x-2">
              <RadioGroupItem value={optimizer} id={`optimizer-${optimizer.toLowerCase()}`} />
              <Label htmlFor={`optimizer-${optimizer.toLowerCase()}`}>{optimizer}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="loss_percentage">Loss percentage</Label>
        <Slider
          id="loss_percentage"
          min={0}
          max={1}
          step={0.1}
          value={[parseFloat(specifications.loss_percentage)]}
          onValueChange={(value) => handleSpecificationChange('loss_percentage', value[0].toString())}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0%</span>
          <span>{specifications.loss_percentage}%</span>
          <span>1%</span>
        </div>
      </div>
    </div>
  )
}