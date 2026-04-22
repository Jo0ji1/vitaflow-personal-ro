# Ritmo - Guia de Uso

## Visão Geral

**Ritmo** é um assistente pessoal de rotina desenvolvido para ajudar você a manter consistência em saúde, autocuidado, alimentação, treino e hábitos diários. Este guia vai ajudá-lo a aproveitar ao máximo a aplicação.

---

## Funcionalidades Principais (MVP)

### 1. Timeline do Dia (Core Feature)
A **Timeline** é o coração do Ritmo. Ela organiza toda a sua rotina diária em uma única visão clara e acionável.

**Como usar:**
- Ao abrir o app, você vê imediatamente o que precisa fazer **agora**
- Events atrasados aparecem destacados em vermelho
- Próximos eventos estão organizados cronologicamente
- Eventos concluídos ficam no final, com opacidade reduzida

**Ações rápidas em cada card:**
- **Concluir**: Marca o item como feito
- **Adiar**: Reagenda para 30 minutos depois
- **Pular**: Registra que você pulou intencionalmente

### 2. Hidratação Inteligente
Acompanhe sua meta diária de água com distribuição saudável ao longo do dia.

**Recursos:**
- Meta customizável (padrão: 2500ml)
- Botões rápidos para adicionar volumes comuns (200ml, 300ml, 500ml, 750ml)
- Progresso visual em tempo real
- Cálculo automático de quanto falta para a meta

**Dica:** O app distribui sua meta ao longo de 14 horas (7h-21h) e te alerta se você está atrasado.

### 3. Score do Dia
Um indicador visual do quão bem você está mantendo sua rotina hoje.

**Composição do Score:**
- 35% - Aderência a medicamentos
- 25% - Progresso de hidratação
- 20% - Refeições concluídas
- 15% - Treino realizado
- 5% - Hábitos cumpridos

**Interpretação:**
- 80-100%: Excelente
- 60-79%: Bom progresso
- 40-59%: Atenção necessária
- 0-39%: Precisa recuperar o ritmo

---

## Navegação

O app usa uma **barra de navegação inferior** com 5 seções:

1. **Hoje**: Timeline do dia (tela principal)
2. **Rotina**: Gestão de medicamentos, refeições, treinos e hábitos
3. **Planejar**: Calendário e planejamento futuro
4. **Progresso**: Relatórios e insights
5. **Perfil**: Configurações e preferências

---

## Dados de Exemplo

O app vem pré-carregado com dados realistas para demonstração:

### Medicamentos
- Losartana 50mg (3x/dia) - medicamento crítico
- Vitamina D 2000UI (manhã)
- Ômega 3 1000mg (tarde)

### Refeições Planejadas
- Café da Manhã (9h)
- Almoço (12h30)
- Lanche da Tarde (15h30)
- Pós-Treino (18h30)
- Jantar (19h30)

### Treino
- Treino A - Peito e Tríceps (17h)

### Hábitos
- Meditação Noturna (21h)

### Hidratação
- 1100ml já consumidos (de 2500ml)
- 44% da meta

---

## Interações Principais

### Completar um Item
1. Localize o card do evento na Timeline
2. Clique no botão verde "Concluir"
3. Veja uma confirmação instantânea

### Adicionar Água
1. No card de Hidratação
2. Clique em um dos botões rápidos (200ml, 300ml, etc.)
3. Veja o progresso atualizar em tempo real

### Adiar um Item
1. Clique no ícone de relógio no card
2. O item é automaticamente remarcado para 30min depois
3. Receba uma confirmação

### Pular um Item
1. Clique no ícone de X no card
2. O item é registrado como "pulado"
3. Não afeta negativamente seu score tanto quanto deixar atrasado

---

## Conceitos Importantes

### Status de Eventos

- **Pending**: Ainda não chegou o horário
- **Late**: Passou >30min do horário sem ser concluído
- **Completed**: Foi marcado como concluído
- **Skipped**: Você escolheu pular
- **Postponed**: Foi reagendado

### Prioridades

- **Critical**: Medicamentos importantes (borda vermelha)
- **High**: Suplementos, treinos
- **Normal**: Refeições, hábitos, água

### Reorganização Automática (futura)
Quando múltiplos itens atrasam, o sistema pode sugerir reorganização inteligente:
- Itens críticos vão para "agora"
- Itens normais são redistribuídos nas próximas 2h
- Sistema respeita intervalos mínimos

---

## Dicas de Uso

### Para Máxima Eficiência
1. **Abra o app pela manhã** para ver todo o dia planejado
2. **Complete itens assim que fizer** - não deixe acumular
3. **Use os lembretes de água** - hidratação distribuída é mais saudável
4. **Revise seu score ao final do dia** para ver padrões

### Para Manter Consistência
1. Planeje sua rotina com antecedência
2. Seja realista com horários - melhor cumprí-los que ter metas impossíveis
3. Use a função "Adiar" em vez de ignorar - mantém você no controle
4. Revise e ajuste sua rotina semanalmente

### Aderência a Medicamentos
- Medicamentos são sempre marcados como **críticos**
- Recebem lembretes mais intensos
- Têm maior peso no score do dia
- Nunca deixe passar sem marcar ou pular

---

## Roadmap Futuro

### V2 - Intelligence & Planning
- Planejamento alimentar semanal completo
- Templates de refeições e rotinas
- Lista de compras automática
- Insights com IA sobre seus padrões
- Correlações entre hábitos
- Biblioteca expandida de exercícios
- Modo viagem e fim de semana

### V3 - Ecosystem & Automation
- Sincronização em nuvem
- Push notifications reais
- Integração com Apple Health / Google Fit
- Integração com wearables
- Exportação de dados
- Assistente IA conversacional
- Automações avançadas

---

## Privacidade e Dados

### Dados Locais
Atualmente, todos os dados ficam armazenados localmente no seu dispositivo usando a API `useKV` do Spark.

### Segurança Futura
A arquitetura está preparada para:
- Criptografia de dados sensíveis
- Backup seguro
- Conformidade com LGPD
- Privacy by design

---

## Suporte e Feedback

Este é um MVP (Minimum Viable Product) focado em demonstrar o conceito central: **Timeline do Dia como hub unificado de rotina**.

### Próximos Passos Sugeridos
1. Adicionar gestão completa de medicamentos com estoque
2. Implementar planejamento de refeições com templates
3. Construir modo de execução de treino com timer

---

## Tecnologias Utilizadas

- **React 19** com TypeScript
- **Tailwind CSS** com tema customizado
- **Shadcn UI** (v4) para componentes
- **Phosphor Icons** para ícones
- **date-fns** para manipulação de datas
- **Sonner** para toast notifications
- **Framer Motion** para animações
- **Spark KV** para persistência de dados

---

## Design System

### Paleta de Cores
- **Primary (Vital Teal)**: `oklch(0.65 0.15 195)` - Energia saudável, ações principais
- **Accent (Energetic Coral)**: `oklch(0.72 0.18 25)` - CTAs importantes, urgências
- **Success (Fresh Mint)**: `oklch(0.75 0.12 155)` - Confirmações, metas batidas
- **Warning (Warm Amber)**: `oklch(0.75 0.15 75)` - Itens atrasados

### Tipografia
- **Primária**: Inter (UI, textos gerais)
- **Secundária**: JetBrains Mono (números, métricas, dados)

### Princípios de UX
- Mobile-first
- Baixa fricção (máximo 2 toques para ações principais)
- Feedback instantâneo
- Hierarquia visual clara
- Animações sutis e propositais

---

## FAQ

**Q: Os dados persistem entre sessões?**
A: Sim, tudo é salvo automaticamente usando o sistema de persistência do Spark.

**Q: Posso editar eventos existentes?**
A: No MVP atual, você pode completar, adiar ou pular. Edição completa virá na V2.

**Q: Como funciona o cálculo de "atrasado"?**
A: Um item fica "late" se passou mais de 30 minutos do horário agendado sem ser concluído.

**Q: Posso usar offline?**
A: Sim, o app funciona completamente offline. Sincronização virá na V3.

**Q: Tem modo escuro?**
A: Sim! O tema escuro está implementado e funcional.

---

**Mantenha seu ritmo. Alcance suas metas. Viva com consistência.**
