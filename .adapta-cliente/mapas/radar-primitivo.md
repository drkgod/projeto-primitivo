# Mapa — radar-primitivo (versão Skip 64536 a4a9e73 / 64528 e28d4c1)

## Rotas (64536 — teste; 64528 recebeu as mesmas telas sem a demo)

| Rota | Página | Componentes principais | Serviços |
| --- | --- | --- | --- |
| `/` | src/pages/Index.tsx | landing do template | — |
| `/perfis` | src/pages/Perfis.tsx | lista (tabela/cards), BadgeEstado | perfis.ts |
| `/perfis/:id` | src/pages/PerfilEditar.tsx | formulário por seções (6 cartões) | perfis.ts |
| `/demo`, `/demo/empresa/:id`, `/demo/perfis` | demo (só 64536) | DemoShell, MeuDia, FichaEmpresa, PerfisDemo | fixtures |
| `*` | src/pages/NotFound.tsx | 404 do template | — |

## Coleções (64536 e 64528 — migrações 0001/0002/0004; 0003 só no teste)

| Coleção | Campos principais | Regras de acesso |
| --- | --- | --- |
| users (auth) | name, avatar, created, updated | só o próprio id; create fechado |
| perfis_busca | nome, rota (select), rota_comercial, estado (select), versao, perfil_base, ufs/municipios/termos_segmento/atividades_aceitas/culturas/canais/dias_execucao/faixas_liberadas (json), funcionarios_min/max, capacidade_dia/semana, teto_creditos_mes (number), familias_cargo/criterios/faixas/contas_excluidas (json), hora_fila, ativado_por (relation users), ativado_em (date) | list/view/create/update: logado; delete: null (superusuário) |
| perfis_versoes | perfil (relation perfis_busca, cascade), versao, snapshot (json), ativado_por, ativado_em, motivo | list/view: logado; create/update/delete: null (só hooks) |

## Hooks (pocketbase/hooks/)

- ativa-perfil-busca.js — onRecordUpdate(perfis_busca): RN-01 (ativação completa → 400 com lista
  no `message`), RN-03 (uma ativa por rota), grava perfis_versoes (snapshot + motivo), ativado_em.
  Funções auxiliares DENTRO do callback (JSVM não vê top-level).
- bloqueia-edicao-perfil-ativo.js — onRecordUpdateRequest(perfis_busca): original ativo → 403.

## Componentes e libs do projeto

- src/services/perfis.ts (único acesso a dados), src/lib/mensagens-erro.ts, src/lib/formatos.ts.
- src/components/ui/* (shadcn), use-mobile, use-realtime; Layout com nav "Perfis de busca".

## Padrões e armadilhas aprendidas

- API do PocketBase responde na URL INTERNA (*.shrd00.internal.goskip.dev); o domínio público
  *.goskip.app só serve o frontend (405 em /api).
- Regra de lista do PB FILTRA: anônimo recebe 200 com totalItems 0 (não 401).
- json fields: ler com JSON.parse(rec.getString(...)) com guarda; BadRequestError(data) normaliza
  valores não-ValidationError — texto longo vai no `message` da resposta.
- Índice único (perfil, versao) contraria a SPEC (reativação = nova linha) — removido na 0004.
- Registros de teste (versao ≥1000) persistem no 64536 (deleteRule null) — efeito conhecido.

## Arquivos gerados que não se editam

- .skip.config.json, lockfiles, vite.config.ts, tsconfig*.json, .oxlintrc.json, .oxfmtrc.json,
  vite-plugin-react-uid.js, src/lib/pocketbase/schema.json (gerado), src/components/ui/*.
