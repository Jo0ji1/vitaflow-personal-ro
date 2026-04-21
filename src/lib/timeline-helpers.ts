import { 
  TimelineEvent, 
  EventStatus, 
  EventPriority, 
  DayScore, 
  MedicationDose, 
  WaterLog, 
  Meal, 
  WorkoutSession, 
  HabitLog 
} from './types'
import { format, isAfter, isBefore, differenceInMinutes, addMinutes, startOfDay, endOfDay } from 'date-fns'

export function getEventStatus(scheduledTime: Date, currentTime: Date = new Date()): EventStatus {
  const diffMinutes = differenceInMinutes(currentTime, scheduledTime)
  
  if (diffMinutes < 0) return 'pending'
  if (diffMinutes > 30) return 'late'
  return 'pending'
}

export function getEventPriority(type: string, category?: string): EventPriority {
  if (type === 'medication' && category === 'medication') return 'critical'
  if (type === 'medication') return 'high'
  if (type === 'workout') return 'normal'
  return 'normal'
}

export function sortTimelineEvents(events: TimelineEvent[]): TimelineEvent[] {
  const priorityWeight = {
    critical: 4,
    high: 3,
    normal: 2,
    low: 1,
  }
  
  const statusWeight = {
    late: 5,
    pending: 4,
    postponed: 3,
    completed: 2,
    skipped: 1,
  }
  
  return events.sort((a, b) => {
    const statusDiff = statusWeight[b.status] - statusWeight[a.status]
    if (statusDiff !== 0) return statusDiff
    
    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    
    return a.scheduledTime.getTime() - b.scheduledTime.getTime()
  })
}

export function calculateWaterProgress(logs: WaterLog[], goal: number): number {
  const total = logs.reduce((sum, log) => sum + log.amount, 0)
  return Math.min(Math.round((total / goal) * 100), 100)
}

export function calculateIdealWaterIntake(goal: number, currentTime: Date = new Date()): number {
  const startHour = 7
  const endHour = 21
  const totalHours = endHour - startHour
  
  const currentHour = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()
  const currentDecimalHour = currentHour + currentMinutes / 60
  
  if (currentDecimalHour < startHour) return 0
  if (currentDecimalHour >= endHour) return goal
  
  const hoursElapsed = currentDecimalHour - startHour
  const progressRatio = hoursElapsed / totalHours
  
  return Math.round(goal * progressRatio)
}

export function isWaterIntakeBehind(logs: WaterLog[], goal: number, currentTime: Date = new Date()): boolean {
  const actual = logs.reduce((sum, log) => sum + log.amount, 0)
  const ideal = calculateIdealWaterIntake(goal, currentTime)
  
  return actual < ideal * 0.7
}

export function calculateDayScore(
  medicationDoses: MedicationDose[],
  waterLogs: WaterLog[],
  meals: Meal[],
  workoutSessions: WorkoutSession[],
  habitLogs: HabitLog[],
  goals: { waterIntake: number; habitChecks: number }
): DayScore {
  const completedMeds = medicationDoses.filter(d => d.status === 'completed').length
  const totalMeds = medicationDoses.length
  const medicationAdherence = totalMeds > 0 ? Math.round((completedMeds / totalMeds) * 100) : 100
  
  const waterGoalProgress = calculateWaterProgress(waterLogs, goals.waterIntake)
  
  const completedMeals = meals.filter(m => m.status === 'completed').length
  const plannedMeals = meals.length
  
  const workoutCompleted = workoutSessions.some(s => s.status === 'completed')
  
  const completedHabits = habitLogs.filter(h => h.completed).length
  
  const totalScore = Math.round(
    medicationAdherence * 0.35 +
    waterGoalProgress * 0.25 +
    (plannedMeals > 0 ? (completedMeals / plannedMeals * 100) : 100) * 0.20 +
    (workoutCompleted ? 100 : 0) * 0.15 +
    (goals.habitChecks > 0 ? (completedHabits / goals.habitChecks * 100) : 100) * 0.05
  )
  
  return {
    date: format(new Date(), 'yyyy-MM-dd'),
    userId: 'current-user',
    medicationAdherence,
    waterGoalProgress,
    mealsCompleted: completedMeals,
    workoutCompleted,
    habitsCompleted: completedHabits,
    totalScore,
    insights: generateInsights({
      medicationAdherence,
      waterGoalProgress,
      mealsCompleted: completedMeals,
      plannedMeals,
      workoutCompleted,
      completedHabits,
      habitGoal: goals.habitChecks
    })
  }
}

function generateInsights(data: {
  medicationAdherence: number
  waterGoalProgress: number
  mealsCompleted: number
  plannedMeals: number
  workoutCompleted: boolean
  completedHabits: number
  habitGoal: number
}): string[] {
  const insights: string[] = []
  
  if (data.medicationAdherence >= 90) {
    insights.push('Excelente aderência aos medicamentos!')
  } else if (data.medicationAdherence < 70) {
    insights.push('Atenção: aderência aos medicamentos abaixo do ideal.')
  }
  
  if (data.waterGoalProgress >= 100) {
    insights.push('Meta de água batida! Continue assim.')
  } else if (data.waterGoalProgress < 50) {
    insights.push('Você está bebendo menos água que o ideal.')
  }
  
  if (data.workoutCompleted) {
    insights.push('Treino concluído hoje. Ótimo trabalho!')
  }
  
  if (data.completedHabits === data.habitGoal && data.habitGoal > 0) {
    insights.push('Todos os hábitos do dia foram cumpridos!')
  }
  
  return insights
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 6) return 'Boa madrugada'
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm')
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMinutes = differenceInMinutes(now, date)
  
  if (diffMinutes < 1) return 'agora'
  if (diffMinutes < 60) return `há ${diffMinutes}min`
  
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `há ${diffHours}h`
  
  const diffDays = Math.floor(diffHours / 24)
  return `há ${diffDays}d`
}

export function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function redistributeEvents(
  events: TimelineEvent[],
  fromTime: Date = new Date()
): TimelineEvent[] {
  const lateEvents = events.filter(e => e.status === 'late')
  const pendingEvents = events.filter(e => e.status === 'pending' && isAfter(e.scheduledTime, fromTime))
  
  const criticalLate = lateEvents.filter(e => e.priority === 'critical')
  const normalLate = lateEvents.filter(e => e.priority !== 'critical')
  
  let currentTime = fromTime
  const redistributed: TimelineEvent[] = []
  
  criticalLate.forEach(event => {
    redistributed.push({
      ...event,
      scheduledTime: currentTime,
      status: 'postponed'
    })
    currentTime = addMinutes(currentTime, 15)
  })
  
  normalLate.forEach(event => {
    redistributed.push({
      ...event,
      scheduledTime: currentTime,
      status: 'postponed'
    })
    currentTime = addMinutes(currentTime, 30)
  })
  
  return [
    ...redistributed,
    ...pendingEvents,
    ...events.filter(e => e.status === 'completed' || e.status === 'skipped')
  ]
}
