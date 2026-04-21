export type EventStatus = 'pending' | 'completed' | 'late' | 'skipped' | 'postponed'
export type EventPriority = 'critical' | 'high' | 'normal' | 'low'
export type EventType = 'medication' | 'water' | 'meal' | 'workout' | 'habit'
export type MedicationCategory = 'medication' | 'supplement' | 'vitamin'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout' | 'custom'
export type RecurrenceType = 'daily' | 'weekly' | 'custom'
export type Theme = 'light' | 'dark' | 'system'

export interface RecurrenceRule {
  type: RecurrenceType
  daysOfWeek?: number[]
  interval?: number
}

export interface UserPreferences {
  theme: Theme
  language: string
  notifications: NotificationPreferences
  dailyGoals: DailyGoals
  quietHours: { start: string; end: string }
  weekendMode: boolean
}

export interface NotificationPreferences {
  enabled: boolean
  sound: boolean
  medicationReminders: boolean
  waterReminders: boolean
  mealReminders: boolean
  workoutReminders: boolean
  habitReminders: boolean
}

export interface DailyGoals {
  waterIntake: number
  exerciseMinutes: number
  habitChecks: number
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: Date
  preferences: UserPreferences
}

export interface Medication {
  id: string
  userId: string
  name: string
  category: MedicationCategory
  dosage: string
  unit: string
  frequency: RecurrenceRule
  times: string[]
  startDate: Date
  endDate?: Date
  continuous: boolean
  instructions?: string
  stockQuantity?: number
  stockAlert?: number
  createdAt: Date
}

export interface MedicationDose {
  id: string
  medicationId: string
  scheduledTime: Date
  status: EventStatus
  completedAt?: Date
  note?: string
}

export interface WaterLog {
  id: string
  userId: string
  amount: number
  timestamp: Date
  date: string
}

export interface MealItem {
  id: string
  name: string
  quantity?: string
  calories?: number
}

export interface Meal {
  id: string
  userId: string
  date: string
  type: MealType
  scheduledTime: string
  items: MealItem[]
  status: EventStatus
  completedAt?: Date
  note?: string
}

export interface Exercise {
  id: string
  name: string
  equipment?: string
  sets: number
  reps: string
  weight?: number
  restTime: number
  order: number
  note?: string
}

export interface CompletedSet {
  reps: number
  weight?: number
  completedAt: Date
}

export interface CompletedExercise {
  exerciseId: string
  sets: CompletedSet[]
}

export interface Workout {
  id: string
  userId: string
  name: string
  description?: string
  muscleGroup: string[]
  exercises: Exercise[]
  createdAt: Date
  isFavorite: boolean
}

export interface WorkoutSession {
  id: string
  workoutId: string
  userId: string
  date: Date
  startTime: Date
  endTime?: Date
  completedExercises: CompletedExercise[]
  status: 'in-progress' | 'completed' | 'abandoned'
}

export interface Habit {
  id: string
  userId: string
  name: string
  description?: string
  category: string
  frequency: RecurrenceRule
  reminderTime?: string
  streak: number
  longestStreak: number
  totalCompletions: number
  createdAt: Date
}

export interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
  completedAt?: Date
  note?: string
}

export interface TimelineEvent {
  id: string
  type: EventType
  referenceId: string
  title: string
  subtitle?: string
  scheduledTime: Date
  status: EventStatus
  priority: EventPriority
  category: string
  metadata?: Record<string, unknown>
}

export interface DayScore {
  date: string
  userId: string
  medicationAdherence: number
  waterGoalProgress: number
  mealsCompleted: number
  workoutCompleted: boolean
  habitsCompleted: number
  totalScore: number
  insights: string[]
}
