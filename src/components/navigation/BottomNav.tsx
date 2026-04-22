import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ClockCountdown,
  ChartLine,
  User,
  CalendarPlus,
  ListChecks,
} from '@phosphor-icons/react'

const navItems = [
  { to: '/hoje', label: 'Hoje', icon: ClockCountdown },
  { to: '/rotina', label: 'Rotina', icon: ListChecks },
  { to: '/planejar', label: 'Planejar', icon: CalendarPlus },
  { to: '/progresso', label: 'Progresso', icon: ChartLine },
  { to: '/perfil', label: 'Perfil', icon: User },
] as const

export function BottomNav() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-screen-lg mx-auto px-2 py-2">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all min-w-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={24} weight={isActive ? 'fill' : 'regular'} aria-hidden />
                      <span className="text-xs font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
