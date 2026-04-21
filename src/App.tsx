import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { TimelineView } from '@/components/views/TimelineView'
import { PlaceholderView } from '@/components/views/PlaceholderView'
import { BottomNav } from '@/components/navigation/BottomNav'

function App() {
  const [activeTab, setActiveTab] = useState('hoje')

  return (
    <>
      {activeTab === 'hoje' && <TimelineView />}
      {activeTab === 'rotina' && (
        <PlaceholderView 
          title="Rotina" 
          description="Gerencie medicamentos, suplementos, refeições, treinos e hábitos." 
        />
      )}
      {activeTab === 'planejar' && (
        <PlaceholderView 
          title="Planejar" 
          description="Planeje sua rotina para os próximos dias e semanas." 
        />
      )}
      {activeTab === 'progresso' && (
        <PlaceholderView 
          title="Progresso" 
          description="Acompanhe sua aderência, evolução e insights." 
        />
      )}
      {activeTab === 'perfil' && (
        <PlaceholderView 
          title="Perfil" 
          description="Configurações, metas e preferências." 
        />
      )}
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Toaster />
    </>
  )
}

export default App