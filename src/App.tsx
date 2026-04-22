import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { BottomNav } from '@/components/navigation/BottomNav'
import { AppLoadingFallback } from '@/components/ui/app-loading'

const TimelineView = lazy(() =>
  import('@/components/views/TimelineView').then((m) => ({ default: m.TimelineView })),
)
const RotinaView = lazy(() =>
  import('@/components/views/RotinaView').then((m) => ({ default: m.RotinaView })),
)
const PlanejarView = lazy(() =>
  import('@/components/views/PlanejarView').then((m) => ({ default: m.PlanejarView })),
)
const ProgressoView = lazy(() =>
  import('@/components/views/ProgressoView').then((m) => ({ default: m.ProgressoView })),
)
const PerfilView = lazy(() =>
  import('@/components/views/PerfilView').then((m) => ({ default: m.PerfilView })),
)

function App() {
  return (
    <>
      <Suspense fallback={<AppLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/hoje" replace />} />
          <Route path="/hoje" element={<TimelineView />} />
          <Route path="/rotina/*" element={<RotinaView />} />
          <Route path="/planejar" element={<PlanejarView />} />
          <Route path="/progresso" element={<ProgressoView />} />
          <Route path="/perfil" element={<PerfilView />} />
          <Route path="*" element={<Navigate to="/hoje" replace />} />
        </Routes>
      </Suspense>

      <BottomNav />
      <Toaster />
    </>
  )
}

export default App