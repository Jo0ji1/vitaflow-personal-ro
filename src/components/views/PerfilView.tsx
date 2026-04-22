import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Bell,
  Palette,
  Target,
  Moon,
  Sun,
  Desktop,
  Download,
  Shield,
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export function PerfilView() {
  const [userName, setUserName] = useKV<string>('user-name', 'Usuário')
  const [waterGoal, setWaterGoal] = useKV<number>('water-goal', 2500)
  const [notificationsEnabled, setNotificationsEnabled] = useKV<boolean>('notifications-enabled', true)

  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita mismatch de hidratação — o tema só é conhecido após mount.
  useEffect(() => {
    setMounted(true)
  }, [])

  const [tempName, setTempName] = useState(userName || 'Usuário')
  const [tempWaterGoal, setTempWaterGoal] = useState(waterGoal || 2500)

  const handleSaveProfile = () => {
    setUserName(tempName)
    toast.success('Perfil atualizado!')
  }

  const handleSaveGoals = () => {
    setWaterGoal(tempWaterGoal)
    toast.success('Metas atualizadas!')
  }

  const themeLabel =
    theme === 'system' ? 'Sistema' : resolvedTheme === 'dark' ? 'Escuro' : 'Claro'

  const ThemeIcon = !mounted
    ? Desktop
    : theme === 'system'
    ? Desktop
    : resolvedTheme === 'dark'
    ? Moon
    : Sun

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'] as const
    const current = (theme as (typeof order)[number]) ?? 'system'
    const next = order[(order.indexOf(current) + 1) % order.length]
    setTheme(next)
    toast.success(`Tema: ${next === 'system' ? 'sistema' : next === 'dark' ? 'escuro' : 'claro'}`)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-1">Perfil</h1>
            <p className="text-sm text-muted-foreground">
              Configurações e preferências
            </p>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} weight="fill" aria-hidden />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Gerencie seus dados básicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              
              <Button onClick={handleSaveProfile} className="w-full">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} weight="fill" aria-hidden />
                Metas Diárias
              </CardTitle>
              <CardDescription>
                Configure suas metas pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="water-goal">Meta de Água (ml)</Label>
                <Input
                  id="water-goal"
                  type="number"
                  inputMode="numeric"
                  min={500}
                  max={6000}
                  value={tempWaterGoal}
                  onChange={(e) => setTempWaterGoal(Number(e.target.value))}
                  placeholder="2500"
                />
                <p className="text-xs text-muted-foreground">
                  Recomendado: 2000-3000ml por dia
                </p>
              </div>
              
              <Button onClick={handleSaveGoals} className="w-full">
                Salvar Metas
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} weight="fill" aria-hidden />
                Notificações
              </CardTitle>
              <CardDescription>
                Gerencie lembretes e alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-toggle">Notificações Ativas</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber lembretes de rotina
                  </p>
                </div>
                <Switch
                  id="notifications-toggle"
                  checked={notificationsEnabled ?? true}
                  onCheckedChange={setNotificationsEnabled}
                  aria-label="Ativar notificações"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Horário Silencioso</p>
                <p className="text-xs text-muted-foreground">
                  Em desenvolvimento: Configure horários sem notificações
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} weight="fill" aria-hidden />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a interface do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    {mounted ? themeLabel : 'Carregando…'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={cycleTheme}
                  aria-label={`Alternar tema. Atual: ${mounted ? themeLabel : 'sistema'}`}
                >
                  <ThemeIcon size={20} weight="fill" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} weight="fill" aria-hidden />
                Dados e Privacidade
              </CardTitle>
              <CardDescription>
                Gerencie seus dados pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download size={16} className="mr-2" aria-hidden />
                Exportar Dados
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Seus dados são armazenados localmente e de forma segura. 
                Nenhuma informação é compartilhada com terceiros.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-muted">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">Ritmo v1.0.0</p>
                <p className="text-xs text-muted-foreground">
                  Seu assistente pessoal de rotina
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
