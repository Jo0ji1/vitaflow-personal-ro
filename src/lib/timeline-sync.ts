import { format, isPast, addMinutes } from 'date-fns'
import {
  TimelineEvent,
  Medication,
  Meal,
  Habit,
  EventStatus,
  EventPriority,
  MealType,
} from './types'

const MEAL_TYPE_NAMES: Record<MealType, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snack: 'Lanche',
  'pre-workout': 'Pré-Treino',
  'post-workout': 'Pós-Treino',
  custom: 'Refeição',
}

export function getMealTypeName(type: MealType): string {
  return MEAL_TYPE_NAMES[type] ?? 'Refeição'
}

/**
 * Dado um horário "HH:mm", retorna uma Date de hoje naquele horário.
 */
function buildTodayTime(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  return date
}

/**
 * Calcula status a partir do horário agendado: `late` se passou mais de 30min.
 * Mantém o status atual se já estiver definido (`completed`, `skipped`, etc).
 */
function deriveStatus(scheduledTime: Date, currentStatus: EventStatus = 'pending'): EventStatus {
  if (currentStatus !== 'pending') return currentStatus
  const now = new Date()
  if (isPast(scheduledTime) && scheduledTime < addMinutes(now, -30)) {
    return 'late'
  }
  return 'pending'
}

export function generateTimelineEventsFromMedications(medications: Medication[]): TimelineEvent[] {
  const events: TimelineEvent[] = []

  medications.forEach((medication) => {
    medication.times.forEach((time) => {
      const scheduledTime = buildTodayTime(time)
      const status = deriveStatus(scheduledTime)

      const priority: EventPriority =
        medication.category === 'medication' ? 'critical' : 'high'

      events.push({
        id: `medication-${medication.id}-${time}`,
        type: 'medication',
        referenceId: medication.id,
        title: medication.name,
        subtitle: `${medication.dosage}${medication.unit}`,
        scheduledTime,
        status,
        priority,
        category: medication.category,
        metadata: {
          dosage: medication.dosage,
          unit: medication.unit,
          instructions: medication.instructions,
        },
      })
    })
  })

  return events
}

export function generateTimelineEventsFromMeals(meals: Meal[]): TimelineEvent[] {
  const today = format(new Date(), 'yyyy-MM-dd')

  return meals
    .filter((meal) => meal.date === today)
    .map((meal) => {
      const scheduledTime = buildTodayTime(meal.scheduledTime)
      const status = deriveStatus(scheduledTime, meal.status)
      const totalCalories = meal.items.reduce((sum, item) => sum + (item.calories ?? 0), 0)

      const event: TimelineEvent = {
        id: `meal-${meal.id}`,
        type: 'meal',
        referenceId: meal.id,
        title: getMealTypeName(meal.type),
        subtitle:
          totalCalories > 0
            ? `${totalCalories} calorias`
            : `${meal.items.length} ite${meal.items.length === 1 ? 'm' : 'ns'}`,
        scheduledTime,
        status,
        priority: 'normal',
        category: meal.type,
        metadata: {
          items: meal.items,
          calories: totalCalories,
        },
      }

      return event
    })
}

export function generateTimelineEventsFromHabits(habits: Habit[]): TimelineEvent[] {
  const now = new Date()
  const dayOfWeek = now.getDay()

  return habits
    .filter((habit) => {
      const { type, daysOfWeek } = habit.frequency
      if (type === 'daily') return true
      if (type === 'weekly' && daysOfWeek) return daysOfWeek.includes(dayOfWeek)
      return true
    })
    .filter((habit) => !!habit.reminderTime)
    .map((habit) => {
      const scheduledTime = buildTodayTime(habit.reminderTime as string)
      const status = deriveStatus(scheduledTime)

      const event: TimelineEvent = {
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
        },
      }

      return event
    })
}

/**
 * Score diário ponderado. Parâmetros em porcentagem (0-100), exceto os contadores.
 * Pesos seguem o PRD: medicação 40%, água 25%, refeições 20%, hábitos 15%.
 */
export function calculateDailyScore(
  medicationAdherence: number,
  waterProgress: number,
  completedMeals: number,
  plannedMeals: number,
  habitsCompleted: number,
  totalHabits: number,
): number {
  const mealPct = plannedMeals > 0 ? (completedMeals / plannedMeals) * 100 : 100
  const habitPct = totalHabits > 0 ? (habitsCompleted / totalHabits) * 100 : 100

  const score = Math.round(
    medicationAdherence * 0.4 +
      waterProgress * 0.25 +
      mealPct * 0.2 +
      habitPct * 0.15,
  )

  return Math.min(100, Math.max(0, score))
}
