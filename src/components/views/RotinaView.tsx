import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Pill, 
  Lightning, 
  Drop, 
  ForkKnife, 
  Barbell, 
  CheckCircle,
  Plus
} from '@phosphor-icons/react'

type RotinaSection = 'medicamentos' | 'suplementos' | 'hidratacao' | 'refeicoes' | 'treinos' | 'habitos'

const sections = [
  {
    id: 'medicamentos' as RotinaSection,
    title: 'Medicamentos',
    description: 'Gerencie medicações e doses',
    icon: Pill,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    count: 3
  },
  {
    id: 'suplementos' as RotinaSection,
    title: 'Suplementos',
    description: 'Vitaminas e suplementação',
    icon: Lightning,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    count: 5
  },
  {
    id: 'hidratacao' as RotinaSection,
    title: 'Hidratação',
    description: 'Meta diária de água',
    icon: Drop,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    count: 1
  },
  {
    id: 'refeicoes' as RotinaSection,
    title: 'Refeições',
    description: 'Planejamento alimentar',
    icon: ForkKnife,
    color: 'text-success',
    bgColor: 'bg-success/10',
    count: 6
  },
  {
    id: 'treinos' as RotinaSection,
    title: 'Treinos',
    description: 'Biblioteca de exercícios',
    icon: Barbell,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    count: 4
  },
  {
    id: 'habitos' as RotinaSection,
    title: 'Hábitos',
    description: 'Rotinas e consistência',
    icon: CheckCircle,
    color: 'text-foreground',
    bgColor: 'bg-muted',
    count: 7
  }
]

export function RotinaView() {
  const [selectedSection, setSelectedSection] = useState<RotinaSection | null>(null)

  if (selectedSection) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-screen-lg mx-auto">
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
            <div className="p-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedSection(null)}
                className="mb-2"
              >
                ← Voltar
              </Button>
              <h1 className="text-2xl font-bold">
                {sections.find(s => s.id === selectedSection)?.title}
              </h1>
            </div>
          </div>
          
          <div className="p-4">
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                Módulo em desenvolvimento
              </p>
              <Button variant="outline">
                <Plus size={16} className="mr-2" />
                Adicionar {sections.find(s => s.id === selectedSection)?.title}
              </Button>
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
            <h1 className="text-2xl font-bold mb-1">Rotina</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todos os aspectos da sua rotina diária
            </p>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {sections.map((section) => {
            const Icon = section.icon
            
            return (
              <Card 
                key={section.id}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setSelectedSection(section.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${section.bgColor}`}>
                        <Icon size={24} className={section.color} weight="fill" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{section.count}</Badge>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
