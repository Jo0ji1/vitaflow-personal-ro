import { useKV } from '@github/spark/hooks'
import { v4 as uuid } from 'uuid'
import { WaterTracker } from '@/components/water/WaterTracker'
import { Button } from '@/components/ui/button'
import { WaterLog } from '@/lib/types'
import { getTodayDateString } from '@/lib/timeline-helpers'
import { ArrowLeft } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface HidratacaoViewProps {
  onBack: () => void
}

export function HidratacaoView({ onBack }: HidratacaoViewProps) {
  const [waterLogs, setWaterLogs] = useKV<WaterLog[]>('water-logs-today', [])
  const [waterGoal] = useKV<number>('water-goal', 2500)
  
  const todaysLogs = (waterLogs || []).filter(log => log.date === getTodayDateString())
  const currentWater = todaysLogs.reduce((sum, log) => sum + log.amount, 0)
  
  const handleAddWater = (amount: number) => {
    const newLog: WaterLog = {
      id: `water-${uuid()}`,
      userId: 'current-user',
      amount,
      timestamp: new Date(),
      date: getTodayDateString()
    }
    setWaterLogs(prev => [...(prev || []), newLog])
    toast.success(`+${amount}ml registrados!`)
  }
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <Button 
              variant="ghost"
              size="sm"
              className="mb-2"
              onClick={onBack}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold mb-1">Hidratação</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe sua meta diária de água
            </p>
          </div>
        </div>
        
        <div className="p-4">
          <WaterTracker 
            current={currentWater}
            goal={waterGoal || 2500}
            onAddWater={handleAddWater}
          />
        </div>
      </div>
    </div>
  )
}
