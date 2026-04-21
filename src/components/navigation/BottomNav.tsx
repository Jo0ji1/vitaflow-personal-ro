import { cn } from '@/lib/utils'
import {  
  ClockCountdown,
  ChartLine,
  User,
  CalendarPlus,
  ListChecks
} from '@phosphor-icons/react'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: 'hoje', label: 'Hoje', icon: ClockCountdown },
  { id: 'rotina', label: 'Rotina', icon: ListChecks },
  { id: 'planejar', label: 'Planejar', icon: CalendarPlus },
  { id: 'progresso', label: 'Progresso', icon: ChartLine },
  { id: 'perfil', label: 'Perfil', icon: User },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-screen-lg mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all min-w-16",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon 
                  size={24} 
                  weight={isActive ? 'fill' : 'regular'}
                />
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
