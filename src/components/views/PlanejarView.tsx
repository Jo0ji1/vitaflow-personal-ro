import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { CalendarBlank, CalendarCheck, Plus } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type PlanejarViewMode = 'dia' | 'semana' | 'mes'

export function PlanejarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<PlanejarViewMode>('semana')

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-1">Planejar</h1>
            <p className="text-sm text-muted-foreground">
              Organize sua rotina futura
            </p>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <Tabs value={view} onValueChange={(v) => setView(v as PlanejarViewMode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dia">Dia</TabsTrigger>
              <TabsTrigger value="semana">Semana</TabsTrigger>
              <TabsTrigger value="mes">Mês</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dia" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarBlank size={24} weight="fill" />
                    Planejar Dia
                  </CardTitle>
                  <CardDescription>
                    Selecione um dia para planejar sua rotina
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                  
                  {date && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">
                        {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure sua rotina para este dia
                      </p>
                      <Button className="w-full">
                        <Plus size={16} weight="bold" className="mr-2" />
                        Adicionar Evento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="semana" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Planejamento Semanal</CardTitle>
                  <CardDescription>
                    Organize todos os dias da semana
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia, index) => (
                    <div key={dia} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{dia}</p>
                          <p className="text-sm text-muted-foreground">
                            0 eventos planejados
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Plus size={16} />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck size={24} weight="fill" />
                    Visão Mensal
                  </CardTitle>
                  <CardDescription>
                    Gerencie eventos do mês inteiro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                  
                  <div className="mt-4 space-y-2">
                    <h3 className="font-semibold text-sm mb-3">Templates Rápidos</h3>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarCheck size={16} className="mr-2" />
                      Duplicar semana anterior
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarCheck size={16} className="mr-2" />
                      Aplicar rotina padrão
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dicas de Planejamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">1</Badge>
                <p className="text-muted-foreground">
                  Planeje com antecedência para manter consistência
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">2</Badge>
                <p className="text-muted-foreground">
                  Use templates para economizar tempo
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">3</Badge>
                <p className="text-muted-foreground">
                  Revise e ajuste seu planejamento semanalmente
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
