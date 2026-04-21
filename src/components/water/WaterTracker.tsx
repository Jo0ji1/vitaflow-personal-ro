import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Drop, Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface WaterTrackerProps {
  current: number
  goal: number
  onAddWater: (amount: number) => void
  className?: string
}

const quickAmounts = [200, 300, 500, 750]

export function WaterTracker({ current, goal, onAddWater, className }: WaterTrackerProps) {
  const progress = Math.min(Math.round((current / goal) * 100), 100)
  const remaining = Math.max(goal - current, 0)
  
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Drop size={24} weight="duotone" className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Hidratação</h3>
          <p className="text-sm text-muted-foreground">
            {current}ml de {goal}ml
          </p>
        </div>
      </div>
      
      <Progress value={progress} className="h-3 mb-4" />
      
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-3xl font-bold font-mono">
            {progress}%
          </div>
          <div className="text-sm text-muted-foreground">
            Faltam {remaining}ml
          </div>
        </div>
        
        {progress >= 100 && (
          <div className="text-success font-semibold text-sm">
            Meta batida! 🎉
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Adicionar rápido
        </p>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => onAddWater(amount)}
              className="flex flex-col h-auto py-2"
            >
              <Plus size={14} weight="bold" className="mb-0.5" />
              <span className="text-xs font-mono">{amount}ml</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
