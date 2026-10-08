# Mapa — radar-primitivo (versão Skip 75385ef / template base)

## Rotas (projeto de teste 64536 — estrutura real hoje)
| Rota | Página | Componentes principais | Serviços |
|---|---|---|---|
| `/` | src/pages/Index.tsx | landing do template | — |
| `*` | src/pages/NotFound.tsx | 404 do template | — |

## Coleções (schema.json gerado 08/10/2026)
| Coleção | Campos principais | Regras de acesso |
|---|---|---|
| users (auth) | name, avatar, created, updated | list/view/update/delete: só o próprio id; create: fechado |

## Componentes reutilizáveis do projeto
- `src/components/ui/*` — biblioteca shadcn/ui completa (button, card, table, dialog, sheet, tabs, badge, input, label, select, alert-dialog, sonner/toast, sidebar, skeleton…)
- `src/components/Layout.tsx` — shell mínimo (Outlet)
- `src/components/skip/ConnectorButton.tsx` — conector Skip
- `src/hooks/use-mobile.tsx`, `src/lib/utils.ts` (cn)

## Padrões observados
- Template Skip: React 18 + Vite + TS + Tailwind + shadcn/ui + react-router-dom (BrowserRouter), PocketBase via `src/lib/pocketbase/client.ts`.
- Sem services de negócio ainda; sem telas de login; tema claro/escuro via tokens em `src/main.css`.
- Regras da casa (plugin): nunca editar `ui/*`, `client.ts`, `errors.ts`, `use-realtime.ts`, package.json, lockfiles, configs; dados só por `src/services/`; tokens do tema, nunca hex solto.

## Arquivos gerados que não se editam
- `.skip.config.json`, `bun.lockb`, `pnpm-lock.yaml`, `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`, `.oxfmtrc.json`, `vite-plugin-react-uid.js`, `src/lib/pocketbase/schema.json` (gerado).
