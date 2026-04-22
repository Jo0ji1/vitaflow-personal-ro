import { useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendUp,
  TrendDown,
  Minus,
  Fire,
  Target,
  CheckCircle,
} from '@phosphor-icons/react'
import type {
  Medication,
  MedicationDose,
  WaterLog,
  Meal,
  Workout,
  WorkoutSession,
  Habit,
  HabitLog,
} from '@/lib/types'
import { format, subDays, startOfDay } from 'date-fns'

// ------------------------------------------------------------------
// Util: janelas de 7 dias (D-6..D-0 = esta semana; D-13..D-7 = anterior).
// Tudo calculado a partir dos KVs — sem mocks.
// ------------------------------------------------------------------

type WeeklyStats = {
  medicationAdherence: number
  waterGoal: number
  mealsCompleted: number
  mealsPlanned: number
  workoutsCompleted: number
  workoutsPlanned: number
  habitsCompleted: number
  habitsPlanned: number
  totalScore: number
}

function round(n: number): number {
  return Number.isFinite(n) ? Math.round(n) : 0
}

function pct(done: number, total: number): number {
  if (total <= 0) return 0
  return Math.max(0, Math.min(100, round((done / total) * 100)))
}

function isWithin(date: Date, start: Date, end: Date): boolean {
  const t = date.getTime()
  return t >= start.getTime() && t <= end.getTime()
}

function calcWeeklyStats(args: {
  medications: Medication[]
  doses: MedicationDose[]
  waterLogs: WaterLog[]
  waterGoalMl: number
  meals: Meal[]
  workouts: Workout[]
  workoutSessions: WorkoutSession[]
  habits: Habit[]
  habitLogs: HabitLog[]
  windowStart: Date
  windowEnd: Date
}): WeeklyStats {
  const {
    medications,
    doses,
    waterLogs,
    waterGoalMl,
    meals,
    workoutSessions,
    habits,
    habitLogs,
    windowStart,
    windowEnd,
  } = args

  // Medicação: doses agendadas na janela vs concluídas.
  const dosesInWindow = doses.filter((d) => isWithin(new Date(d.scheduledTime), windowStart, windowEnd))
  const medsPlanned = dosesInWindow.length
  const medsDone = dosesInWindow.filter((d) => d.status === 'completed').length
  // Fallback: sem registro de doses ainda, derivamos da quantidade de medicamentos * dias.
  const fallbackPlanned =
    medications.length > 0 ? medications.reduce((acc, m) => acc + (m.times?.length || 0), 0) * 7 : 0
  const medicationAdherence = pct(medsDone, medsPlanned || fallbackPlanned)

  // Água: soma por dia / (meta * 7).
  const waterInWindow = waterLogs.filter((w) => {
    const d = new Date(w.timestamp)
    return isWithin(d, windowStart, windowEnd)
  })
  const waterSum = waterInWindow.reduce((acc, w) => acc + (w.amount || 0), 0)
  const waterGoal = pct(waterSum, (waterGoalMl || 2500) * 7)

  // Refeições: registros com status completed/skipped no período.
  const mealsInWindow = meals.filter((m) => {
    const d = new Date(m.date)
    return isWithin(d, startOfDay(windowStart), windowEnd)
  })
  const mealsPlanned = mealsInWindow.length
  const mealsCompleted = mealsInWindow.filter((m) => m.status === 'completed').length

  // Treinos: sessões com status completed no período.
  const sessionsInWindow = workoutSessions.filter((s) => isWithin(new Date(s.date), windowStart, windowEnd))
  const workoutsPlanned = sessionsInWindow.length
  const workoutsCompleted = sessionsInWindow.filter((s) => s.status === 'completed').length

  // Hábitos: logs no período (planejado = hábitos ativos * 7).
  const logsInWindow = habitLogs.filter((l) => {
    const d = new Date(l.date)
    return isWithin(d, startOfDay(windowStart), windowEnd)
  })
  const habitsPlanned = habits.length * 7
  const habitsCompleted = logsInWindow.filter((l) => l.completed).length

  // Score ponderado igual ao calculateDailyScore (med 40 / water 25 / meals 20 / habits 15).
  const mealsPct = pct(mealsCompleted, mealsPlanned)
  const habitsPct = pct(habitsCompleted, habitsPlanned)
  const totalScore = round(
    medicationAdherence * 0.4 + waterGoal * 0.25 + mealsPct * 0.2 + habitsPct * 0.15,
  )

  return {
    medicationAdherence,
    waterGoal,
    mealsCompleted,
    mealsPlanned,
    workoutsCompleted,
    workoutsPlanned,
    habitsCompleted,
    habitsPlanned,
    totalScore,
  }
}

// Streak simples: desde hoje pra trás, conta dias consecutivos com pelo menos 1 registro positivo.
function calcStreak(hasActivityOnDay: (day: Date) => boolean): number {
  let streak = 0
  for (let i = 0; i < 90; i++) {
    const day = subDays(new Date(), i)
    if (hasActivityOnDay(day)) {
      streak += 1
    } else if (i > 0) {
      // Hoje sem registro ainda não quebra a streak (dia pode estar em andamento).
      break
    }
  }
  return streak
}

function buildInsights(thisWeek: WeeklyStats): { id: string; message: string; icon: typeof CheckCircle; color: string }[] {
  const insights: { id: string; message: string; icon: typeof CheckCircle; color: string }[] = []

  if (thisWeek.medicationAdherence >= 90) {
    insights.push({
      id: 'med-ok',
      message: 'Sua aderência a medicamentos está excelente. Mantenha o ritmo!',
      icon: CheckCircle,
      color: 'text-success',
    })
  } else if (thisWeek.medicationAdherence > 0 && thisWeek.medicationAdherence < 70) {
    insights.push({
      id: 'med-low',
      message: 'Aderência a medicamentos abaixo de 70%. Que tal revisar os horários?',
      icon: Target,
      color: 'text-warning',
    })
  }

  if (thisWeek.waterGoal < 60 && thisWeek.waterGoal > 0) {
    insights.push({
      id: 'water-low',
      message: 'Hidratação abaixo da meta. Pequenos goles ao longo do dia ajudam.',
      icon: Target,
      color: 'text-warning',
    })
  }

  if (thisWeek.workoutsCompleted > 0) {
    insights.push({
      id: 'workouts',
      message: `Você completou ${thisWeek.workoutsCompleted} treino(s) esta semana. Consistência é tudo!`,
      icon: Fire,
      color: 'text-primary',
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'empty',
      message: 'Comece a registrar sua rotina para ver insights personalizados.',
      icon: Fire,
      color: 'text-muted-foreground',
    })
  }

  return insights
}

export function ProgressoView() {
  // Todas as coleções são opt-in; defaults vazios para novos usuários.
  const [medications] = useKV<Medication[]>('medications', [])
  const [doses] = useKV<MedicationDose[]>('medication-doses', [])
  const [waterLogs] = useKV<WaterLog[]>('water-logs-today', [])
  const [waterGoalMl] = useKV<number>('water-goal', 2500)
  const [meals] = useKV<Meal[]>('meals', [])
  const [workouts] = useKV<Workout[]>('workouts', [])
  const [workoutSessions] = useKV<WorkoutSession[]>('workout-sessions', [])
  const [habits] = useKV<Habit[]>('habits', [])
  const [habitLogs] = useKV<HabitLog[]>('habit-logs', [])

  const { thisWeek, lastWeek, streaks } = useMemo(() => {
    const now = new Date()
    const thisStart = startOfDay(subDays(now, 6))
    const thisEnd = now
    const lastStart = startOfDay(subDays(now, 13))
    const lastEnd = subDays(now, 7)

    const common = {
      medications: medications || [],
      doses: doses || [],
      waterLogs: waterLogs || [],
      waterGoalMl: waterGoalMl || 2500,
      meals: meals || [],
      workouts: workouts || [],
      workoutSessions: workoutSessions || [],
      habits: habits || [],
      habitLogs: habitLogs || [],
    }

    const thisWeek = calcWeeklyStats({ ...common, windowStart: thisStart, windowEnd: thisEnd })
    const lastWeek = calcWeeklyStats({ ...common, windowStart: lastStart, windowEnd: lastEnd })

    const medicationStreak = calcStreak((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      return (doses || []).some(
        (d) => d.status === 'completed' && format(new Date(d.scheduledTime), 'yyyy-MM-dd') === dayStr,
      )
    })
    const waterStreak = calcStreak((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      return (waterLogs || []).some((w) => w.date === dayStr)
    })
    const workoutStreak = calcStreak((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      return (workoutSessions || []).some(
        (s) => s.status === 'completed' && format(new Date(s.date), 'yyyy-MM-dd') === dayStr,
      )
    })

    return {
      thisWeek,
      lastWeek,
      streaks: { medication: medicationStreak, water: waterStreak, workout: workoutStreak },
    }
  }, [medications, doses, waterLogs, waterGoalMl, meals, workouts, workoutSessions, habits, habitLogs])

  const scoreDiff = thisWeek.totalScore - lastWeek.totalScore
  const trend = scoreDiff === 0 ? 'flat' : scoreDiff > 0 ? 'up' : 'down'
  const TrendIcon = trend === 'up' ? TrendUp : trend === 'down' ? TrendDown : Minus
  const trendColor =
    trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'

  const insights = useMemo(() => buildInsights(thisWeek), [thisWeek])

  const mealsPct = pct(thisWeek.mealsCompleted, thisWeek.mealsPlanned)
  const workoutsPct = pct(thisWeek.workoutsCompleted, thisWeek.workoutsPlanned)
  const habitsPct = pct(thisWeek.habitsCompleted, thisWeek.habitsPlanned)

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-1">Progresso</h1>
            <p className="text-sm text-muted-foreground">Acompanhe sua evolução e insights</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold">{thisWeek.totalScore}%</CardTitle>
                  <CardDescription>Score Semanal (últimos 7 dias)</CardDescription>
                </div>
                <div className={`flex items-center gap-1 ${trendColor}`} aria-label={`Tendência ${trend}`}>
                  <TrendIcon size={20} weight="bold" />
                  <span className="font-semibold">
                    {trend === 'flat' ? '0' : Math.abs(scoreDiff)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={thisWeek.totalScore} className="h-2" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <div className="text-2xl font-bold text-destructive mb-1">{streaks.medication}</div>
                <div className="text-xs text-muted-foreground">dias seguidos</div>
                <div className="text-xs font-medium mt-1">Medicação</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{streaks.water}</div>
                <div className="text-xs text-muted-foreground">dias seguidos</div>
                <div className="text-xs font-medium mt-1">Hidratação</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <div className="text-2xl font-bold text-accent mb-1">{streaks.workout}</div>
                <div className="text-xs text-muted-foreground">dias seguidos</div>
                <div className="text-xs font-medium mt-1">Treino</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="semana" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="semana">Semana</TabsTrigger>
              <TabsTrigger value="mes">Mês</TabsTrigger>
              <TabsTrigger value="ano">Ano</TabsTrigger>
            </TabsList>

            <TabsContent value="semana" className="space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Aderência por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CategoryRow label="Medicamentos" value={thisWeek.medicationAdherence} />
                  <CategoryRow label="Hidratação" value={thisWeek.waterGoal} />
                  <CategoryRow
                    label="Refeições"
                    value={mealsPct}
                    hint={`${thisWeek.mealsCompleted}/${thisWeek.mealsPlanned || '-'}`}
                  />
                  <CategoryRow
                    label="Treinos"
                    value={workoutsPct}
                    hint={`${thisWeek.workoutsCompleted}/${thisWeek.workoutsPlanned || '-'}`}
                  />
                  <CategoryRow
                    label="Hábitos"
                    value={habitsPct}
                    hint={`${thisWeek.habitsCompleted}/${thisWeek.habitsPlanned || '-'}`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mes" className="space-y-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    Relatório mensal em desenvolvimento
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ano" className="space-y-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    Relatório anual em desenvolvimento
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Fire size={20} weight="fill" className="text-primary" />
                Insights Personalizados
              </CardTitle>
              <CardDescription>Análises automáticas do seu comportamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight) => {
                const Icon = insight.icon
                return (
                  <div key={insight.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Icon size={20} weight="fill" className={insight.color} />
                    <p className="text-sm flex-1">{insight.message}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CategoryRow({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value}%{hint ? ` · ${hint}` : ''}
        </span>
      </div>
      <Progress value={value} className="h-2" aria-label={`${label}: ${value}%`} />
    </div>
  )
}
