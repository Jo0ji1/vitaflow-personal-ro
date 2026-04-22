import { TimelineEvent, WaterLog } from './types'
import { addHours, addMinutes, subHours, subMinutes, startOfDay } from 'date-fns'

export function generateMockTimelineEvents(): TimelineEvent[] {
  const now = new Date()
  
  return [
    {
      id: 'event-1',
      type: 'medication',
      referenceId: 'med-1',
      title: 'Omeprazol 20mg',
      subtitle: 'Em jejum, 30min antes do café',
      scheduledTime: subHours(now, 2),
      status: 'late',
      priority: 'critical',
      category: 'medication',
      metadata: { dosage: '20mg', unit: 'cápsula' }
    },
    {
      id: 'event-2',
      type: 'meal',
      referenceId: 'meal-1',
      title: 'Café da Manhã',
      subtitle: '2 ovos, aveia, banana e café',
      scheduledTime: subHours(now, 1.5),
      status: 'late',
      priority: 'normal',
      category: 'breakfast',
      metadata: { calories: 450 }
    },
    {
      id: 'event-3',
      type: 'medication',
      referenceId: 'med-2',
      title: 'Vitamina D 2000 UI',
      subtitle: 'Junto com a primeira refeição',
      scheduledTime: subMinutes(now, 45),
      status: 'late',
      priority: 'high',
      category: 'supplement',
      metadata: { dosage: '2000 UI', unit: 'cápsula' }
    },
    {
      id: 'event-4',
      type: 'medication',
      referenceId: 'med-3',
      title: 'Ômega 3',
      subtitle: '1 cápsula',
      scheduledTime: addMinutes(now, 15),
      status: 'pending',
      priority: 'high',
      category: 'supplement',
      metadata: { dosage: '1000mg', unit: 'cápsula' }
    },
    {
      id: 'event-5',
      type: 'habit',
      referenceId: 'habit-1',
      title: 'Alongamento Matinal',
      subtitle: '10 minutos de mobilidade',
      scheduledTime: addMinutes(now, 30),
      status: 'pending',
      priority: 'normal',
      category: 'exercise',
      metadata: { duration: 10 }
    },
    {
      id: 'event-6',
      type: 'meal',
      referenceId: 'meal-2',
      title: 'Lanche da Manhã',
      subtitle: 'Iogurte grego com granola',
      scheduledTime: addHours(now, 1),
      status: 'pending',
      priority: 'normal',
      category: 'snack',
      metadata: { calories: 280 }
    },
    {
      id: 'event-7',
      type: 'meal',
      referenceId: 'meal-3',
      title: 'Almoço',
      subtitle: 'Frango grelhado, arroz integral, brócolis',
      scheduledTime: addHours(now, 2.5),
      status: 'pending',
      priority: 'normal',
      category: 'lunch',
      metadata: { calories: 620 }
    },
    {
      id: 'event-8',
      type: 'medication',
      referenceId: 'med-4',
      title: 'Multivitamínico',
      subtitle: 'Junto com o almoço',
      scheduledTime: addHours(now, 2.5),
      status: 'pending',
      priority: 'high',
      category: 'supplement',
      metadata: { dosage: '1', unit: 'comprimido' }
    },
    {
      id: 'event-9',
      type: 'meal',
      referenceId: 'meal-4',
      title: 'Lanche da Tarde',
      subtitle: 'Frutas e castanhas',
      scheduledTime: addHours(now, 4),
      status: 'pending',
      priority: 'normal',
      category: 'snack',
      metadata: { calories: 200 }
    },
    {
      id: 'event-10',
      type: 'meal',
      referenceId: 'meal-5',
      title: 'Pré-Treino',
      subtitle: 'Banana e pasta de amendoim',
      scheduledTime: addHours(now, 5),
      status: 'pending',
      priority: 'normal',
      category: 'pre-workout',
      metadata: { calories: 220 }
    },
    {
      id: 'event-11',
      type: 'workout',
      referenceId: 'workout-1',
      title: 'Treino de Peito e Tríceps',
      subtitle: '8 exercícios, ~60 minutos',
      scheduledTime: addHours(now, 5.5),
      status: 'pending',
      priority: 'normal',
      category: 'workout',
      metadata: { duration: 60, exercises: 8 }
    },
    {
      id: 'event-12',
      type: 'medication',
      referenceId: 'med-5',
      title: 'Creatina 5g',
      subtitle: 'Pós-treino',
      scheduledTime: addHours(now, 6.5),
      status: 'pending',
      priority: 'high',
      category: 'supplement',
      metadata: { dosage: '5g', unit: 'pó' }
    },
    {
      id: 'event-13',
      type: 'meal',
      referenceId: 'meal-6',
      title: 'Pós-Treino',
      subtitle: 'Whey protein e dextrose',
      scheduledTime: addHours(now, 6.5),
      status: 'pending',
      priority: 'normal',
      category: 'post-workout',
      metadata: { calories: 180 }
    },
    {
      id: 'event-14',
      type: 'meal',
      referenceId: 'meal-7',
      title: 'Jantar',
      subtitle: 'Salmão, batata doce, salada',
      scheduledTime: addHours(now, 8),
      status: 'pending',
      priority: 'normal',
      category: 'dinner',
      metadata: { calories: 580 }
    },
    {
      id: 'event-15',
      type: 'medication',
      referenceId: 'med-6',
      title: 'Magnésio 300mg',
      subtitle: 'Após o jantar',
      scheduledTime: addHours(now, 8.5),
      status: 'pending',
      priority: 'high',
      category: 'supplement',
      metadata: { dosage: '300mg', unit: 'comprimido' }
    },
    {
      id: 'event-16',
      type: 'habit',
      referenceId: 'habit-2',
      title: 'Leitura',
      subtitle: '30 minutos antes de dormir',
      scheduledTime: addHours(now, 10),
      status: 'pending',
      priority: 'low',
      category: 'habit',
      metadata: { duration: 30 }
    },
    {
      id: 'event-17',
      type: 'medication',
      referenceId: 'med-7',
      title: 'Melatonina 3mg',
      subtitle: '1 hora antes de dormir',
      scheduledTime: addHours(now, 11),
      status: 'pending',
      priority: 'normal',
      category: 'supplement',
      metadata: { dosage: '3mg', unit: 'comprimido' }
    },
    {
      id: 'event-18',
      type: 'habit',
      referenceId: 'habit-3',
      title: 'Rotina Noturna',
      subtitle: 'Skincare e preparação para dormir',
      scheduledTime: addHours(now, 11.5),
      status: 'pending',
      priority: 'normal',
      category: 'habit',
      metadata: { duration: 15 }
    }
  ]
}

export function generateMockWaterLogs(): WaterLog[] {
  const now = new Date()
  const today = startOfDay(now)
  
  return [
    {
      id: 'water-1',
      userId: 'current-user',
      amount: 300,
      timestamp: subHours(now, 3),
      date: today.toISOString().split('T')[0]
    },
    {
      id: 'water-2',
      userId: 'current-user',
      amount: 250,
      timestamp: subHours(now, 2),
      date: today.toISOString().split('T')[0]
    },
    {
      id: 'water-3',
      userId: 'current-user',
      amount: 200,
      timestamp: subMinutes(now, 45),
      date: today.toISOString().split('T')[0]
    },
    {
      id: 'water-4',
      userId: 'current-user',
      amount: 300,
      timestamp: subMinutes(now, 15),
      date: today.toISOString().split('T')[0]
    }
  ]
}

export function seedMockData() {
  const events = generateMockTimelineEvents()
  const waterLogs = generateMockWaterLogs()
  
  return {
    'timeline-events': events,
    'water-logs-today': waterLogs,
    'water-goal': 2500,
    'today-score': 68
  }
}
