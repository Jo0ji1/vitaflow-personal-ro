import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TimelineEvent, EventStatus } from '@/lib/types'
import { formatTime } from '@/lib/timeline-helpers'
import { 
  CheckCircle, 
  Clock, 
  WarningCircle, 
  XCircle, 
  Pill, 
  Drop, 
  ForkKnife, 
  Barbell, 
  Target 
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface TimelineCardProps {
  event: TimelineEvent
  onComplete?: (id: string) => void
  onSkip?: (id: string) => void
  onPostpone?: (id: string) => void
  onClick?: (event: TimelineEvent) => void
}

const statusConfig: Record<EventStatus, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: 'Pendente', icon: Clock, className: 'bg-muted text-muted-foreground' },
  completed: { label: 'Concluído', icon: CheckCircle, className: 'bg-success/10 text-success border-success/20' },
  late: { label: 'Atrasado', icon: WarningCircle, className: 'bg-warning/10 text-warning border-warning/20' },
  skipped: { label: 'Pulado', icon: XCircle, className: 'bg-muted text-muted-foreground' },
  postponed: { label: 'Reagendado', icon: Clock, className: 'bg-primary/10 text-primary border-primary/20' },
}

const typeIcons: Record<string, React.ElementType> = {
  medication: Pill,
  water: Drop,
  meal: ForkKnife,
  workout: Barbell,
  habit: Target,
}

export function TimelineCard({ event, onComplete, onSkip, onPostpone, onClick }: TimelineCardProps) {
  const statusInfo = statusConfig[event.status]
  const StatusIcon = statusInfo.icon
  const TypeIcon = typeIcons[event.type] || Clock
  
  const isActionable = event.status === 'pending' || event.status === 'late'
  
  const borderColor = 
    event.status === 'late' ? 'border-l-warning' :
    event.status === 'completed' ? 'border-l-success' :
    event.priority === 'critical' ? 'border-l-accent' :
    'border-l-primary'

  return (
    <Card 
      className={cn(
        "border-l-4 transition-all hover:shadow-md cursor-pointer",
        borderColor,
        event.status === 'completed' && 'opacity-60'
      )}
      onClick={() => onClick?.(event)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-0.5 text-muted-foreground shrink-0">
              <TypeIcon size={20} weight="duotone" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {event.category}
                </span>
                {event.priority === 'critical' && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">
                    Crítico
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-base leading-tight mb-1">
                {event.title}
              </h3>
              
              {event.subtitle && (
                <p className="text-sm text-muted-foreground mb-2">
                  {event.subtitle}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono font-medium text-foreground">
                  {formatTime(event.scheduledTime)}
                </span>
                <Badge className={cn("text-xs", statusInfo.className)}>
                  <StatusIcon size={12} weight="bold" className="mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {isActionable && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                onComplete?.(event.id)
              }}
              className="flex-1"
            >
              <CheckCircle size={16} weight="bold" className="mr-1.5" />
              Concluir
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onPostpone?.(event.id)
              }}
            >
              <Clock size={16} weight="bold" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onSkip?.(event.id)
              }}
            >
              <XCircle size={16} weight="bold" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
