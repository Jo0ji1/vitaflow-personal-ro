import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { TimelineCard } from '@/components/timeline/TimelineCard'
import { WaterTracker } from '@/components/water/WaterTracker'
import { ScoreDisplay } from '@/components/dashboard/ScoreDisplay'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimelineEvent, WaterLog } from '@/lib/types'
import { getGreeting, sortTimelineEvents, getTodayDateString, calculateWaterProgress } from '@/lib/timeline-helpers'
import { generateMockTimelineEvents, generateMockWaterLogs } from '@/lib/mock-data'
import { ArrowClockwise, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TimelineView() {
  const [events, setEvents] = useKV<TimelineEvent[]>('timeline-events', [])
  const [waterLogs, setWaterLogs] = useKV<WaterLog[]>('water-logs-today', [])
  const [waterGoal] = useKV<number>('water-goal', 2500)
  const [todayScore] = useKV<number>('today-score', 0)
  const [, setLastSync] = useState(new Date())
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!hasInitialized && (!events || events.length === 0)) {
      setEvents(generateMockTimelineEvents())
      setWaterLogs(generateMockWaterLogs())
      setHasInitialized(true)
    }
  }, [hasInitialized, events, setEvents, setWaterLogs])

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const now = new Date()
  
  const sortedEvents = useMemo(() => sortTimelineEvents(events || []), [events])
  
  const lateEvents = sortedEvents.filter(e => e.status === 'late')
  const pendingEvents = sortedEvents.filter(e => e.status === 'pending')
  const completedEvents = sortedEvents.filter(e => e.status === 'completed')
  
  const nextEvent = pendingEvents[0]
  
  const handleCompleteEvent = (id: string) => {
    setEvents((current) => 
      (current || []).map(event => 
        event.id === id 
          ? { ...event, status: 'completed' }
          : event
      )
    )
    toast.success('Item concluído!', {
      description: 'Ótimo trabalho mantendo sua rotina.'
    })
  }
  
  const handleSkipEvent = (id: string) => {
    setEvents((current) => 
      (current || []).map(event => 
        event.id === id 
          ? { ...event, status: 'skipped' }
          : event
      )
    )
    toast('Item pulado', {
      description: 'Registrado como pulado.'
    })
  }
  
  const handlePostponeEvent = (id: string) => {
    setEvents((current) => 
      (current || []).map(event => 
        event.id === id 
          ? { 
              ...event, 
              status: 'postponed',
              scheduledTime: new Date(new Date(event.scheduledTime).getTime() + 30 * 60000)
            }
          : event
      )
    )
    toast.info('Item reagendado', {
      description: 'Adiado em 30 minutos.'
    })
  }
  
  const handleAddWater = (amount: number) => {
    const newLog: WaterLog = {
      id: `water-${Date.now()}`,
      userId: 'current-user',
      amount,
      timestamp: new Date(),
      date: getTodayDateString()
    }
    
    setWaterLogs((current) => [...(current || []), newLog])
    
    const currentTotal = (waterLogs || []).reduce((sum, log) => sum + log.amount, 0)
    toast.success(`+${amount}ml adicionado!`, {
      description: `Total: ${currentTotal + amount}ml`
    })
  }
  
  const waterProgress = calculateWaterProgress(waterLogs || [], waterGoal || 2500)
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-1">
              {getGreeting()}
            </h1>
            <p className="text-sm text-muted-foreground">
              {format(now, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScoreDisplay 
              score={todayScore || 0} 
              label="Score do Dia"
              size="md"
            />
            
            <div className="md:col-span-2">
              <WaterTracker 
                current={(waterLogs || []).reduce((sum, log) => sum + log.amount, 0)}
                goal={waterGoal || 2500}
                onAddWater={handleAddWater}
              />
            </div>
          </div>
          
          {nextEvent && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkle size={20} weight="fill" className="text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Próxima Ação
                </span>
              </div>
              <p className="text-foreground font-medium">
                {nextEvent.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(nextEvent.scheduledTime), 'HH:mm')}
              </p>
            </div>
          )}
          
          {lateEvents.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span>Atrasados</span>
                  <Badge variant="destructive">{lateEvents.length}</Badge>
                </h2>
                <Button size="sm" variant="outline">
                  <ArrowClockwise size={16} weight="bold" className="mr-1.5" />
                  Reorganizar
                </Button>
              </div>
              
              <div className="space-y-3">
                {lateEvents.map(event => (
                  <TimelineCard
                    key={event.id}
                    event={event}
                    onComplete={handleCompleteEvent}
                    onSkip={handleSkipEvent}
                    onPostpone={handlePostponeEvent}
                  />
                ))}
              </div>
            </div>
          )}
          
          {pendingEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>Próximos</span>
                <Badge variant="secondary">{pendingEvents.length}</Badge>
              </h2>
              
              <div className="space-y-3">
                {pendingEvents.map(event => (
                  <TimelineCard
                    key={event.id}
                    event={event}
                    onComplete={handleCompleteEvent}
                    onSkip={handleSkipEvent}
                    onPostpone={handlePostponeEvent}
                  />
                ))}
              </div>
            </div>
          )}
          
          {completedEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>Concluídos</span>
                <Badge variant="outline">{completedEvents.length}</Badge>
              </h2>
              
              <div className="space-y-3">
                {completedEvents.map(event => (
                  <TimelineCard
                    key={event.id}
                    event={event}
                  />
                ))}
              </div>
            </div>
          )}
          
          {(events || []).length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-2">
                Nenhum evento na timeline hoje
              </p>
              <p className="text-sm text-muted-foreground">
                Configure sua rotina para começar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

