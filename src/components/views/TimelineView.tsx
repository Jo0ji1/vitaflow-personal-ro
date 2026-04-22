import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { TimelineCard } from '@/components/timeline/TimelineCard'
import { WaterTracker } from '@/components/water/WaterTracker'
import { ScoreDisplay } from '@/components/dashboard/ScoreDisplay'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WaterLog, Medication, Meal, Habit, HabitLog } from '@/lib/types'
import { sortTimelineEvents, getTodayDateString, calculateWaterProgress } from '@/lib/timeline-helpers'
import { generateTimelineEventsFromMedications, generateTimelineEventsFromMeals, generateTimelineEventsFromHabits, calculateDailyScore } from '@/lib/timeline-sync'
import { ArrowClockwise, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TimelineView() {
  const [medications] = useKV<Medication[]>('medications', [])
  const [meals, setMeals] = useKV<Meal[]>('meals', [])
  const [habits] = useKV<Habit[]>('habits', [])
  const [habitLogs, setHabitLogs] = useKV<HabitLog[]>('habit-logs', [])
  const [waterLogs, setWaterLogs] = useKV<WaterLog[]>('water-logs-today', [])
  const [waterGoal] = useKV<number>('water-goal', 2500)
  const [, setLastSync] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const events = useMemo(() => {
    const medEvents = generateTimelineEventsFromMedications(medications || [])
    const mealEvents = generateTimelineEventsFromMeals(meals || [])
    const habitEvents = generateTimelineEventsFromHabits(habits || [])
    
    return [...medEvents, ...mealEvents, ...habitEvents]
  }, [medications, meals, habits])
  
  const todayScore = useMemo(() => {
    const today = getTodayDateString()
    const completedMeds = events.filter(e => e.type === 'medication' && e.status === 'completed').length
    const totalMeds = events.filter(e => e.type === 'medication').length
    const medAdherence = totalMeds > 0 ? (completedMeds / totalMeds) * 100 : 100
    
    const waterProgress = calculateWaterProgress(waterLogs || [], waterGoal || 2500)
    
    const todayMeals = (meals || []).filter(m => m.date === today)
    const completedMeals = todayMeals.filter(m => m.status === 'completed').length
    const plannedMeals = todayMeals.length
    
    const completedHabits = (habitLogs || []).filter(log => log.date === today && log.completed).length
    const totalHabits = events.filter(e => e.type === 'habit').length
    
    return calculateDailyScore(
      medAdherence,
      waterProgress,
      completedMeals,
      plannedMeals,
      completedHabits,
      totalHabits
    )
  }, [events, waterLogs, waterGoal, meals, habitLogs])

  const now = new Date()
  
  const sortedEvents = useMemo(() => sortTimelineEvents(events || []), [events])
  
  const lateEvents = sortedEvents.filter(e => e.status === 'late')
  const pendingEvents = sortedEvents.filter(e => e.status === 'pending')
  const completedEvents = sortedEvents.filter(e => e.status === 'completed')
  
  const nextEvent = pendingEvents[0]
  
  const handleCompleteEvent = (id: string) => {
    const event = events.find(e => e.id === id)
    if (!event) return
    
    if (event.type === 'meal') {
      setMeals((current) => 
        (current || []).map(meal => 
          meal.id === event.referenceId
            ? { ...meal, status: 'completed', completedAt: new Date() }
            : meal
        )
      )
    } else if (event.type === 'habit') {
      const today = getTodayDateString()
      const existingLog = (habitLogs || []).find(log => 
        log.habitId === event.referenceId && log.date === today
      )
      
      if (existingLog) {
        setHabitLogs((current) =>
          (current || []).map(log =>
            log.id === existingLog.id
              ? { ...log, completed: true, completedAt: new Date() }
              : log
          )
        )
      } else {
        const newLog: HabitLog = {
          id: `log-${Date.now()}`,
          habitId: event.referenceId,
          date: today,
          completed: true,
          completedAt: new Date()
        }
        setHabitLogs((current) => [...(current || []), newLog])
      }
    }
    
    toast.success('Item concluído!', {
      description: 'Ótimo trabalho mantendo sua rotina.'
    })
  }
  
  const handleSkipEvent = (id: string) => {
    const event = events.find(e => e.id === id)
    if (!event) return
    
    if (event.type === 'meal') {
      setMeals((current) => 
        (current || []).map(meal => 
          meal.id === event.referenceId
            ? { ...meal, status: 'skipped' }
            : meal
        )
      )
    }
    
    toast('Item pulado', {
      description: 'Registrado como pulado.'
    })
  }
  
  const handlePostponeEvent = (id: string) => {
    toast.info('Função de reagendar em desenvolvimento', {
      description: 'Em breve você poderá reagendar itens.'
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
  
  const getGreeting = () => {
    const hour = now.getHours()
    if (hour < 12) return 'Bom dia!'
    if (hour < 18) return 'Boa tarde!'
    return 'Boa noite!'
  }
  
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
              <p className="text-sm text-muted-foreground mb-4">
                Configure sua rotina para começar
              </p>
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                <p className="text-xs text-muted-foreground mb-2">
                  Vá para a aba "Rotina" para adicionar:
                </p>
                <ul className="text-sm text-muted-foreground text-left space-y-1">
                  <li>• Medicamentos e suplementos</li>
                  <li>• Hábitos diários</li>
                  <li>• Refeições planejadas</li>
                  <li>• Treinos</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
