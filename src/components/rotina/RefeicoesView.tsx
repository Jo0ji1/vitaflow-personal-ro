import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Plus, ForkKnife, Trash, Copy, Check, Clock, X } from '@phosphor-icons/react'
import { Meal, MealItem, MealType } from '@/lib/types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RefeicoesViewProps {
  onBack: () => void
}

const MEAL_TYPES: { value: MealType; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Café da Manhã', icon: '🌅' },
  { value: 'snack', label: 'Lanche da Manhã', icon: '🍎' },
  { value: 'lunch', label: 'Almoço', icon: '🍽️' },
  { value: 'snack', label: 'Lanche da Tarde', icon: '🥤' },
  { value: 'pre-workout', label: 'Pré-Treino', icon: '💪' },
  { value: 'post-workout', label: 'Pós-Treino', icon: '🥤' },
  { value: 'dinner', label: 'Jantar', icon: '🌙' },
  { value: 'custom', label: 'Personalizado', icon: '✨' }
]

export function RefeicoesView({ onBack }: RefeicoesViewProps) {
  const [meals, setMeals] = useKV<Meal[]>('meals', [])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    type: 'breakfast',
    scheduledTime: '08:00',
    items: [],
    status: 'pending'
  })
  
  const [currentItem, setCurrentItem] = useState<Partial<MealItem>>({
    name: '',
    quantity: '',
    calories: 0
  })

  const todaysMeals = (meals || [])
    .filter(m => m.date === selectedDate)
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))

  const addItemToMeal = () => {
    if (!currentItem.name) {
      toast.error('Digite o nome do alimento')
      return
    }

    const item: MealItem = {
      id: `item-${Date.now()}`,
      name: currentItem.name,
      quantity: currentItem.quantity,
      calories: currentItem.calories
    }

    setNewMeal(prev => ({
      ...prev,
      items: [...(prev.items || []), item]
    }))

    setCurrentItem({ name: '', quantity: '', calories: 0 })
  }

  const removeItemFromMeal = (itemId: string) => {
    setNewMeal(prev => ({
      ...prev,
      items: (prev.items || []).filter(i => i.id !== itemId)
    }))
  }

  const saveMeal = () => {
    if (!newMeal.type || !newMeal.scheduledTime) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const meal: Meal = {
      id: `meal-${Date.now()}`,
      userId: 'current-user',
      date: selectedDate,
      type: newMeal.type,
      scheduledTime: newMeal.scheduledTime,
      items: newMeal.items || [],
      status: 'pending',
      note: newMeal.note
    }

    setMeals(prev => [...(prev || []), meal])
    toast.success('Refeição adicionada!', {
      description: `${getMealTypeName(meal.type)} às ${meal.scheduledTime}`
    })

    setNewMeal({
      type: 'breakfast',
      scheduledTime: '08:00',
      items: [],
      status: 'pending'
    })
    setIsAddDialogOpen(false)
  }

  const deleteMeal = (mealId: string) => {
    setMeals(prev => (prev || []).filter(m => m.id !== mealId))
    toast.success('Refeição removida')
  }

  const duplicateMeal = (meal: Meal) => {
    const newMeal: Meal = {
      ...meal,
      id: `meal-${Date.now()}`,
      date: selectedDate,
      status: 'pending',
      completedAt: undefined
    }
    setMeals(prev => [...(prev || []), newMeal])
    toast.success('Refeição duplicada')
  }

  const completeMeal = (mealId: string) => {
    setMeals(prev =>
      (prev || []).map(m =>
        m.id === mealId
          ? { ...m, status: 'completed', completedAt: new Date() }
          : m
      )
    )
    toast.success('Refeição marcada como concluída!')
  }

  const skipMeal = (mealId: string) => {
    setMeals(prev =>
      (prev || []).map(m =>
        m.id === mealId
          ? { ...m, status: 'skipped' }
          : m
      )
    )
    toast('Refeição pulada')
  }

  const getMealTypeName = (type: MealType): string => {
    const found = MEAL_TYPES.find(t => t.value === type)
    return found?.label || type
  }

  const getMealTypeIcon = (type: MealType): string => {
    const found = MEAL_TYPES.find(t => t.value === type)
    return found?.icon || '🍽️'
  }

  const getTotalCalories = (items: MealItem[]): number => {
    return items.reduce((sum, item) => sum + (item.calories || 0), 0)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <button 
              className="text-sm text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1"
              onClick={onBack}
            >
              ← Voltar
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Refeições</h1>
                <p className="text-sm text-muted-foreground">
                  Planeje sua alimentação diária
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus size={16} weight="bold" className="mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nova Refeição</DialogTitle>
                    <DialogDescription>
                      Planeje uma refeição para {format(new Date(selectedDate), "dd 'de' MMMM", { locale: ptBR })}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="meal-type">Tipo de Refeição</Label>
                      <Select
                        value={newMeal.type}
                        onValueChange={(value) => setNewMeal(prev => ({ ...prev, type: value as MealType }))}
                      >
                        <SelectTrigger id="meal-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MEAL_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meal-time">Horário</Label>
                      <Input
                        id="meal-time"
                        type="time"
                        value={newMeal.scheduledTime}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Label>Alimentos</Label>
                      
                      {(newMeal.items || []).length > 0 && (
                        <div className="space-y-2 mb-3">
                          {newMeal.items!.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity && `${item.quantity} • `}
                                  {item.calories ? `${item.calories} kcal` : ''}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeItemFromMeal(item.id)}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-5">
                          <Input
                            placeholder="Alimento"
                            value={currentItem.name}
                            onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addItemToMeal()
                              }
                            }}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            placeholder="Qtd"
                            value={currentItem.quantity}
                            onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            placeholder="Calorias"
                            value={currentItem.calories || ''}
                            onChange={(e) => setCurrentItem(prev => ({ ...prev, calories: Number(e.target.value) }))}
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={addItemToMeal}
                            className="w-full h-full"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meal-note">Observações (opcional)</Label>
                      <Textarea
                        id="meal-note"
                        placeholder="Ex: preparar com antecedência, levar marmita..."
                        value={newMeal.note || ''}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, note: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={saveMeal} className="flex-1">
                      Salvar Refeição
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-[200px]"
            />
            <Badge variant="secondary">
              {todaysMeals.length} refeições planejadas
            </Badge>
          </div>
          
          {todaysMeals.length === 0 ? (
            <Card>
              <CardContent className="pt-16 pb-16 text-center">
                <ForkKnife size={48} className="mx-auto mb-4 text-muted-foreground" weight="thin" />
                <h3 className="font-semibold mb-2">Nenhuma refeição planejada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece adicionando suas refeições do dia
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus size={16} weight="bold" className="mr-2" />
                  Adicionar Primeira Refeição
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todaysMeals.map(meal => (
                <Card key={meal.id} className={meal.status === 'completed' ? 'opacity-60' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-3xl">{getMealTypeIcon(meal.type)}</div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getMealTypeName(meal.type)}
                            {meal.status === 'completed' && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                <Check size={12} weight="bold" className="mr-1" />
                                Concluída
                              </Badge>
                            )}
                            {meal.status === 'skipped' && (
                              <Badge variant="outline" className="bg-muted">
                                <X size={12} weight="bold" className="mr-1" />
                                Pulada
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 text-sm">
                            <Clock size={14} weight="fill" />
                            {meal.scheduledTime}
                            {meal.items.length > 0 && (
                              <>
                                <span className="text-muted-foreground/50">•</span>
                                <span>{getTotalCalories(meal.items)} kcal</span>
                              </>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateMeal(meal)}
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMeal(meal.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {meal.items.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="space-y-1.5 mb-3">
                        {meal.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">• {item.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.quantity && `${item.quantity} `}
                              {item.calories ? `• ${item.calories} kcal` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {meal.note && (
                        <p className="text-xs text-muted-foreground italic mb-3">
                          {meal.note}
                        </p>
                      )}
                      
                      {meal.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => completeMeal(meal.id)}
                            className="flex-1"
                          >
                            <Check size={16} weight="bold" className="mr-2" />
                            Concluir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => skipMeal(meal.id)}
                          >
                            Pular
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
