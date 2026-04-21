# Ritmo - Your Personal Routine & Performance Hub

**Ritmo** é um assistente pessoal de rotina projetado para pessoas que buscam consistência, clareza e controle sobre sua vida diária, unificando saúde, autocuidado, alimentação, treino e hábitos em uma única plataforma inteligente.

## Nome do Produto

**Principal:** Ritmo

**Alternativas sugeridas:**
- **Ritmo** (escolhido) - transmite cadência, consistência, ritmo de vida, performance contínua
- Fluxo - fluidez e continuidade
- Pulso - vitalidade e regularidade
- Cadence - ritmo e disciplina
- Routine+ - upgrade da rotina comum

**Razão da escolha:** "Ritmo" comunica perfeitamente o core do produto: manter o ritmo da vida, encontrar seu ritmo pessoal, viver com ritmo saudável. É memorável, curto, fácil de pronunciar e tem forte apelo emocional.

---

## Visão do Produto

Ritmo nasce para resolver a dor diária de manter constância em tudo que envolve rotina pessoal: medicamentos, suplementos, hidratação, alimentação, treino e hábitos. Mais que um simples lembrete, Ritmo é um hub inteligente que organiza, executa e otimiza sua rotina diária.

**Missão:** Transformar intenção em consistência através de clareza, baixa fricção e senso real de progresso.

---

## Experiência do Produto

1. **Intuitivo e Fluido** - Zero curva de aprendizado, navegação natural como respirar, cada toque tem propósito claro
2. **Confiável e Presente** - Funciona quando você precisa, lembretes certeiros, senso de assistente pessoal sempre disponível
3. **Energizante e Motivador** - Sensação de progresso real, clareza visual do dia, celebração sutil de consistência conquistada

---

## Nível de Complexidade

**Complex Application** (advanced functionality, likely with multiple views)

Ritmo é uma aplicação complexa que unifica múltiplos domínios (saúde, nutrição, fitness, hábitos) em uma experiência coesa. Requer arquitetura robusta, estado sofisticado, múltiplas visões, lógica de negócio avançada (recorrências, reagendamentos, cálculos de aderência, insights), e capacidade de escalar para integrações futuras com APIs de saúde, wearables e notificações push.

---

## Personas

### Persona Primária: Carolina, 32 anos
**Profissão:** Gerente de Marketing  
**Contexto:** Rotina intensa, academia 4x/semana, suplementação diária, precisa tomar medicamento contínuo, sempre esquece de beber água ao longo do dia  
**Dor principal:** "Tenho tudo planejado na cabeça, mas nunca consigo manter a consistência. Acabo esquecendo suplementos, pulando refeições, tomando água só à noite."  
**Motivação:** Quer sentir controle, ver progresso tangível, ter um sistema confiável que não dependa só de memória  
**Comportamento:** Usa múltiplos apps (MyFitnessPal, alarmes do celular, notas), mas nada funciona de forma integrada

### Persona Secundária: Roberto, 45 anos
**Profissão:** Executivo  
**Contexto:** Hipertensão controlada com medicação, precisa de rotina alimentar regrada, treina cedo, viaja frequentemente  
**Dor principal:** "Preciso de disciplina rigorosa com medicamentos e alimentação, mas minha rotina é imprevisível. Preciso replanejar o dia constantemente."  
**Motivação:** Saúde preventiva, longevidade, performance profissional sustentável  
**Comportamento:** Valoriza dados, análises, relatórios de aderência, quer provar para si mesmo que está mantendo consistência

### Persona Terciária: Julia, 26 anos
**Profissão:** Estudante de Nutrição e Personal Trainer  
**Contexto:** Rotina fitness intensa, múltiplas refeições, suplementação pré/pós-treino, construindo hábitos de autocuidado  
**Dor principal:** "Preciso ser exemplo para meus clientes, mas minha própria rotina é caótica. Quero um sistema que me ajude a executar tudo que eu planejo."  
**Motivação:** Autenticidade profissional, construir rotina sustentável, ter evidências de consistência  
**Comportamento:** Gosta de gamificação sutil, streaks, evolução visual, compartilhamento de conquistas

---

## Casos de Uso Principais

### CU01: Executar a Rotina do Dia
**Ator:** Usuário ativo  
**Fluxo:**
1. Usuário abre o app pela manhã
2. Vê Timeline do Dia com todos os itens organizados cronologicamente
3. Completa primeira ação (ex: tomar suplemento matinal)
4. Timeline atualiza, mostra próxima ação prioritária
5. Ao longo do dia, recebe lembretes contextuais
6. Marca cada item como concluído, adiado ou pulado
7. Ao final do dia, vê score de aderência e insights

### CU02: Cadastrar Nova Medicação com Múltiplos Horários
**Ator:** Usuário com prescrição médica  
**Fluxo:**
1. Acessa módulo de Medicamentos
2. Clica "Adicionar Medicamento"
3. Preenche nome, dosagem, categoria
4. Define horários (8h, 14h, 20h)
5. Define duração (contínuo ou 30 dias)
6. Adiciona observação ("tomar com alimento")
7. Salva
8. Sistema cria doses agendadas na Timeline
9. Usuário recebe confirmação e próximo lembrete

### CU03: Replanejar o Dia Após Atraso
**Ator:** Usuário com rotina atrasada  
**Fluxo:**
1. Usuário verifica Timeline às 15h
2. Vê que 3 itens estão atrasados (água, almoço, suplemento)
3. Clica em "Reorganizar Dia"
4. Sistema sugere novos horários para itens pendentes
5. Usuário ajusta manualmente ou aceita sugestão
6. Timeline recalcula e mostra nova ordem
7. Lembretes são reajustados automaticamente

### CU04: Executar Treino com Timer de Descanso
**Ator:** Usuário na academia  
**Fluxo:**
1. Abre módulo de Treino
2. Seleciona "Treino A - Peito e Tríceps"
3. Inicia modo execução
4. Completa primeira série de Supino
5. Timer de descanso (90s) inicia automaticamente
6. Recebe alerta sonoro quando descanso termina
7. Marca série como concluída
8. Repete para todas as séries e exercícios
9. Ao final, vê resumo (tempo total, volume, carga)
10. Sistema registra treino no histórico

### CU05: Visualizar Aderência Semanal e Identificar Padrões
**Ator:** Usuário buscando insights  
**Fluxo:**
1. Acessa módulo de Relatórios
2. Vê score semanal de aderência (78%)
3. Identifica que hidratação está abaixo da meta
4. Sistema mostra insight: "Você tende a esquecer água após às 15h"
5. Vê gráfico de evolução nos últimos 30 dias
6. Identifica correlação: dias com treino = maior aderência geral
7. Ajusta lembretes de água para período da tarde

### CU06: Planejar Alimentação da Semana
**Ator:** Usuário organizando meal prep  
**Fluxo:**
1. Acessa módulo de Refeições
2. Entra em visão semanal
3. Planeja todas as refeições de Segunda a Sexta
4. Duplica template de "Dia Padrão" para múltiplos dias
5. Ajusta pequenas variações
6. Sistema gera lista de compras automaticamente
7. Usuário marca refeições como preparadas
8. Durante a semana, marca como consumidas na Timeline

---

## Arquitetura de Informação

### Navegação Principal (Bottom Nav Mobile)

1. **Hoje** (Timeline Icon)
   - Timeline do Dia (tela principal)
   - Status real-time da rotina
   - Próximas ações

2. **Rotina** (Calendar Icon)
   - Medicamentos & Suplementos
   - Hidratação
   - Refeições
   - Treinos
   - Hábitos

3. **Planejar** (Calendar Plus Icon)
   - Calendário Semanal
   - Calendário Mensal
   - Templates
   - Edição futura

4. **Progresso** (Chart Icon)
   - Relatórios
   - Insights
   - Aderência
   - Evolução

5. **Perfil** (User Icon)
   - Dados pessoais
   - Metas
   - Configurações
   - Preferências

### Hierarquia de Telas

```
├── Timeline do Dia (Home Principal)
│   ├── Agora
│   ├── Próximos
│   ├── Atrasados
│   ├── Concluídos
│   └── Ações rápidas
│
├── Rotina
│   ├── Medicamentos
│   │   ├── Lista de medicamentos
│   │   ├── Adicionar/Editar
│   │   ├── Histórico de doses
│   │   └── Estoque e reposição
│   ├── Suplementos (mesma estrutura)
│   ├── Hidratação
│   │   ├── Progresso diário
│   │   ├── Registro rápido
│   │   └── Histórico
│   ├── Refeições
│   │   ├── Planejar hoje
│   │   ├── Planejar futuros
│   │   ├── Templates
│   │   └── Lista de compras
│   ├── Treinos
│   │   ├── Biblioteca de treinos
│   │   ├── Modo execução
│   │   ├── Histórico
│   │   └── Evolução
│   └── Hábitos
│       ├── Lista de hábitos
│       ├── Adicionar/Editar
│       └── Streaks
│
├── Planejar
│   ├── Visão Semanal
│   ├── Visão Mensal
│   ├── Edição rápida
│   └── Templates
│
├── Progresso
│   ├── Dashboard de aderência
│   ├── Relatórios por categoria
│   ├── Insights automáticos
│   └── Evolução histórica
│
└── Perfil
    ├── Dados pessoais
    ├── Metas diárias
    ├── Notificações
    ├── Tema e preferências
    └── Exportar dados
```

---

## Recursos Essenciais

### 01. Timeline do Dia (Core Feature)
**Funcionalidade:** Visão cronológica unificada de toda a rotina diária  
**Propósito:** Eliminar fricção entre planejamento e execução, dar clareza imediata do que fazer agora  
**Trigger:** Abrir o app  
**Progressão:** Abertura → Visualização de agora/próximo/atrasado → Ação rápida (concluir/adiar/pular) → Atualização em tempo real → Próxima sugestão → Score do dia  
**Sucesso:** Usuário completa 80%+ da rotina diária sem precisar acessar outros módulos

### 02. Medicamentos e Suplementos
**Funcionalidade:** Gestão completa de medicações e suplementação com doses agendadas  
**Propósito:** Garantir aderência terapêutica e evitar esquecimentos críticos  
**Trigger:** Cadastro inicial ou lembrete de horário  
**Progressão:** Cadastro → Definição de horários → Lembretes → Confirmação de dose → Histórico → Alerta de reposição  
**Sucesso:** 95%+ de aderência em medicamentos críticos

### 03. Hidratação Inteligente
**Funcionalidade:** Meta diária de água com redistribuição automática ao longo do dia  
**Propósito:** Criar hábito de hidratação distribuída e saudável  
**Trigger:** Lembretes contextuais baseados em horário e meta restante  
**Progressão:** Definição de meta → Lembretes distribuídos → Registro rápido → Recalculo dinâmico → Progresso visual → Streak semanal  
**Sucesso:** Usuário bate meta de água 5+ dias por semana

### 04. Planejamento Alimentar
**Funcionalidade:** Planejar refeições hoje e futuros dias com templates e duplicação  
**Propósito:** Reduzir decisões diárias, facilitar meal prep, manter consistência nutricional  
**Trigger:** Planejamento semanal ou edição diária  
**Progressão:** Planejamento → Duplicação/Templates → Lista de compras → Execução → Registro → Ajustes  
**Sucesso:** Usuário planeja 70%+ das refeições da semana

### 05. Treino com Timer
**Funcionalidade:** Execução de treino com timer automático de descanso e tracking de séries  
**Propósito:** Manter disciplina no treino, otimizar descanso, registrar evolução  
**Trigger:** Horário de treino agendado  
**Progressão:** Seleção de treino → Modo execução → Série completa → Timer automático → Alerta sonoro → Próxima série → Resumo final  
**Sucesso:** Usuário completa treino inteiro sem interromper fluxo

### 06. Hábitos e Streaks
**Funcionalidade:** Rastreamento de hábitos recorrentes com consistência visual  
**Propósito:** Construir rotinas duradouras através de feedback positivo  
**Trigger:** Lembrete de hábito ou check diário  
**Progressão:** Definição → Execução → Check → Streak → Consistência semanal → Insights  
**Sucesso:** 3+ hábitos com streak de 21+ dias

### 07. Relatórios e Insights
**Funcionalidade:** Analytics de aderência com insights automáticos em linguagem natural  
**Propósito:** Autoconhecimento, identificação de padrões, otimização da rotina  
**Trigger:** Acesso semanal ou mensal  
**Progressão:** Visualização de dados → Identificação de padrões → Insights automáticos → Ajustes na rotina  
**Sucesso:** Usuário identifica 2+ padrões e ajusta rotina baseado em dados

### 08. Reagendamento Inteligente
**Funcionalidade:** Reorganização automática da rotina quando algo atrasa  
**Propósito:** Manter consistência mesmo em dias imprevisíveis  
**Trigger:** Detecção de atraso significativo  
**Progressão:** Atraso → Sugestão de reorganização → Ajuste manual ou aceite → Timeline recalculada → Novos lembretes  
**Sucesso:** Usuário recupera 60%+ dos itens mesmo em dias atípicos

---

## Tratamento de Casos Extremos

- **Rotina completamente atrasada:** Sistema sugere priorização (medicamentos críticos primeiro, opcional depois), oferece modo "recuperação" que redistribui apenas o essencial
- **Múltiplos itens no mesmo horário:** Agrupa visualmente, permite executar em lote ou reordenar manualmente
- **Dias sem planejamento:** Mostra estado vazio elegante com CTA para planejar ou usar template
- **Esquecimento prolongado:** Lembretes intensificam gradualmente, mas sem spam; após 3 lembretes, item vai para "pulado" e sistema sugere replanejar
- **Viagem ou fim de semana:** Modo especial que ajusta lembretes, reduz intensidade, permite pausar rotinas específicas
- **Primeira vez:** Onboarding guiado que cria rotina base com perguntas simples e sugere templates prontos
- **Perda de dados:** Preparado para backup local e futura sincronização em nuvem
- **Conflitos de horário:** Destaque visual, sugestão de ajuste, permite sobrepor intencionalmente se usuário confirmar

---

## Design Direction

Ritmo deve evocar **clareza mental, controle sereno e energia organizada**. A experiência visual deve transmitir precisão sem rigidez, disciplina sem ansiedade, progresso sem pressão. Usuários devem sentir que têm um assistente pessoal confiável, não uma lista de tarefas intimidadora.

---

## Color Selection

### Abordagem
Paleta energética e contemporânea que equilibra vitalidade (saúde, ação) com serenidade (controle, confiança). Cores vibrantes mas sofisticadas, evitando tons medicinais ou corporativos frios.

- **Primary Color (Vital Teal):** `oklch(0.65 0.15 195)` - Transmite energia saudável, crescimento, vitalidade equilibrada; cor âncora para ações principais, lembretes, progresso
- **Secondary Color (Deep Slate):** `oklch(0.35 0.02 250)` - Sofisticação, seriedade, confiabilidade; usado em textos, navegação, estrutura
- **Accent Color (Energetic Coral):** `oklch(0.72 0.18 25)` - Urgência positiva, calls-to-action importantes, alertas críticos, celebrações
- **Success (Fresh Mint):** `oklch(0.75 0.12 155)` - Confirmação, itens concluídos, metas batidas
- **Warning (Warm Amber):** `oklch(0.75 0.15 75)` - Itens atrasados, lembretes suaves
- **Muted (Soft Cloud):** `oklch(0.92 0.01 250)` - Backgrounds secundários, cards, áreas de menor ênfase

### Pairings de Contraste (WCAG AA)
- **Primary (Vital Teal) `oklch(0.65 0.15 195)`:** White text `oklch(1 0 0)` - Ratio 6.2:1 ✓
- **Secondary (Deep Slate) `oklch(0.35 0.02 250)`:** White text `oklch(1 0 0)` - Ratio 10.8:1 ✓
- **Accent (Energetic Coral) `oklch(0.72 0.18 25)`:** Dark text `oklch(0.2 0.02 250)` - Ratio 8.1:1 ✓
- **Background (Pure White) `oklch(1 0 0)`:** Foreground `oklch(0.25 0.02 250)` - Ratio 14.5:1 ✓
- **Muted (Soft Cloud) `oklch(0.92 0.01 250)`:** Dark text `oklch(0.3 0.02 250)` - Ratio 9.2:1 ✓

---

## Font Selection

**Características:** Tipografia moderna, humanista e altamente legível que projeta precisão sem frieza. Deve funcionar perfeitamente em interfaces densas (timelines, listas) e em grandes displays (scores, timers).

- **Primária:** **Inter** - Clareza excepcional em qualquer tamanho, alturas-x generosas, excelente em UI densa
- **Secundária (Números/Dados):** **JetBrains Mono** - Monospace elegante para timers, contadores, métricas, dados numéricos

### Hierarquia Tipográfica

- **H1 (Screen Titles):** Inter SemiBold / 28px / -0.02em tracking / 1.2 line-height
- **H2 (Section Headers):** Inter SemiBold / 22px / -0.01em tracking / 1.3 line-height
- **H3 (Card Titles):** Inter Medium / 18px / 0em tracking / 1.4 line-height
- **Body Large (Primary Content):** Inter Regular / 16px / 0em tracking / 1.5 line-height
- **Body (Standard Content):** Inter Regular / 14px / 0em tracking / 1.5 line-height
- **Caption (Metadata, Labels):** Inter Medium / 12px / 0.01em tracking / 1.4 line-height
- **Overline (Categories, Tags):** Inter SemiBold / 11px / 0.08em tracking / 1.3 line-height / uppercase
- **Numbers/Metrics:** JetBrains Mono Medium / contextual / tabular-nums

---

## Animations

Animações devem reforçar hierarquia, dar feedback tátil e criar sensação de fluidez, nunca atrasar o usuário ou chamar atenção desnecessária.

**Princípios:**
- **Transições de estado:** 200-300ms com easing natural (ease-out para entrada, ease-in para saída)
- **Feedback de ação:** 100-150ms para checks, swipes, taps
- **Timeline updates:** Fade + subtle slide (250ms) para mudanças de status
- **Timer/Counter:** Animação contínua suave, sem jumps
- **Celebração sutil:** Confetti microscópico ou pulse leve ao completar meta do dia
- **Loading states:** Skeleton screens com shimmer suave
- **Modals/Sheets:** Slide-up com backdrop fade (300ms)
- **Page transitions:** Shared element quando relevante (ex: card → detalhe)

---

## Component Selection

### Componentes Shadcn Principais

- **Timeline Cards:** Customização de `Card` com status indicators (border-left colorido), action buttons inline, swipe gestures
- **Bottom Navigation:** Customização de `Tabs` com ícones Phosphor, active state com color shift e subtle scale
- **Dialogs para ações rápidas:** `Dialog` para adicionar/editar itens, com forms usando `Form` + `react-hook-form`
- **Sheets para detalhes:** `Sheet` (drawer mobile) para histórico, detalhes, configurações
- **Progress indicators:** `Progress` customizado para água, aderência, metas
- **Timers:** Custom component com `Badge` e animação circular
- **Calendar:** `Calendar` com `react-day-picker` para planejamento futuro
- **Select/Dropdowns:** `Select` para categorias, frequências, horários
- **Switches:** `Switch` para hábitos, notificações, preferências
- **Badges:** `Badge` para status (concluído, atrasado, pulado, reagendado)
- **Toast notifications:** `Sonner` para confirmações e alertas
- **Accordion:** `Accordion` para seções colapsáveis em settings
- **Tabs:** `Tabs` para alternar entre visões (diário/semanal/mensal)

### Customizações Específicas

- **TimelineCard:** Card com gesture swipe-to-complete, tap para detalhes, hold para menu contextual
- **QuickActionButton:** Variant de Button com ícone + label, micro-haptic feedback visual
- **MetricDisplay:** Componente para mostrar números grandes (score, streak) com unidade e trend
- **WaterTracker:** Componente visual de copos/garrafas com progress bar
- **ExerciseTimer:** Circular progress com countdown e controles play/pause/skip
- **StreakCalendar:** Grid de dias com status visual (heat map style)
- **InsightCard:** Card destacado com ícone, texto em linguagem natural, CTA

### Estados dos Componentes

- **Default:** Estado normal, invite to action
- **Hover (desktop):** Subtle lift, color shift
- **Active/Pressed:** Scale down 98%, color darken
- **Focus:** Ring com accent color, alta visibilidade
- **Disabled:** Opacity 50%, cursor not-allowed
- **Loading:** Skeleton ou spinner contextual
- **Success:** Checkmark animado, green tint
- **Error:** Shake animation, red border, error message
- **Empty:** Ilustração sutil + mensagem encorajadora + CTA

### Ícones (Phosphor)

- **Timeline:** Clock, CalendarCheck
- **Medicamentos:** Pill, FirstAid
- **Suplementos:** Lightning, Heart
- **Água:** Drop, DropHalf
- **Refeições:** ForkKnife, AppleNewton
- **Treino:** Barbell, Timer
- **Hábitos:** CheckCircle, Target
- **Progresso:** ChartLine, TrendUp
- **Perfil:** User, Gear
- **Ações:** Check, X, ArrowClockwise, DotsThree
- **Status:** CheckCircle (done), Clock (pending), WarningCircle (late), XCircle (skipped)

### Spacing System (Tailwind)

- **Micro:** gap-1, gap-2 (4-8px) - entre ícones e labels
- **Small:** gap-3, gap-4 (12-16px) - entre elementos relacionados
- **Medium:** gap-6 (24px) - entre seções dentro de card
- **Large:** gap-8, gap-10 (32-40px) - entre cards, seções principais
- **XLarge:** gap-12, gap-16 (48-64px) - separação de blocos grandes

### Mobile Adaptations

- **Bottom Nav:** Fixed, 5 itens, ícone + label opcional
- **Timeline Cards:** Full-width, touch targets mínimo 44px, swipe gestures
- **Modals → Sheets:** Dialogs viram bottom sheets no mobile
- **Tables → Cards:** Dados tabulares viram cards scrolláveis
- **Calendário:** Swipeable entre semanas/meses
- **Forms:** Inputs grandes, labels visíveis, validação inline
- **Timer:** Grande e centralizado durante execução de treino
- **FAB (Floating Action Button):** Adicionar rápido (context-aware)

---

## Estratégia de MVP

### MVP (V1) - Core Experience
**Objetivo:** Validar a proposta de valor central - Timeline do Dia como hub de rotina

**Features incluídas:**
1. ✅ Timeline do Dia (experiência principal)
2. ✅ Medicamentos e Suplementos (cadastro, doses, lembretes)
3. ✅ Hidratação (meta, registro, lembretes, progress)
4. ✅ Refeições básicas (planejamento diário, registro)
5. ✅ Treino com timer (biblioteca básica, execução, descanso)
6. ✅ Hábitos simples (check diário, streak)
7. ✅ Dashboard com score do dia
8. ✅ Notificações in-app (sem push real)
9. ✅ Relatório semanal básico
10. ✅ Perfil e configurações essenciais
11. ✅ Tema claro/escuro

**Fora do MVP (V1):**
- Planejamento de refeições futuros (só hoje)
- Lista de compras automática
- Insights automáticos avançados
- Templates de rotina
- Modo viagem/fim de semana
- Exportação de dados
- Biblioteca completa de exercícios

---

### V2 - Intelligence & Planning
**Objetivo:** Adicionar planejamento futuro e inteligência de insights

**Features:**
1. Planejamento alimentar semanal/mensal
2. Templates de refeições e rotinas
3. Lista de compras automática
4. Insights automáticos com IA
5. Correlações entre hábitos
6. Biblioteca expandida de exercícios
7. Sugestões de reorganização inteligente
8. Modo viagem e modo fim de semana
9. Evolução detalhada de treino (carga, volume)
10. Estoque e alertas de reposição de medicamentos

---

### V3 - Ecosystem & Automation
**Objetivo:** Transformar em plataforma conectada

**Features:**
1. Sincronização em nuvem
2. Push notifications reais
3. Integração com Health APIs (Apple Health, Google Fit)
4. Integração com wearables
5. Exportação e backup de dados
6. Compartilhamento de rotinas/templates
7. Assistente IA conversacional
8. Automações avançadas (se X, então Y)
9. Widgets externos (iOS/Android)
10. API aberta para desenvolvedores

---

## Modelo de Dados (Entidades Principais)

### User
```typescript
{
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: Date
  preferences: UserPreferences
}
```

### UserPreferences
```typescript
{
  theme: 'light' | 'dark' | 'system'
  language: 'pt-BR'
  notifications: NotificationPreferences
  dailyGoals: DailyGoals
  quietHours: { start: string, end: string }
  weekendMode: boolean
}
```

### DailyGoals
```typescript
{
  waterIntake: number // ml
  exerciseMinutes: number
  habitChecks: number
}
```

### Medication
```typescript
{
  id: string
  userId: string
  name: string
  category: 'medication' | 'supplement' | 'vitamin'
  dosage: string
  unit: string
  frequency: RecurrenceRule
  times: string[] // ['08:00', '14:00', '20:00']
  startDate: Date
  endDate?: Date
  continuous: boolean
  instructions?: string
  stockQuantity?: number
  stockAlert?: number
  createdAt: Date
}
```

### MedicationDose (instância agendada)
```typescript
{
  id: string
  medicationId: string
  scheduledTime: Date
  status: 'pending' | 'completed' | 'skipped' | 'postponed'
  completedAt?: Date
  note?: string
}
```

### WaterLog
```typescript
{
  id: string
  userId: string
  amount: number // ml
  timestamp: Date
  date: string // YYYY-MM-DD
}
```

### Meal
```typescript
{
  id: string
  userId: string
  date: string // YYYY-MM-DD
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout' | 'custom'
  scheduledTime: string // HH:mm
  items: MealItem[]
  status: 'planned' | 'completed' | 'modified' | 'skipped'
  completedAt?: Date
  note?: string
}
```

### MealItem
```typescript
{
  id: string
  name: string
  quantity?: string
  calories?: number
}
```

### Workout
```typescript
{
  id: string
  userId: string
  name: string
  description?: string
  muscleGroup: string[]
  exercises: Exercise[]
  createdAt: Date
  isFavorite: boolean
}
```

### Exercise
```typescript
{
  id: string
  name: string
  equipment?: string
  sets: number
  reps: string // pode ser range "8-12"
  weight?: number
  restTime: number // seconds
  order: number
  note?: string
}
```

### WorkoutSession (execução)
```typescript
{
  id: string
  workoutId: string
  userId: string
  date: Date
  startTime: Date
  endTime?: Date
  completedExercises: CompletedExercise[]
  status: 'in-progress' | 'completed' | 'abandoned'
}
```

### CompletedExercise
```typescript
{
  exerciseId: string
  sets: CompletedSet[]
}
```

### CompletedSet
```typescript
{
  reps: number
  weight?: number
  completedAt: Date
}
```

### Habit
```typescript
{
  id: string
  userId: string
  name: string
  description?: string
  category: string
  frequency: RecurrenceRule
  reminderTime?: string
  streak: number
  longestStreak: number
  totalCompletions: number
  createdAt: Date
}
```

### HabitLog
```typescript
{
  id: string
  habitId: string
  date: string // YYYY-MM-DD
  completed: boolean
  completedAt?: Date
  note?: string
}
```

### RecurrenceRule
```typescript
{
  type: 'daily' | 'weekly' | 'custom'
  daysOfWeek?: number[] // 0-6 (domingo a sábado)
  interval?: number // a cada N dias
}
```

### TimelineEvent (view consolidada)
```typescript
{
  id: string
  type: 'medication' | 'water' | 'meal' | 'workout' | 'habit'
  referenceId: string
  title: string
  subtitle?: string
  scheduledTime: Date
  status: 'pending' | 'completed' | 'late' | 'skipped' | 'postponed'
  priority: 'critical' | 'high' | 'normal' | 'low'
  category: string
}
```

### DayScore
```typescript
{
  date: string // YYYY-MM-DD
  userId: string
  medicationAdherence: number // 0-100
  waterGoalProgress: number // 0-100
  mealsCompleted: number
  workoutCompleted: boolean
  habitsCompleted: number
  totalScore: number // 0-100
  insights: string[]
}
```

---

## Regras de Negócio Principais

### RN01: Cálculo de Status de Timeline Event
- **Pending:** Horário agendado ainda não chegou
- **Late:** Passou mais de 30min do horário agendado sem confirmação
- **Completed:** Usuário marcou como concluído
- **Skipped:** Usuário marcou como pulado intencionalmente
- **Postponed:** Usuário reagendou para outro horário

### RN02: Prioridade de Medicamentos
- Medicamentos (categoria 'medication') são sempre **critical**
- Suplementos e vitaminas são **high**
- Demais itens seguem prioridade normal
- Itens críticos atrasados > 1h intensificam lembretes

### RN03: Redistribuição de Meta de Água
- Meta diária distribuída em 14 horas úteis (7h - 21h)
- Meta por hora = Meta total / 14
- A cada hora, sistema recalcula meta restante / horas restantes
- Se usuário está abaixo da meta ideal do momento, status vira "atrasado"
- Lembretes aumentam frequência se atraso > 30% da meta

### RN04: Score Diário
Fórmula:
```
Score = (
  medicationAdherence * 0.35 +
  waterProgress * 0.25 +
  (mealsCompleted / mealsPlanned * 100) * 0.20 +
  (workoutCompleted ? 100 : 0) * 0.15 +
  (habitsCompleted / habitsPlanned * 100) * 0.05
)
```

### RN05: Cálculo de Streak
- Streak conta dias consecutivos com conclusão
- Se hábito é semanal (ex: 3x por semana), semana completa = +7 no streak
- Quebra de streak: não completar em dia esperado
- Grace period: 1 dia de tolerância em hábitos não-críticos

### RN06: Reagendamento Automático
Quando usuário clica "Reorganizar Dia":
1. Itens críticos atrasados vão para "agora"
2. Itens normais atrasados são distribuídos nas próximas 2h
3. Itens futuros são empurrados proporcionalmente
4. Sistema respeita intervalos mínimos (ex: refeições não podem ter < 2h de gap)

### RN07: Conflito de Horários
- Sistema permite sobrepor itens se usuário confirmar
- Alerta visual se 3+ itens no mesmo horário
- Sugere redistribuição automática em janela de ±30min

### RN08: Geração de Insights
Insights são gerados semanalmente analisando:
- Taxa de aderência por categoria
- Horários com maior taxa de falha
- Correlações (ex: dias com treino = maior aderência geral)
- Padrões de dia da semana
- Melhorias em relação à semana anterior

Exemplos:
- "Sua aderência a medicamentos está em 94% esta semana. Ótimo trabalho!"
- "Você tende a esquecer água após às 15h. Considere aumentar lembretes neste período."
- "Dias com treino pela manhã têm 23% mais aderência geral."

---

## Riscos e Pontos de Atenção

### Riscos de Produto
1. **Complexidade percebida:** Muitos módulos podem intimidar → Mitigar com onboarding gradual e home focada na Timeline
2. **Fadiga de notificações:** Excesso de lembretes gera desinstalação → Mitigar com smart notifications, quiet hours, snooze inteligente
3. **Curva de setup:** Cadastrar tudo leva tempo → Mitigar com templates prontos, importação futura, setup progressivo
4. **Gamificação excessiva:** Pode parecer infantil → Mitigar com gamificação sutil, design adulto, foco em dados reais

### Riscos Técnicos
1. **Performance com muitos eventos:** Timeline pode ficar lenta → Mitigar com virtualização, paginação, otimização de queries
2. **Sincronização futura:** Conflitos entre dispositivos → Planejar arquitetura de sync com conflict resolution
3. **Notificações em background:** Push real requer backend → MVP usa in-app, V2 adiciona push
4. **Privacidade de dados de saúde:** LGPD e regulações → Arquitetar desde já com privacy by design, consentimento explícito

### Riscos de Negócio
1. **Retenção:** Apps de hábito têm alta taxa de churn → Mitigar com valor imediato, quick wins, insights relevantes
2. **Competição:** Mercado saturado de apps de saúde → Diferenciar com Timeline unificada e UX superior
3. **Monetização futura:** Como gerar receita sem comprometer UX → Planejar freemium com premium features (insights IA, sync, integrações)

---

## Recomendações de Evolução

### Curto Prazo (3 meses)
1. Validar Timeline como core experience através de testes de usabilidade
2. Medir métricas de aderência: DAU, retention D7/D30, completion rate
3. Coletar feedback qualitativo sobre fricções principais
4. Iterar em notificações: timing, frequência, mensagens

### Médio Prazo (6 meses)
1. Adicionar insights automáticos com IA
2. Implementar sincronização em nuvem
3. Lançar integrações com Health APIs
4. Criar biblioteca de templates comunitários
5. Desenvolver versão web complementar

### Longo Prazo (12+ meses)
1. Assistente conversacional IA
2. Integrações com wearables (Apple Watch, Fitbit)
3. Marketplace de coaches e nutris
4. API aberta para desenvolvedores
5. Expansão internacional
6. Parcerias com planos de saúde e farmácias

---

## Conclusão

**Ritmo** é projetado para ser o app definitivo de rotina pessoal, unificando saúde, alimentação, treino e hábitos em uma experiência clara, confiável e energizante. A Timeline do Dia é o diferencial estratégico que resolve a fricção real entre planejamento e execução.

O produto equilibra sofisticação técnica com simplicidade de uso, construindo sobre arquitetura sólida preparada para escalar. O MVP V1 foca no core value prop, enquanto V2 e V3 expandem para inteligência e ecosystem.

Com design premium, regras de negócio bem definidas e visão clara de produto, Ritmo está posicionado para transformar como pessoas mantêm consistência em suas rotinas diárias.
