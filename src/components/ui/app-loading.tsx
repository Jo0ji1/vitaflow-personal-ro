import { Skeleton } from '@/components/ui/skeleton'

/**
 * Fallback exibido enquanto um chunk de rota (lazy) carrega.
 * Aparência próxima das views: header + cards, para evitar layout shift.
 */
export function AppLoadingFallback() {
  return (
    <div className="min-h-screen bg-background pb-24" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Carregando…</span>
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
          <div className="p-4 space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
