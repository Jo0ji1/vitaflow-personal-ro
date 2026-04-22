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
export function generateTimelineEv
 

      const [hours, minutes] = time.split(':').map(Number)
      scheduledTime.setHours(hours, 
      const now = new Date()
  
        status = 'late'
      
      
        id: `medication-${medication.i
        referenceId: medication.id,
      
        status,
        category: medication.category,
      
          instructions: medication.instructions
      })
  })
  retu

  cons
  
    .filter(meal => meal.date === today && meal.st
      const [hours, minutes
      scheduledTime.setHours(hours,
      const now = new Date()
      
        status = 'late
      
      
        id: `meal-${meal.id}`,
        referenceId
        subtitle: totalCalories > 0 
        status,
        category: meal.type,
         
        
    })
  re

  const events:
 

      habit.frequency.type === 'daily' ||
    
      const [hours, minutes] = habit.reminderTim
  
      c
      
        status = 'late
      
        id: `habit-${habit.id}`,
        referenceId: habit.id,
      
        status,
        category: habit.category,
      
        }
    }
  
}
export function calculateDailyScore(
  wate
  plannedMeals: num
  totalHabits: number
  const mealProgress 
  
    medAdherence * 0.40 +
    mealProgress * 0.20 +
  )
  return Math.m












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
