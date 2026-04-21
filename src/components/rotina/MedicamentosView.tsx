import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Pill, Plus, Clock, Package, WarningCircle, Pencil, Trash } from '@phosphor-icons/react'
import { Medication, MedicationCategory } from '@/lib/types'
import { toast } from 'sonner'

interface MedicamentosViewProps {
  onBack: () => void
}

export function MedicamentosView({ onBack }: MedicamentosViewProps) {
  const [medications, setMedications] = useKV<Medication[]>('medications', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'medication' as MedicationCategory,
    dosage: '',
    unit: 'mg',
    times: ['08:00'],
    continuous: true,
    instructions: '',
    stockQuantity: '',
    stockAlert: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'medication',
      dosage: '',
      unit: 'mg',
      times: ['08:00'],
      continuous: true,
      instructions: '',
      stockQuantity: '',
      stockAlert: ''
    })
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formData.name || !formData.dosage) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    const medication: Medication = {
      id: editingId || `med-${Date.now()}`,
      userId: 'current-user',
      name: formData.name,
      category: formData.category,
      dosage: formData.dosage,
      unit: formData.unit,
      frequency: { type: 'daily' },
      times: formData.times,
      startDate: new Date(),
      continuous: formData.continuous,
      instructions: formData.instructions || undefined,
      stockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : undefined,
      stockAlert: formData.stockAlert ? Number(formData.stockAlert) : undefined,
      createdAt: new Date()
    }

    if (editingId) {
      setMedications((current) => 
        (current || []).map(m => m.id === editingId ? medication : m)
      )
      toast.success('Medicamento atualizado!')
    } else {
      setMedications((current) => [...(current || []), medication])
      toast.success('Medicamento adicionado!')
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (medication: Medication) => {
    setFormData({
      name: medication.name,
      category: medication.category,
      dosage: medication.dosage,
      unit: medication.unit,
      times: medication.times,
      continuous: medication.continuous,
      instructions: medication.instructions || '',
      stockQuantity: medication.stockQuantity?.toString() || '',
      stockAlert: medication.stockAlert?.toString() || ''
    })
    setEditingId(medication.id)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setMedications((current) => (current || []).filter(m => m.id !== id))
    toast.success('Medicamento removido')
  }

  const addTime = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '12:00']
    }))
  }

  const removeTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }))
  }

  const updateTime = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? value : t)
    }))
  }

  const getCategoryLabel = (category: MedicationCategory) => {
    const labels = {
      medication: 'Medicamento',
      supplement: 'Suplemento',
      vitamin: 'Vitamina'
    }
    return labels[category]
  }

  const getCategoryColor = (category: MedicationCategory) => {
    const colors = {
      medication: 'bg-destructive/10 text-destructive border-destructive/20',
      supplement: 'bg-warning/10 text-warning border-warning/20',
      vitamin: 'bg-success/10 text-success border-success/20'
    }
    return colors[category]
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-screen-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="p-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mb-2"
            >
              ← Voltar
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Medicamentos</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie medicações, suplementos e vitaminas
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus size={16} weight="bold" className="mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? 'Editar Medicamento' : 'Novo Medicamento'}
                    </DialogTitle>
                    <DialogDescription>
                      Preencha as informações do medicamento, suplemento ou vitamina
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Omeprazol"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value as MedicationCategory })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medication">Medicamento</SelectItem>
                          <SelectItem value="supplement">Suplemento</SelectItem>
                          <SelectItem value="vitamin">Vitamina</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="dosage">Dosagem *</Label>
                        <Input
                          id="dosage"
                          value={formData.dosage}
                          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                          placeholder="20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unidade</Label>
                        <Select
                          value={formData.unit}
                          onValueChange={(value) => setFormData({ ...formData, unit: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="mcg">mcg</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="UI">UI</SelectItem>
                            <SelectItem value="cápsula">cápsula</SelectItem>
                            <SelectItem value="comprimido">comprimido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Horários</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTime}
                        >
                          <Plus size={14} weight="bold" className="mr-1" />
                          Adicionar
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.times.map((time, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              type="time"
                              value={time}
                              onChange={(e) => updateTime(index, e.target.value)}
                              className="flex-1"
                            />
                            {formData.times.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTime(index)}
                              >
                                <Trash size={16} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instruções</Label>
                      <Textarea
                        id="instructions"
                        value={formData.instructions}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        placeholder="Ex: Tomar em jejum, 30min antes do café"
                        rows={3}
                      />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="stock">Estoque</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                          placeholder="30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alert">Alerta (unid.)</Label>
                        <Input
                          id="alert"
                          type="number"
                          value={formData.stockAlert}
                          onChange={(e) => setFormData({ ...formData, stockAlert: e.target.value })}
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} className="flex-1">
                        {editingId ? 'Atualizar' : 'Salvar'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {(!medications || medications.length === 0) && (
            <Card>
              <CardContent className="pt-16 pb-16 text-center">
                <Pill size={48} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
                <p className="text-muted-foreground mb-4">
                  Nenhum medicamento cadastrado
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus size={16} weight="bold" className="mr-2" />
                  Adicionar Primeiro Medicamento
                </Button>
              </CardContent>
            </Card>
          )}

          {medications && medications.map((medication) => (
            <Card key={medication.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2.5 rounded-lg bg-destructive/10">
                      <Pill size={24} className="text-destructive" weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getCategoryColor(medication.category)}>
                          {getCategoryLabel(medication.category)}
                        </Badge>
                        {medication.stockQuantity && medication.stockAlert && 
                         medication.stockQuantity <= medication.stockAlert && (
                          <Badge variant="destructive" className="text-xs">
                            <WarningCircle size={12} weight="bold" className="mr-1" />
                            Estoque baixo
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{medication.name}</CardTitle>
                      <CardDescription>
                        {medication.dosage}{medication.unit} • {medication.times.length} dose(s) por dia
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(medication)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(medication.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Clock size={16} weight="bold" />
                    Horários
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {medication.times.map((time, index) => (
                      <Badge key={index} variant="secondary" className="font-mono">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                {medication.instructions && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {medication.instructions}
                    </p>
                  </div>
                )}

                {medication.stockQuantity !== undefined && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Package size={16} weight="bold" />
                      Estoque
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {medication.stockQuantity} unidades disponíveis
                      {medication.stockAlert && ` • Alerta em ${medication.stockAlert}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
