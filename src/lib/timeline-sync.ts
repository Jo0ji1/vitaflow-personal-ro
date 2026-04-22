import { TimelineEvent, Medication, Meal, Habit, EventStatus, EventPriority } from './types'
import { format, isToday, isPast, isFuture, addMinutes } from 'date-fns'

export function generateTimelineEventsFromMedications(medications: Medication[]): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const today = format(new Date(), 'yyyy-MM-dd')
  
  medications.forEach(medication => {
    medication.times.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number)
      const scheduledTime = new Date()
      scheduledTime.setHours(hours, minutes, 0, 0)
      
      if (isToday(scheduledTime)) {
        const now = new Date()
        let status: EventStatus = 'pending'
        
        if (isPast(scheduledTime) && scheduledTime < addMinutes(now, -15)) {
          status = 'late'
        } else if (isPast(scheduledTime)) {
          status = 'pending'
        }
        
        events.push({
          id: `med-${medication.id}-${time}`,
          type: 'medication',
          referenceId: medication.id,
          title: medication.name,
          subtitle: `${medication.dosage}${medication.unit}`,
          scheduledTime,
          status,
          priority: medication.category === 'medication' ? 'high' : 'normal',
          category: medication.category,
          metadata: {
            instructions: medication.instructions
          }
        })
      }
    })
  })
  
  return events
}

export function generateTimelineEventsFromMeals(meals: Meal[]): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const today = format(new Date(), 'yyyy-MM-dd')
  
  meals
    .filter(meal => meal.date === today && meal.status === 'pending')
    .forEach(meal => {
      const [hours, minutes] = meal.scheduledTime.split(':').map(Number)
      const scheduledTime = new Date()
      scheduledTime.setHours(hours, minutes, 0, 0)
      
      const now = new Date()
      let status: EventStatus = 'pending'
      
      if (isPast(scheduledTime) && scheduledTime < addMinutes(now, -30)) {
        status = 'late'
      }
      
      const totalCalories = meal.items.reduce((sum, item) => sum + (item.calories || 0), 0)
      
      events.push({
        id: `meal-${meal.id}`,
        type: 'meal',
        referenceId: meal.id,
        title: getMealTypeName(meal.type),
        subtitle: totalCalories > 0 ? `${totalCalories} kcal` : `${meal.items.length} itens`,
        scheduledTime,
        status,
        priority: 'normal',
        category: meal.type,
        metadata: {
          items: meal.items,
          note: meal.note
        }
      })
    })
  
  return events
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
      
      if (isPast(scheduledTime)) {
        status = 'late'
      }
      
      events.push({
        id: `habit-${habit.id}`,
        type: 'habit',
        referenceId: habit.id,
        title: habit.name,
        subtitle: habit.category,
        scheduledTime,
        status,
        priority: 'normal',
        category: habit.category,
        metadata: {
          description: habit.description,
          streak: habit.streak
        }
      })
    }
  })
  
  return events
}

function getMealTypeName(type: string): string {
  const names: Record<string, string> = {
    'breakfast': 'Café da Manhã',
    'lunch': 'Almoço',
    'dinner': 'Jantar',
    'snack': 'Lanche',
    'pre-workout': 'Pré-Treino',
    'post-workout': 'Pós-Treino',
    'custom': 'Refeição'
  }
  return names[type] || type
}

export function calculateDailyScore(
  medicationAdherence: number,
  waterProgress: number,
  mealsCompleted: number,
  mealsPlanned: number,
  habitsCompleted: number,
  habitsPlanned: number
): number {
  const weights = {
    medication: 0.35,
    water: 0.20,
    meals: 0.20,
    habits: 0.25
  }
  
  const mealScore = mealsPlanned > 0 ? (mealsCompleted / mealsPlanned) * 100 : 100
  const habitScore = habitsPlanned > 0 ? (habitsCompleted / habitsPlanned) * 100 : 100
  
  const totalScore = 
    (medicationAdherence * weights.medication) +
    (waterProgress * weights.water) +
    (mealScore * weights.meals) +
    (habitScore * weights.habits)
  
  return Math.round(totalScore)
}
