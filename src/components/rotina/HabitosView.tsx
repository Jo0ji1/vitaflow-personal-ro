import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Plus, Fire, Pencil, Trash } from '@phosphor-icons/react'
import { Habit, HabitLog } from '@/lib/types'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface HabitosViewProps {
  onBack: () => void
}

export function HabitosView({ onBack }: HabitosViewProps) {
  const [habits, setHabits] = useKV<Habit[]>('habits', [])
  const [habitLogs, setHabitLogs] = useKV<HabitLog[]>('habit-logs', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    reminderTime: '',
    daysOfWeek: [1, 2, 3, 4, 5]
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      reminderTime: '',
      daysOfWeek: [1, 2, 3, 4, 5]
    })
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formData.name) {
      toast.error('Preencha o nome do hábito')
      return
    }

    const habit: Habit = {
      id: editingId || `habit-${uuid()}`,
      userId: 'current-user',
      name: formData.name,
      description: formData.description || undefined,
      category: formData.category || 'Geral',
      frequency: {
        type: formData.daysOfWeek.length === 7 ? 'daily' : 'weekly',
        daysOfWeek: formData.daysOfWeek
      },
      reminderTime: formData.reminderTime || undefined,
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      createdAt: new Date()
    }

    if (editingId) {
      setHabits((current) => 
        (current || []).map(h => h.id === editingId ? { ...habit, streak: h.streak, longestStreak: h.longestStreak, totalCompletions: h.totalCompletions } : h)
      )
      toast.success('Hábito atualizado!')
    } else {
      setHabits((current) => [...(current || []), habit])
      toast.success('Hábito criado!')
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (habit: Habit) => {
    setFormData({
      name: habit.name,
      description: habit.description || '',
      category: habit.category,
      reminderTime: habit.reminderTime || '',
      daysOfWeek: habit.frequency.daysOfWeek || [1, 2, 3, 4, 5]
    })
    setEditingId(habit.id)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setHabits((current) => (current || []).filter(h => h.id !== id))
    setHabitLogs((current) => (current || []).filter(log => log.habitId !== id))
    toast.success('Hábito removido')
  }

  const toggleDay = (day: number) => {
    setFormData(prev => {
      const days = prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day].sort()
      
      return { ...prev, daysOfWeek: days }
    })
  }

  const getTodayLog = (habitId: string): HabitLog | undefined => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return (habitLogs || []).find(log => log.habitId === habitId && log.date === today)
  }

  const toggleHabitToday = (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const existingLog = getTodayLog(habitId)

    if (existingLog) {
      setHabitLogs((current) => 
        (current || []).map(log => 
          log.id === existingLog.id 
            ? { ...log, completed: !log.completed, completedAt: !log.completed ? new Date() : undefined }
            : log
        )
      )
      
      setHabits((current) => 
        (current || []).map(h => {
          if (h.id === habitId) {
            const newCompleted = !existingLog.completed
            if (newCompleted) {
              const newStreak = h.streak + 1
              return {
                ...h,
                streak: newStreak,
                longestStreak: Math.max(h.longestStreak, newStreak),
                totalCompletions: h.totalCompletions + 1
              }
            } else {
              return {
                ...h,
                streak: Math.max(0, h.streak - 1),
                totalCompletions: Math.max(0, h.totalCompletions - 1)
              }
            }
          }
          return h
        })
      )

      toast.success(existingLog.completed ? 'Hábito desmarcado' : 'Hábito concluído!')
    } else {
      const newLog: HabitLog = {
        id: `log-${uuid()}`,
        habitId,
        date: today,
        completed: true,
        completedAt: new Date()
      }
      
      setHabitLogs((current) => [...(current || []), newLog])
      
      setHabits((current) => 
        (current || []).map(h => {
          if (h.id === habitId) {
            const newStreak = h.streak + 1
            return {
              ...h,
              streak: newStreak,
              longestStreak: Math.max(h.longestStreak, newStreak),
              totalCompletions: h.totalCompletions + 1
            }
          }
          return h
        })
      )

      toast.success('Hábito concluído!')
    }
  }

  const weekDays = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Seg' },
    { value: 2, label: 'Ter' },
    { value: 3, label: 'Qua' },
    { value: 4, label: 'Qui' },
    { value: 5, label: 'Sex' },
    { value: 6, label: 'Sáb' }
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mb-2"
            >
              ← Voltar
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Hábitos</h1>
                <p className="text-sm text-muted-foreground">
                  Construa consistência dia após dia
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus size={16} weight="bold" className="mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? 'Editar Hábito' : 'Novo Hábito'}
                    </DialogTitle>
                    <DialogDescription>
                      Crie um novo hábito para acompanhar sua rotina
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Hábito *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Meditação matinal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Ex: Bem-estar"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detalhes sobre o hábito..."
                        rows={3}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Dias da Semana</Label>
                      <div className="flex gap-2">
                        {weekDays.map(day => (
                          <Button
                            key={day.value}
                            type="button"
                            variant={formData.daysOfWeek.includes(day.value) ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleDay(day.value)}
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reminder">Lembrete (opcional)</Label>
                      <Input
                        id="reminder"
                        type="time"
                        value={formData.reminderTime}
                        onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} className="flex-1">
                        {editingId ? 'Atualizar' : 'Criar'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {(!habits || habits.length === 0) && (
            <Card>
              <CardContent className="pt-16 pb-16 text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
                <p className="text-muted-foreground mb-4">
                  Nenhum hábito cadastrado
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus size={16} weight="bold" className="mr-2" />
                  Criar Primeiro Hábito
                </Button>
              </CardContent>
            </Card>
          )}

          {habits && habits.map((habit) => {
            const todayLog = getTodayLog(habit.id)
            const isCompletedToday = todayLog?.completed || false

            return (
              <Card key={habit.id} className={isCompletedToday ? 'border-success/50 bg-success/5' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleHabitToday(habit.id)}
                        className={`mt-1 p-2 rounded-full transition-colors ${
                          isCompletedToday 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-muted hover:bg-success/20'
                        }`}
                      >
                        <CheckCircle size={20} weight={isCompletedToday ? 'fill' : 'regular'} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {habit.category}
                          </Badge>
                          {habit.streak > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Fire size={12} weight="fill" className="mr-1 text-accent" />
                              {habit.streak} dias
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{habit.name}</CardTitle>
                        {habit.description && (
                          <CardDescription className="mt-1">
                            {habit.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar hábito ${habit.name}`}
                        onClick={() => handleEdit(habit)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Excluir hábito ${habit.name}`}
                        onClick={() => handleDelete(habit.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold font-mono text-primary">
                        {habit.streak}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sequência Atual
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-accent">
                        {habit.longestStreak}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Melhor Sequência
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono">
                        {habit.totalCompletions}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Completo
                      </div>
                    </div>
                  </div>

                  {habit.frequency.daysOfWeek && habit.frequency.daysOfWeek.length < 7 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Frequência</div>
                      <div className="flex gap-1">
                        {weekDays.map(day => {
                          const isActive = habit.frequency.daysOfWeek?.includes(day.value)
                          return (
                            <div
                              key={day.value}
                              className={`flex-1 text-center py-1 rounded text-xs ${
                                isActive 
                                  ? 'bg-primary text-primary-foreground font-medium' 
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {day.label}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {habit.reminderTime && (
                    <div className="text-sm text-muted-foreground">
                      Lembrete: {habit.reminderTime}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
