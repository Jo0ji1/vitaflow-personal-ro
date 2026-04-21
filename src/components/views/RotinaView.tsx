import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MedicamentosView } from '@/components/rotina/MedicamentosView'
import { HabitosView } from '@/components/rotina/HabitosView'
import { RefeicoesView } from '@/components/rotina/RefeicoesView'
import { TreinosView } from '@/components/rotina/TreinosView'
import { HidratacaoView } from '@/components/rotina/HidratacaoView'
import { 
  Pill, 
  Drop, 
  ForkKnife, 
  Barbell, 
  CheckCircle
} from '@phosphor-icons/react'
import { Medication, Habit } from '@/lib/types'

type RotinaSection = 'medicamentos' | 'hidratacao' | 'refeicoes' | 'treinos' | 'habitos'

export function RotinaView() {
  const [selectedSection, setSelectedSection] = useState<RotinaSection | null>(null)
  const [medications] = useKV<Medication[]>('medications', [])
  const [habits] = useKV<Habit[]>('habits', [])

  const getMedicationCount = () => {
    return (medications || []).filter(m => m.category === 'medication').length
  }

  const getSupplementCount = () => {
    return (medications || []).filter(m => m.category === 'supplement' || m.category === 'vitamin').length
  }

  const sections = [
    {
      id: 'medicamentos' as RotinaSection,
      title: 'Medicamentos & Suplementos',
      description: 'Gerencie medicações, vitaminas e doses',
      icon: Pill,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      count: (medications || []).length
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
      count: 0
    },
    {
      id: 'treinos' as RotinaSection,
      title: 'Treinos',
      description: 'Biblioteca de exercícios',
      icon: Barbell,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      count: 0
    },
    {
      id: 'habitos' as RotinaSection,
      title: 'Hábitos',
      description: 'Rotinas e consistência',
      icon: CheckCircle,
      color: 'text-foreground',
      bgColor: 'bg-muted',
      count: (habits || []).length
    }
  ]

  if (selectedSection === 'medicamentos') {
    return <MedicamentosView onBack={() => setSelectedSection(null)} />
  }

  if (selectedSection === 'habitos') {
    return <HabitosView onBack={() => setSelectedSection(null)} />
  }

  if (selectedSection === 'refeicoes') {
    return <RefeicoesView onBack={() => setSelectedSection(null)} />
  }

  if (selectedSection === 'treinos') {
    return <TreinosView onBack={() => setSelectedSection(null)} />
  }

  if (selectedSection === 'hidratacao') {
    return <HidratacaoView onBack={() => setSelectedSection(null)} />
  }

  if (selectedSection) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-screen-lg mx-auto">
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
            <div className="p-4">
              <button 
                className="text-sm text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1"
                onClick={() => setSelectedSection(null)}
              >
                ← Voltar
              </button>
              <h1 className="text-2xl font-bold">
                {sections.find(s => s.id === selectedSection)?.title}
              </h1>
            </div>
          </div>
          
          <div className="p-4">
            <Card>
              <CardContent className="pt-16 pb-16 text-center">
                <p className="text-muted-foreground mb-2">
                  Módulo em desenvolvimento
                </p>
                <p className="text-sm text-muted-foreground">
                  Este módulo será implementado em breve
                </p>
              </CardContent>
            </Card>
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
                    {section.count > 0 && (
                      <Badge variant="secondary">{section.count}</Badge>
                    )}
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
