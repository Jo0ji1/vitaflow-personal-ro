import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendUp, 
  TrendDown,
  Minus,
  Fire,
  Target,
  Calendar,
  CheckCircle
} from '@phosphor-icons/react'

const mockStats = {
  thisWeek: {
    medicationAdherence: 94,
    waterGoal: 86,
    mealsCompleted: 18,
    mealsPlanned: 21,
    workoutsCompleted: 4,
    workoutsPlanned: 4,
    habitsCompleted: 28,
    habitsPlanned: 35,
    totalScore: 88
  },
  lastWeek: {
    totalScore: 82
  },
  streaks: {
    medication: 14,
    water: 7,
    workout: 4
  }
}

const insights = [
  {
    id: 1,
    type: 'positive',
    message: 'Sua aderência a medicamentos está excelente! Mantenha o ritmo.',
    icon: CheckCircle,
    color: 'text-success'
  },
  {
    id: 2,
    type: 'attention',
    message: 'Você tende a esquecer água após às 15h. Considere aumentar lembretes.',
    icon: Target,
    color: 'text-warning'
  },
  {
    id: 3,
    type: 'insight',
    message: 'Dias com treino pela manhã têm 23% mais aderência geral.',
    icon: Fire,
    color: 'text-primary'
  }
]

export function ProgressoView() {
  const scoreDiff = mockStats.thisWeek.totalScore - mockStats.lastWeek.totalScore
  const isPositive = scoreDiff > 0
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-1">Progresso</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe sua evolução e insights
            </p>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold">
                    {mockStats.thisWeek.totalScore}%
                  </CardTitle>
                  <CardDescription>Score Semanal</CardDescription>
                </div>
                <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {isPositive ? <TrendUp size={20} weight="bold" /> : <TrendDown size={20} weight="bold" />}
                  <span className="font-semibold">{Math.abs(scoreDiff)}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={mockStats.thisWeek.totalScore} className="h-2" />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <div className="text-2xl font-bold text-destructive mb-1">
                  {mockStats.streaks.medication}
                </div>
                <div className="text-xs text-muted-foreground">
                  dias seguidos
                </div>
                <div className="text-xs font-medium mt-1">
                  Medicação
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {mockStats.streaks.water}
                </div>
                <div className="text-xs text-muted-foreground">
                  dias seguidos
                </div>
                <div className="text-xs font-medium mt-1">
                  Hidratação
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {mockStats.streaks.workout}
                </div>
                <div className="text-xs text-muted-foreground">
                  dias seguidos
                </div>
                <div className="text-xs font-medium mt-1">
                  Treino
                </div>
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
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Medicamentos</span>
                      <span className="text-muted-foreground">{mockStats.thisWeek.medicationAdherence}%</span>
                    </div>
                    <Progress value={mockStats.thisWeek.medicationAdherence} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Hidratação</span>
                      <span className="text-muted-foreground">{mockStats.thisWeek.waterGoal}%</span>
                    </div>
                    <Progress value={mockStats.thisWeek.waterGoal} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Refeições</span>
                      <span className="text-muted-foreground">
                        {Math.round((mockStats.thisWeek.mealsCompleted / mockStats.thisWeek.mealsPlanned) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(mockStats.thisWeek.mealsCompleted / mockStats.thisWeek.mealsPlanned) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Treinos</span>
                      <span className="text-muted-foreground">
                        {Math.round((mockStats.thisWeek.workoutsCompleted / mockStats.thisWeek.workoutsPlanned) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(mockStats.thisWeek.workoutsCompleted / mockStats.thisWeek.workoutsPlanned) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Hábitos</span>
                      <span className="text-muted-foreground">
                        {Math.round((mockStats.thisWeek.habitsCompleted / mockStats.thisWeek.habitsPlanned) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(mockStats.thisWeek.habitsCompleted / mockStats.thisWeek.habitsPlanned) * 100} 
                      className="h-2" 
                    />
                  </div>
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
              <CardDescription>
                Análises automáticas do seu comportamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight) => {
                const Icon = insight.icon
                return (
                  <div 
                    key={insight.id}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                  >
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
