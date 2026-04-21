import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { TimelineView } from '@/components/views/TimelineView'
import { RotinaView } from '@/components/views/RotinaView'
import { PlanejarView } from '@/components/views/PlanejarView'
import { ProgressoView } from '@/components/views/ProgressoView'
import { PerfilView } from '@/components/views/PerfilView'
import { BottomNav } from '@/components/navigation/BottomNav'
import { useKV } from '@github/spark/hooks'

function App() {
  const [activeTab, setActiveTab] = useKV<string>('active-tab', 'hoje')

  return (
    <>
      {activeTab === 'hoje' && <TimelineView />}
      {activeTab === 'rotina' && <RotinaView />}
      {activeTab === 'planejar' && <PlanejarView />}
      {activeTab === 'progresso' && <ProgressoView />}
      {activeTab === 'perfil' && <PerfilView />}
      
      <BottomNav activeTab={activeTab || 'hoje'} onTabChange={setActiveTab} />
      <Toaster />
    </>
  )
}

export default App