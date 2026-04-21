import { Card } from '@/components/ui/card'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ScoreDisplayProps {
  score: number
  label: string
  previousScore?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreDisplay({ score, label, previousScore, className, size = 'md' }: ScoreDisplayProps) {
  const trend = previousScore !== undefined ? score - previousScore : null
  const TrendIcon = trend === null ? Minus : trend > 0 ? TrendUp : trend < 0 ? TrendDown : Minus
  
  const scoreColor = 
    score >= 80 ? 'text-success' :
    score >= 60 ? 'text-primary' :
    score >= 40 ? 'text-warning' :
    'text-destructive'
  
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  }
  
  return (
    <Card className={cn("p-6 text-center", className)}>
      <div className={cn("font-bold font-mono mb-2", scoreColor, sizeClasses[size])}>
        {score}
        <span className="text-lg align-top">%</span>
      </div>
      
      <div className="text-sm font-medium text-muted-foreground mb-2">
        {label}
      </div>
      
      {trend !== null && trend !== 0 && (
        <div className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
          trend > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        )}>
          <TrendIcon size={14} weight="bold" />
          {Math.abs(trend)}% vs ontem
        </div>
      )}
    </Card>
  )
}
