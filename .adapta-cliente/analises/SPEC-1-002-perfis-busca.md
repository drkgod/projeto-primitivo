# Análise — SPEC-1-002: tela de perfis de busca (tasks d746b918, 9e081d10, ccc168e0)

Data: 22/10/2026 · Envelope: CLIENTE_ENVELOPE v1 · Ciclo contínuo autorizado ("ok pode seguir")

## Escopo desta rodada

- d746b918 — tela de perfis (lista + formulário por seções + resumo de faltantes): CA-1-05, CA-1-06.
- 9e081d10 — dois perfis iniciais em rascunho (seed): CA-1-07.
- ccc168e0 — impedir ativação de perfil incompleto (hook + validação RN-01): CA-1-06.
- bba1553f (ativação do perfil REAL) fica em em_espera: depende do teto de créditos Apollo (SPEC-1-003, decisão do cliente pendente) e de acesso de login na produção.

## Conferência da base de acesso (emenda 21/10)

- Coleção users (auth) existe no template; NÃO existe tela de login (DÚVIDA de 08/10 segue válida).
- Consequência: os testes automatizados autenticam via API (usuário de teste semeado só no projeto de teste); o teste HUMANO da tela fica para quando existir login (SPEC-1-001). A tela é construída e provada por TDD de API conforme a emenda.

## Onde construir

- Código do produto no projeto de TESTE 64536 (dados fictícios; RADAR_URL dos testes) e réplica na produção 64528 ao final (migração aditiva, idempotente).

## PLANO EM CÓDIGO (ordem: migração → seed → hooks → serviço → telas → rotas/menu)

1. `pocketbase/migrations/0001_perfis_de_busca.js` — coleções perfis_busca + perfis_versoes, 5 regras cada, created/updated. deleteRule de perfis_busca = null; perfis_versoes: create/update/delete null (só hook).
2. `pocketbase/migrations/0002_seed_perfis_iniciais.js` — 2 rascunhos, versao 1, idempotente.
3. `pocketbase/migrations/0003_seed_usuario_teste.js` — SÓ no 64536: usuário teste@radar.local, senha via $secrets.get('RADAR_TEST_PASSWORD') (nunca commitada).
4. `pocketbase/hooks/ativa-perfil-busca.js` — onRecordUpdate(perfis_busca): valida RN-01 (400 com lista de faltantes), inativa irmãs ativas da mesma rota (RN-03), grava perfis_versoes (snapshot; motivo "ativação" ou "reativação da versão N").
5. `pocketbase/hooks/bloqueia-edicao-perfil-ativo.js` — onRecordUpdateRequest(perfis_busca): original ativo → 403.
6. `src/services/perfis.ts` — tipos + listar/obter/salvar/ativar/desativar/nova versão (único lugar com pb).
7. `src/lib/mensagens-erro.ts` + `src/lib/formatos.ts` (receitas da skill).
8. `src/pages/Perfis.tsx` + `src/pages/PerfilEditar.tsx` (formulário por seções).
9. Rotas /perfis e /perfis/:id em App.tsx + item "Perfis de busca" no Layout.
10. Testes `07-sistemas/radar-primitivo/testes/perfis.test.mjs` + fixtures (perfil-teste.json, perfil-incompleto.json). Registros de teste (versao ≥ 1000) persistem no 64536 (deleteRule null) — efeito conhecido.

### Ficha de Tela — Perfis de busca (`/perfis`)
- Quem usa e onde: operador/admin (Leonardo); computador e celular.
- Tarefa principal: ver os dois perfis, preencher o escolhido e ativar.
- Ação primária: "Revisar e ativar" (no rascunho); "Editar" abre o formulário.
- Padrão: lista/cadastro (padrão 1) + formulário em página própria (padrão 2, >6 campos).
- Estados: carregando (Skeleton), vazio (convite), erro com "Tentar de novo", sucesso (toast).
- Celular: cards no lugar da tabela; formulário em 1 coluna; alvos 44px.
- Acessibilidade: rótulos visíveis, aria-label em ações de ícone, foco visível, erro abaixo do campo.

### Ficha de Tela — Editar perfil (`/perfis/:id`)
- Formulário em página própria com cartões por seção (Rota, Onde buscar, Quem buscar, Como pontuar, Quanto cabe, Quando rodar).
- Listas como texto (uma por linha); cargos/critérios/faixas/contas como JSON com validação no cliente e no servidor.
- Perfil ativo: campos desabilitados + Alert explicando nova versão; ação vira "Editar (nova versão)".

### Teste de mesa (regras críticas)
| Caso | Entrada | Saída esperada | Onde o código garante |
|---|---|---|---|
| Ativação completa | perfil com RN-01 completo | ativo + 1 linha em perfis_versoes + irmãs inativas | hook ativa-perfil-busca |
| Ativação incompleta | sem familias_cargo | 400 + faltantes "cargos a buscar" | hook ativa-perfil-busca (RN-01) |
| Edição de ativo | update nome em perfil ativo | 403 | hook bloqueia-edicao-perfil-ativo |
| Independência | ativar rota A não muda rota B | B intacto | filtro por rota no hook |
| Reativação | inativo→ativo | motivo "reativação da versão N" | hook ativa (antes=inativo) |

## Correções durante o GREEN (diagnóstico)

1. **Lista anônima**: PB filtra (200 + totalItems 0), não rejeita com 401 — teste ajustado.
2. **Faltantes**: BadRequestError(data) normaliza valores não-ValidationError — a lista legível vai no `message` da resposta; teste lê `message`.
3. **Índice único (perfil, versao)**: contraria a SPEC ("uma linha por ativação") → migration 0004 remove o índice.

## Riscos

- Migration replay em cópias: seeds idempotentes (try/catch); 0003 (usuário de teste) NÃO vai para a produção.
- JSON em goja: ler com JSON.parse(rec.getString('campo')) ?? default, com guarda Array.isArray.
- e.next() exatamente uma vez por caminho; throw para rejeitar. Funções auxiliares dentro do callback (JSVM).
