import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Workout } from '@/lib/types'
import { ArrowLeft, Barbell, Plus, Play, Star } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TreinosViewProps {
  onBack: () => void
}

export function TreinosView({ onBack }: TreinosViewProps) {
  const [workouts, setWorkouts] = useKV<Workout[]>('workouts', [])
  
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
              <Button size="sm">
                <Plus size={16} weight="bold" className="mr-2" />
                Novo Treino
              </Button>
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
                <Button>
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
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      {workout.muscleGroup.map(muscle => (
                        <Badge key={muscle} variant="secondary">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {workout.exercises.length} exercícios
                    </p>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Play size={16} weight="fill" className="mr-2" />
                        Iniciar Treino
                      </Button>
                      <Button variant="outline">
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <Card className="border-dashed">
            <CardContent className="pt-6 pb-6">
              <p className="text-sm text-center text-muted-foreground">
                💡 <strong>Módulo de Treino Completo em desenvolvimento</strong>
                <br />
                <span className="text-xs">
                  Criação de exercícios, séries, timer de descanso, histórico e evolução
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
