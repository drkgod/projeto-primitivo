# Análise — Criar a primeira versão visual do Radar Primitivo

- **Task:** "Criar a primeira versão visual do Radar Primitivo" — ID de trabalho `SPEC-1-008-visual-v1` (UUID do portal pendente; card novo de 08/10, sem `<!-- id: -->` no fase.md)
- **SPEC:** `04_fase-atual/specs/spec-1-008-primeira-experiencia-visual.md` · **Critérios:** CA-1-35, CA-1-36 (CA-1-37/38 nas tasks seguintes)
- **Envelope:** CLIENTE_ENVELOPE v1 — rota `analisar`, skill_autorizada `proxima-task`, apoio `ui-ux-sistemas` + `construir-codigo` (MAPA/PLANO)

## 1. Objetivo e resultado observável

Versão navegável e responsiva de **Meu dia**, **Ficha da empresa** e **Perfis de busca** no app do projeto de teste (Skip 64536), com 6 empresas fictícias, ações simuladas (aprovar/adiar/descartar/desfazer/reset) em memória, banner "Demonstração — dados fictícios" explícito, zero chamadas externas e zero escrita em dados reais. O Leonardo percorre a jornada e valida o visual (CL-005) antes da conexão com dados reais.

## 2. Estado atual verificado (com evidência)

- **Projeto de teste (64536)** = template base do Skip: React+Vite+TS+Tailwind+shadcn/ui, PocketBase nativo. Rotas: `/` (Index placeholder) e `*` (NotFound). Coleções: apenas `users` (auth nativa do PocketBase). **Não existe tela de login nem papéis implementados.**
- **Relato "app com login e papéis já realizado" (consultor, 08/10): NÃO observável nesta org.** Listei os 4 projetos (64528, 64536, 64537, 55563) — nenhum contém o app descrito; o Comex Suite (55563) é outro produto. O relato está registrado em `06_notas/2026-10-08-task-inicial-ja-realizada.md` como origem "relato do consultor", sem prova técnica. **DÚVIDA ao consultor Rodrigo:** onde o app com login/papéis foi criado? Enquanto isso, a demo segue na estrutura REAL encontrada (template), como a própria SPEC manda ("respeitar a estrutura real do frontend encontrada, sem criar outra stack").
- **Consequência prática:** o cenário "abrir demo sem login mantém o bloqueio" fica **pendente** (nada a preservar ainda); a demo sai pública apenas no projeto de teste, que é o ambiente dela. Nada em produção (64528) é alterado por esta task. Não criar login UI nesta SPEC (fora de escopo: "modificação de autenticação/permissões").
- **Produção (64528):** template + arquivos de configuração do orquestrador (`.adapta-cliente/estado-atual.md`, `07-sistemas/radar-primitivo/plataforma.md`), aplicados e publicados nesta resposta (prova abaixo). Teste (64536) e restauro (64537): template puro, v0.0.1.
- **Skills de UI/UX disponíveis (CA-1-35):** `ui-ux-sistemas` e `construir-codigo` — instaladas no ambiente em `skills/adapta-cliente/` (plugin Adapta Cliente v0.6.1, testes 22/22). Nomes registrados para `05_entregas/fase-1/SPEC-1-008/skills-ui-ux.md`. As skills de apoio exigem que a Ficha de Tela e o plano em código antecedam o código — cumprido nesta análise.

## 3. Arquivos a criar/alterar (ordem: módulo → testes → componentes → páginas → rotas)

| # | Arquivo (projeto 64536) | Motivo |
|---|---|---|
| 1 | `07-sistemas/radar-primitivo/ui/visual-demo-state.mjs` | estado demonstrativo: `createInitialDemoState()` + `reduceDemoState(state, action)`; imutável; relógio fixo 2026-10-08 |
| 2 | `07-sistemas/radar-primitivo/testes/visual-demo.test.mjs` | RED antes do módulo; GREEN depois; roda com `node --test` |
| 3 | `src/demo/fixtures.ts` | 6 empresas fictícias, 2 perfis (`demo-distribuidores`, `demo-industrias`), 3 decisores, 5 na fila + 1 fora, capacidade 5, contatos `pessoa1@example.com` |
| 4 | `src/demo/DemoShell.tsx` | shell de navegação (lateral no desktop, topo no celular), banner de demonstração, data de referência || 5 | `src/pages/demo/MeuDia.tsx` | resumo (a revisar/capacidade/créditos), fila com nota/faixa/motivo, ações com validação, desfazer, reset, estados carregando/vazio/erro |
| 6 | `src/pages/demo/FichaEmpresa.tsx` | "Por que esta nota", origem "Exemplo demonstrativo", decisor, contato fictício, custo simulado |
| 7 | `src/pages/demo/Perfis.tsx` | 2 cartões, resumo por seções, "Pré-visualizar perfil" (só demo) |
| 8 | `src/App.tsx` (patch) | rotas `/demo`, `/demo/empresa/:id`, `/demo/perfis` — sem tocar providers existentes |

**Não alterar:** `src/lib/pocketbase/*`, `src/hooks/use-realtime.ts`, `src/components/ui/*`, `package.json`, lockfiles, configs, coleções, hooks de banco, login. **Nenhuma dependência nova.**

## 4. Tipos e contrato do módulo (teste de mesa)

Ações: `APPROVE(id)` · `POSTPONE(id, dataISO)` · `DISCARD(id, motivo)` · `UNDO` · `RESET`.

| Entrada | Saída esperada |
|---|---|
| aprovar item da fila (5 itens) | fila 5→4, contador −1, decisão reversível |
| UNDO após aprovar | item volta à MESMA posição, contador restaura |
| POSTPONE sem data | erro junto ao campo, fila e contagem intactas |
| POSTPONE 09/10/2026 | sai da fila, contador −1, confirmação "Adiado para 09/10/2026" |
| POSTPONE 08/10/2026 ou inválida | erro de data (deve ser > 2026-10-08), item preservado |
| DISCARD sem motivo / só espaços | erro, item preservado |
| DISCARD com motivo | sai da fila, contador −1 |
| RESET | 6 empresas, 5 na fila, decisões zeradas |
| qualquer ação | estado de entrada NUNCA mutado |

## 5. Ficha de Tela (resumo — detalhe nas referências da skill)

- **Meu dia (`/demo`)** — Leonardo; desktop+mobile. Tarefa: revisar as empresas do dia e decidir. Ação primária: "Ver empresa". Padrão: lista/dashboard. Dados: fixtures (nota/faixa/motivo/créditos). Estados: carregando · vazio (oferece restaurar demo) · erro (tentar novamente) · sucesso. Celular: fila em cards, ações em menu inferior, sem rolagem horizontal, base 16px, alvos 44px. Acessibilidade: rótulos visíveis, foco visível, Tab/Enter/Esc, faixa nunca só por cor (badge + texto).
- **Ficha (`/demo/empresa/:id`)** — tarefa: entender a empresa e decidir. Ação primária: voltar para a fila (decisões acontecem na fila). Dados: bloco "Por que esta nota", origens com rótulo "Exemplo demonstrativo", decisor/cargo, contato fictício, custo simulado. Estados: carregando · não encontrada (erro com saída) · sucesso.
- **Perfis (`/demo/perfis`)** — tarefa: conferir os dois perfis. Ação primária: "Pré-visualizar perfil". Padrão: cartões + formulário por seções (Rota, Onde buscar, Quem buscar, Como pontuar, Quanto cabe, Quando rodar). Pré-visualizar altera só a demo; nada ativa perfil operacional.

## 6. Matriz critério → prova

| Critério | Prova |
|---|---|
| CA-1-35 | `skills-ui-ux.md` com os nomes reais (`ui-ux-sistemas`, `construir-codigo`) + ≥3 decisões visíveis na UI (banner demo, fila em cards com motivo, formulário por seções) |
| CA-1-36 | `red.txt` (RED antes do módulo) + `green.txt` (node --test verde) + `navegacao.webm` percorrendo as 3 telas com as 5 transições + `rede.md` (zero chamadas de negócio) + reload restaura fixtures |
| CA-1-37 | capturas 1440×900 e 375×812 (`desktop.png`, `mobile.png`) + `revisao-ui.md` (teclado, foco, rótulos, vazio/erro) — task 2 |
| CA-1-38 | `aceite-visual.md` — portão humano do Leonardo (task 3) |

## 7. Riscos e pontos de atenção

1. **Login/papéis inexistentes na org** — cenário de acesso pendente; DÚVIDA registrada ao consultor; NADA de auth é criado nesta task.
2. **Cards novos sem UUID do portal** — uso ID de trabalho; quando o portal sincronizar os `<!-- id: -->`, o estado é atualizado (nunca invento UUID).
3. **Prazos vencidos (06-07/10)** nas tasks de critérios do cliente — não bloqueiam a demo (usa fixtures), mas bloqueiam CA-1-08 e a ativação real.
4. **Demo pública no ambiente de teste** — conforme a SPEC (ela vive no projeto de teste); produção intocada; dados 100% fictícios, contatos `@example.com`.

## 8. Verificação automática e entrega

1. `node --test 07-sistemas/radar-primitivo/testes/visual-demo.test.mjs` — RED → implementar → GREEN (evidências em `05_entregas/fase-1/SPEC-1-008/`).
2. `skip_project_apply_changes` (64536, `task SPEC-1-008-visual-v1: primeira versão visual da demo`) → `skip_project_publish` (64536) → prova via `skip_project_status` (sem pendências fora de .skip.config.json).
3. Espelho `07-sistemas/radar-primitivo/codigo/` + estado/análise/mapa/changelog → **1 commit** no GitHub (push_files, prova = SHA).
4. **Teste humano (portão seguinte):** roteiro CL-005 na URL do projeto de teste — Leonardo percorre fila → ficha → perfis, aprova/desfaz, adia com data, valida no celular.

## 9. Dependências e perguntas

- **Bloqueante para CA-1-08 (não para esta task):** critérios do bom cliente (5 bons + 5 maus exemplos, regiões, culturas, porte, cargos, contas excluídas) — com o Leonardo; prazo 07/10 vencido.
- **DÚVIDA ao consultor:** localização do app com login/papéis relatado como pronto.
- Nenhuma outra dependência para a demo.
