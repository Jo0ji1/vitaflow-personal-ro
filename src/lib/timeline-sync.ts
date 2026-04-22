import { TimelineEvent, Medication, Meal, Habit, EventStatus, EventPriority } from './types'
import { format, isPast, addMinutes } from 'date-fns'

function getMealTypeName(type: string): string {
  const names: Record<string, string> = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche',
    'pre-workout': 'Pré-Treino',
    'post-workout': 'Pós-Treino',
    custom: 'Refeição'
  }
  return names[type] || 'Refeição'
}

export function generateTimelineEventsFromMedications(medications: Medication[]): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const today = format(new Date(), 'yyyy-MM-dd')
  
  medications.forEach(medication => {
    medication.times.forEach(time => {
      const scheduledTime = new Date()
      const [hours, minutes] = time.split(':').map(Number)
      scheduledTime.setHours(hours, minutes, 0, 0)
      const now = new Date()
      
      let status: EventStatus = 'pending'
      if (isPast(scheduledTime) && scheduledTime < addMinutes(now, -30)) {
        status = 'late'
      }
      
      events.push({
        id: `medication-${medication.id}-${time}`,
        type: 'medication',
        referenceId: medication.id,
        title: medication.name,
        subtitle: `${medication.dosage} ${medication.unit}`,
        scheduledTime,
        status,
        priority: 'high',
        category: medication.category,
        metadata: {
          instructions: medication.instructions
        }
      })
    })
  })
  
  return events
}

export function generateTimelineEventsFromMeals(meals: Meal[]): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const today = format(new Date(), 'yyyy-MM-dd')
  
  const todaysMeals = meals
    .filter(meal => meal.date === today && meal.status !== 'completed')
    .map(meal => {
      const scheduledTime = new Date()
      const [hours, minutes] = meal.scheduledTime.split(':').map(Number)
      scheduledTime.setHours(hours, minutes, 0, 0)
      const now = new Date()
      
      let status: EventStatus = meal.status
      if (isPast(scheduledTime) && scheduledTime < addMinutes(now, -30) && status === 'pending') {
        status = 'late'
      }
      
      const totalCalories = meal.items.reduce((sum, item) => sum + (item.calories || 0), 0)
      
      return {
        id: `meal-${meal.id}`,
        type: 'meal' as const,
        referenceId: meal.id,
        title: getMealTypeName(meal.type),
        subtitle: totalCalories > 0 ? `${totalCalories} calorias` : `${meal.items.length} itens`,
        scheduledTime,
        status,
        priority: 'normal' as EventPriority,
        category: meal.type,
        metadata: {
          items: meal.items
        }
      }
    })
  
  return todaysMeals
}

export function generateTimelineEventsFromHabits(habits: Habit[]): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  habits.forEach(habit => {
    const shouldShowToday = 
      habit.frequency.type === 'daily' ||
      (habit.frequency.daysOfWeek && habit.frequency.daysOfWeek.includes(dayOfWeek))
    
    if (shouldShowToday && habit.reminderTime) {
      const [hours, minutes] = habit.reminderTime.split(':').map(Number)
      const scheduledTime = new Date()
      scheduledTime.setHours(hours, minutes, 0, 0)
      
      const now = new Date()
      let status: EventStatus = 'pending'
      
      if (isPast(scheduledTime) && scheduledTime < addMinutes(now, -30)) {
        status = 'late'
      }
      
      events.push({
        id: `habit-${habit.id}`,
        type: 'habit',
        referenceId: habit.id,
        title: habit.name,
        subtitle: habit.description,
        scheduledTime,
        status,
        priority: 'normal',
        category: habit.category,
        metadata: {
          streak: habit.streak,
          longestStreak: habit.longestStreak
        }
      })
    }
  })
  
  return events
}

export function calculateDailyScore(
  waterProgress: number,
  medAdherence: number,
  completedMeals: number,
  plannedMeals: number,
  habitsCompleted: number,
  totalHabits: number
): number {
  const mealProgress = plannedMeals > 0 ? completedMeals / plannedMeals : 0
  const habitProgress = totalHabits > 0 ? habitsCompleted / totalHabits : 0
  
  const score = Math.round(
    medAdherence * 0.40 +
    mealProgress * 0.20 +
    waterProgress * 0.20 +
    habitProgress * 0.20
  )
  
  return Math.min(100, Math.max(0, score))
}
