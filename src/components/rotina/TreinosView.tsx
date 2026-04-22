import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Workout, Exercise, WorkoutSession } from '@/lib/types'
import { ArrowLeft, Barbell, Plus, Play, Star, Trash, Pencil, Timer, CheckCircle, ArrowRight } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TreinosViewProps {
  onBack: () => void
}

type ViewMode = 'list' | 'create' | 'execute'

export function TreinosView({ onBack }: TreinosViewProps) {
  const [workouts, setWorkouts] = useKV<Workout[]>('workouts', [])
  const [activeSession, setActiveSession] = useKV<WorkoutSession | null>('active-workout-session', null)
  
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [executingWorkout, setExecutingWorkout] = useState<Workout | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [restTimeRemaining, setRestTimeRemaining] = useState(0)
  
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    description: '',
    muscleGroup: [] as string[],
    exercises: [] as Exercise[]
  })
  
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    equipment: '',
    sets: 3,
    reps: '12',
    weight: 0,
    restTime: 60,
    note: ''
  })
  
  const [muscleGroupInput, setMuscleGroupInput] = useState('')
  
  const toggleFavorite = (workoutId: string) => {
    setWorkouts(prev =>
      (prev || []).map(w =>
        w.id === workoutId ? { ...w, isFavorite: !w.isFavorite } : w
      )
    )
  }

  const deleteWorkout = (workoutId: string) => {
    setWorkouts(prev => (prev || []).filter(w => w.id !== workoutId))
    toast.success('Treino removido')
  }
  
  const openCreateDialog = () => {
    setWorkoutForm({
      name: '',
      description: '',
      muscleGroup: [],
      exercises: []
    })
    setEditingWorkout(null)
    setIsDialogOpen(true)
  }
  
  const openEditDialog = (workout: Workout) => {
    setWorkoutForm({
      name: workout.name,
      description: workout.description || '',
      muscleGroup: workout.muscleGroup,
      exercises: workout.exercises
    })
    setEditingWorkout(workout)
    setIsDialogOpen(true)
  }
  
  const addMuscleGroup = () => {
    if (muscleGroupInput.trim()) {
      setWorkoutForm(prev => ({
        ...prev,
        muscleGroup: [...prev.muscleGroup, muscleGroupInput.trim()]
      }))
      setMuscleGroupInput('')
    }
  }
  
  const removeMuscleGroup = (index: number) => {
    setWorkoutForm(prev => ({
      ...prev,
      muscleGroup: prev.muscleGroup.filter((_, i) => i !== index)
    }))
  }
  
  const addExercise = () => {
    if (!exerciseForm.name.trim()) {
      toast.error('Digite o nome do exercício')
      return
    }
    
    const exercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: exerciseForm.name,
      equipment: exerciseForm.equipment || undefined,
      sets: exerciseForm.sets,
      reps: exerciseForm.reps,
      weight: exerciseForm.weight || undefined,
      restTime: exerciseForm.restTime,
      order: workoutForm.exercises.length,
      note: exerciseForm.note || undefined
    }
    
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }))
    
    setExerciseForm({
      name: '',
      equipment: '',
      sets: 3,
      reps: '12',
      weight: 0,
      restTime: 60,
      note: ''
    })
    
    toast.success('Exercício adicionado')
  }
  
  const removeExercise = (exerciseId: string) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter(e => e.id !== exerciseId)
    }))
  }
  
  const saveWorkout = () => {
    if (!workoutForm.name.trim()) {
      toast.error('Digite o nome do treino')
      return
    }
    
    if (workoutForm.exercises.length === 0) {
      toast.error('Adicione pelo menos um exercício')
      return
    }
    
    const workout: Workout = {
      id: editingWorkout?.id || `workout-${Date.now()}`,
      userId: 'current-user',
      name: workoutForm.name,
      description: workoutForm.description || undefined,
      muscleGroup: workoutForm.muscleGroup,
      exercises: workoutForm.exercises,
      createdAt: editingWorkout?.createdAt || new Date(),
      isFavorite: editingWorkout?.isFavorite || false
    }
    
    if (editingWorkout) {
      setWorkouts(prev => (prev || []).map(w => w.id === workout.id ? workout : w))
      toast.success('Treino atualizado!')
    } else {
      setWorkouts(prev => [...(prev || []), workout])
      toast.success('Treino criado!')
    }
    
    setIsDialogOpen(false)
  }
  
  const startWorkout = (workout: Workout) => {
    setExecutingWorkout(workout)
    setCurrentExerciseIndex(0)
    setRestTimeRemaining(0)
    setViewMode('execute')
    
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      workoutId: workout.id,
      userId: 'current-user',
      date: new Date(),
      startTime: new Date(),
      completedExercises: [],
      status: 'in-progress'
    }
    setActiveSession(session)
    toast.success('Treino iniciado!', {
      description: `${workout.exercises.length} exercícios`
    })
  }
  
  const completeExercise = () => {
    if (!executingWorkout) return
    
    if (currentExerciseIndex < executingWorkout.exercises.length - 1) {
      const exercise = executingWorkout.exercises[currentExerciseIndex]
      setRestTimeRemaining(exercise.restTime)
      
      const interval = setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            toast.success('Descanso concluído!', {
              description: 'Pronto para o próximo exercício'
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      setCurrentExerciseIndex(prev => prev + 1)
      toast.success('Exercício concluído!')
    } else {
      finishWorkout()
    }
  }
  
  const finishWorkout = () => {
    if (activeSession) {
      const completedSession: WorkoutSession = {
        ...activeSession,
        endTime: new Date(),
        status: 'completed'
      }
      setActiveSession(null)
    }
    
    toast.success('Treino concluído!', {
      description: 'Parabéns pelo esforço!'
    })
    setViewMode('list')
    setExecutingWorkout(null)
  }
  
  const cancelWorkout = () => {
    setViewMode('list')
    setExecutingWorkout(null)
    setActiveSession(null)
    toast('Treino cancelado')
  }

  if (viewMode === 'execute' && executingWorkout) {
    const currentExercise = executingWorkout.exercises[currentExerciseIndex]
    const progress = ((currentExerciseIndex / executingWorkout.exercises.length) * 100)
    
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-screen-lg mx-auto">
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold">{executingWorkout.name}</h1>
                <Button variant="ghost" size="sm" onClick={cancelWorkout}>
                  Cancelar
                </Button>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Exercício {currentExerciseIndex + 1} de {executingWorkout.exercises.length}
              </p>
            </div>
          </div>
          
          <div className="p-4 space-y-6">
            {restTimeRemaining > 0 ? (
              <Card className="border-primary bg-primary/5">
                <CardContent className="pt-16 pb-16 text-center">
                  <Timer size={64} className="mx-auto mb-4 text-primary" weight="fill" />
                  <h2 className="text-6xl font-bold font-mono mb-2">{restTimeRemaining}s</h2>
                  <p className="text-lg text-muted-foreground">Tempo de Descanso</p>
                  <Button 
                    onClick={() => setRestTimeRemaining(0)}
                    variant="outline"
                    className="mt-4"
                  >
                    Pular Descanso
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{currentExercise.name}</CardTitle>
                  {currentExercise.equipment && (
                    <CardDescription className="text-base">
                      {currentExercise.equipment}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary">{currentExercise.sets}</div>
                      <div className="text-sm text-muted-foreground">Séries</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-accent">{currentExercise.reps}</div>
                      <div className="text-sm text-muted-foreground">Repetições</div>
                    </div>
                    {currentExercise.weight && (
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-3xl font-bold">{currentExercise.weight}kg</div>
                        <div className="text-sm text-muted-foreground">Carga</div>
                      </div>
                    )}
                  </div>
                  
                  {currentExercise.note && (
                    <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <p className="text-sm text-foreground">💡 {currentExercise.note}</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={completeExercise}
                    className="w-full h-14 text-lg"
                  >
                    {currentExerciseIndex < executingWorkout.exercises.length - 1 ? (
                      <>
                        <CheckCircle size={24} weight="fill" className="mr-2" />
                        Concluir Exercício
                      </>
                    ) : (
                      <>
                        <CheckCircle size={24} weight="fill" className="mr-2" />
                        Finalizar Treino
                      </>
                    )}
                  </Button>
                  
                  {currentExerciseIndex < executingWorkout.exercises.length - 1 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Próximo exercício:</p>
                      <p className="font-medium">
                        {executingWorkout.exercises[currentExerciseIndex + 1].name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Sequência do Treino</p>
              <div className="space-y-2">
                {executingWorkout.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      idx === currentExerciseIndex
                        ? 'bg-primary/10 border-primary'
                        : idx < currentExerciseIndex
                        ? 'bg-success/5 border-success/20 opacity-60'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      idx < currentExerciseIndex
                        ? 'bg-success text-success-foreground'
                        : idx === currentExerciseIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {idx < currentExerciseIndex ? (
                        <CheckCircle size={18} weight="fill" />
                      ) : (
                        <span className="text-sm font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ex.sets}x{ex.reps} {ex.weight ? `• ${ex.weight}kg` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <Button 
              variant="ghost"
              size="sm"
              className="mb-2"
              onClick={onBack}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Treinos</h1>
                <p className="text-sm text-muted-foreground">
                  Biblioteca de treinos e execução
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={openCreateDialog}>
                    <Plus size={16} weight="bold" className="mr-2" />
                    Novo Treino
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingWorkout ? 'Editar Treino' : 'Novo Treino'}
                    </DialogTitle>
                    <DialogDescription>
                      Configure os exercícios, séries e carga do seu treino
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="workout-name">Nome do Treino *</Label>
                      <Input
                        id="workout-name"
                        value={workoutForm.name}
                        onChange={(e) => setWorkoutForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Treino de Peito e Tríceps"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workout-description">Descrição</Label>
                      <Textarea
                        id="workout-description"
                        value={workoutForm.description}
                        onChange={(e) => setWorkoutForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição opcional do treino"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Grupos Musculares</Label>
                      <div className="flex gap-2">
                        <Input
                          value={muscleGroupInput}
                          onChange={(e) => setMuscleGroupInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addMuscleGroup()
                            }
                          }}
                          placeholder="Ex: Peito, Costas..."
                        />
                        <Button type="button" onClick={addMuscleGroup} size="sm">
                          <Plus size={16} />
                        </Button>
                      </div>
                      {workoutForm.muscleGroup.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {workoutForm.muscleGroup.map((muscle, idx) => (
                            <Badge key={idx} variant="secondary" className="gap-1">
                              {muscle}
                              <button onClick={() => removeMuscleGroup(idx)}>×</button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Label>Exercícios</Label>
                      
                      {workoutForm.exercises.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {workoutForm.exercises.map((exercise, idx) => (
                            <div key={exercise.id} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{exercise.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exercise.sets}x{exercise.reps}
                                  {exercise.weight ? ` • ${exercise.weight}kg` : ''}
                                  {exercise.equipment ? ` • ${exercise.equipment}` : ''}
                                  {' • Descanso: '}{exercise.restTime}s
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeExercise(exercise.id)}
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Card className="border-dashed">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Adicionar Exercício</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="ex-name">Nome do Exercício</Label>
                              <Input
                                id="ex-name"
                                value={exerciseForm.name}
                                onChange={(e) => setExerciseForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ex: Supino Reto"
                              />
                            </div>
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="ex-equipment">Equipamento</Label>
                              <Input
                                id="ex-equipment"
                                value={exerciseForm.equipment}
                                onChange={(e) => setExerciseForm(prev => ({ ...prev, equipment: e.target.value }))}
                                placeholder="Ex: Barra, Halteres..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ex-sets">Séries</Label>
                              <Input
                                id="ex-sets"
                                type="number"
                                value={exerciseForm.sets}
                                onChange={(e) => setExerciseForm(prev => ({ ...prev, sets: Number(e.target.value) }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ex-reps">Repetições</Label>
                              <Input
                                id="ex-reps"
                                value={exerciseForm.reps}
                                onChange={(e) => setExerciseForm(prev => ({ ...prev, reps: e.target.value }))}
                                placeholder="12 ou 8-12"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ex-weight">Carga (kg)</Label>
                              <Input
                                id="ex-weight"
                                type="number"
                                value={exerciseForm.weight || ''}
                                onChange={(e) => setExerciseForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                                placeholder="Opcional"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ex-rest">Descanso (seg)</Label>
                              <Input
                                id="ex-rest"
                                type="number"
                                value={exerciseForm.restTime}
                                onChange={(e) => setExerciseForm(prev => ({ ...prev, restTime: Number(e.target.value) }))}
                              />
                            </div>
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="ex-note">Observação</Label>
                              <Input
                                id="ex-note"
                                value={exerciseForm.note}
                                onChange={(e) => setExerciseForm(prev => ({ ...prev, note: e.target.value }))}
                                placeholder="Ex: Foco na contração"
                              />
                            </div>
                          </div>
                          <Button type="button" onClick={addExercise} className="w-full" variant="secondary">
                            <Plus size={16} weight="bold" className="mr-2" />
                            Adicionar Exercício
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={saveWorkout} className="flex-1">
                      {editingWorkout ? 'Atualizar' : 'Criar'} Treino
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {(!workouts || workouts.length === 0) ? (
            <Card>
              <CardContent className="pt-16 pb-16 text-center">
                <Barbell size={48} className="mx-auto mb-4 text-muted-foreground" weight="thin" />
                <h3 className="font-semibold mb-2">Nenhum treino cadastrado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie seu primeiro treino para começar
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus size={16} weight="bold" className="mr-2" />
                  Criar Primeiro Treino
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {workouts.map(workout => (
                <Card key={workout.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Barbell size={20} weight="fill" className="text-accent" />
                          {workout.name}
                          {workout.isFavorite && (
                            <Star size={16} weight="fill" className="text-warning" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          {workout.description || 'Sem descrição'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavorite(workout.id)}
                        >
                          {workout.isFavorite ? (
                            <Star size={18} weight="fill" className="text-warning" />
                          ) : (
                            <Star size={18} />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(workout)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteWorkout(workout.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    {workout.muscleGroup.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {workout.muscleGroup.map((muscle, idx) => (
                          <Badge key={idx} variant="secondary">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {workout.exercises.length} exercícios
                    </p>
                    
                    <Button 
                      onClick={() => startWorkout(workout)}
                      className="w-full"
                    >
                      <Play size={16} weight="fill" className="mr-2" />
                      Iniciar Treino
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
