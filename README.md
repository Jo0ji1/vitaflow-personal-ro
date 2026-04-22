# Ritmo — Assistente Pessoal de Rotina

> App mobile-first que unifica medicamentos, hidratação, refeições, treinos e hábitos em uma única timeline inteligente do dia.

Construído sobre [GitHub Spark](https://github.com/github/spark) + Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui.

## Stack

| Camada | Tecnologia |
|---|---|
| Build | Vite 7, `@vitejs/plugin-react-swc` |
| UI | React 19, Tailwind v4, shadcn/ui, Radix UI, Phosphor Icons |
| Rotas | `react-router-dom` v7 (lazy + code-splitting por rota) |
| Tema | `next-themes` (claro/escuro/sistema) |
| Estado | `@github/spark` `useKV` (persistência local), React state |
| Formulários | `react-hook-form` + `zod` |
| Notificações | `sonner` |
| Datas | `date-fns` |
| Erros | `react-error-boundary` |

## Estrutura de pastas

```
src/
├── App.tsx                 # Roteamento (React Router)
├── main.tsx                # Bootstrap: ErrorBoundary + ThemeProvider + BrowserRouter
├── ErrorFallback.tsx
├── components/
│   ├── navigation/         # BottomNav (NavLink-based)
│   ├── views/              # 5 views principais (lazy-loaded)
│   ├── rotina/             # Sub-módulos: Medicamentos, Hábitos, Refeições, Treinos, Hidratação
│   ├── timeline/           # TimelineCard
│   ├── dashboard/          # ScoreDisplay
│   ├── water/              # WaterTracker
│   └── ui/                 # shadcn primitives + AppLoadingFallback
├── lib/
│   ├── types.ts            # Tipos de domínio (User, Medication, Meal, Habit, etc)
│   ├── timeline-helpers.ts # Utils puros (sort, status, formatação, score histórico)
│   ├── timeline-sync.ts    # Gera eventos da timeline a partir das entidades
│   └── utils.ts
└── styles/
    └── theme.css           # Design tokens (Radix colors + cores do app)
```

## Navegação (rotas)

| Rota | View | Descrição |
|---|---|---|
| `/hoje` | `TimelineView` | Timeline do dia, score, próxima ação |
| `/rotina` | `RotinaView` | Hub com sub-módulos (medicamentos, hábitos, refeições, treinos, hidratação) |
| `/planejar` | `PlanejarView` | Calendário e planejamento futuro |
| `/progresso` | `ProgressoView` | Aderência, streaks, insights (dados mockados — TODO) |
| `/perfil` | `PerfilView` | Preferências, metas, tema |

`/` redireciona para `/hoje`. Rotas desconhecidas caem no mesmo redirect.

## Scripts

```bash
npm install          # Instalar dependências (obrigatório após clone)
npm run dev          # Dev server Vite (porta 5000)
npm run typecheck    # tsc -b --noEmit (strict mode habilitado)
npm run build        # tsc -b && vite build
npm run lint         # ESLint
npm run preview      # Preview do build
```

> Nota: o build agora roda type-check (antes pulava com `--noCheck`). Se quebrar, rode `npm run typecheck` para ver os erros isoladamente.

## Decisões de arquitetura

- **Rotas em vez de tab state:** deep-linking, back button nativo e code-splitting por rota.
- **`useKV`** é a camada de persistência local (provida pelo Spark). Arquitetura preparada para backend no futuro — basta trocar o hook.
- **Tema via `next-themes`:** suporta sistema/claro/escuro sem lógica manual.
- **Tailwind v4 com tokens OKLCH:** definidos em `src/styles/theme.css` para suporte robusto a wide gamut e modo escuro.
- **`timeline-sync.ts`** gera eventos da timeline a partir das entidades persistidas (medicamentos, refeições, hábitos). Qualquer CRUD que altera uma entidade reflete automaticamente na `/hoje`.

## Documentação do produto

- [`PRD.md`](PRD.md) — Product Requirements Document completo (personas, casos de uso, IA, design system, módulos)
- [`ROADMAP.md`](ROADMAP.md) — Visão de evolução
- [`STATUS_IMPLEMENTACAO.md`](STATUS_IMPLEMENTACAO.md) — Checklist funcional do MVP (o quê falta implementar)
- [`ANALISE_COMPLETA.md`](ANALISE_COMPLETA.md) / [`ANALISE_FUNCIONALIDADES.md`](ANALISE_FUNCIONALIDADES.md) — Análises detalhadas de módulos
- [`DESENVOLVIMENTO.md`](DESENVOLVIMENTO.md) / [`GUIA_DE_USO.md`](GUIA_DE_USO.md) — Guias operacionais
- [`RESUMO_EXECUTIVO.md`](RESUMO_EXECUTIVO.md) / [`RESUMO_IMPLEMENTACAO.md`](RESUMO_IMPLEMENTACAO.md) — Snapshots executivos
- [`SECURITY.md`](SECURITY.md)

## Estado atual (abril 2026)

**Implementado:**
- ✅ Timeline do dia com geração dinâmica de eventos
- ✅ CRUD: medicamentos, hábitos, refeições, treinos
- ✅ Hidratação: meta + registro rápido + progresso
- ✅ Modo execução de treino com timer de descanso (com cleanup correto)
- ✅ Tema claro/escuro/sistema persistente
- ✅ Persistência local via `useKV`
- ✅ Code-splitting por rota
- ✅ TypeScript strict mode

**Próximos passos técnicos priorizados:**
- Conectar `ProgressoView` a dados reais (hoje usa `mockStats`)
- Planejamento futuro funcional (hoje só UI)
- Sistema de notificações in-app + snooze
- Onboarding inicial
- Testes (Vitest + Testing Library)
- Revisar deps potencialmente não usadas (`three`, `d3`, `marked`, `octokit`)

## Licença

MIT (arquivos do template Spark © GitHub, Inc.). Veja [`LICENSE`](LICENSE).
