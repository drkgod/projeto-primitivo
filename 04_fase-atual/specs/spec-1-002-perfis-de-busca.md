# SPEC-1-002 — Perfis de busca (ICP) configuráveis e ativados

**Fase:** 1  
**Status:** planejada  
**Dono:** Primitivo (execução com o Maestro; conteúdo dos critérios pelo Country Manager); aceite do consultor Rodrigo Santos  
**Origem no escopo:** DC-002, DC-009, DC-013; RQ-001; gate G-03; critério da Fase 1 “um ICP pode ser salvo, validado e ativado”; checklist `CL-001` e `CL-PEND-001`  
**Degrau da solução:** nativo da plataforma — coleções, regras de acesso e telas do Skip; nenhuma biblioteca extra.

## Contexto e decisões fechadas

- **Estado atual:** os critérios de bom cliente estão na cabeça do Country Manager e em materiais do Gemini/Drive; nada está estruturado.
- **Estado desejado:** o app guarda dois perfis separados — distribuidores regionais (importação direta/marca própria) e indústrias de fertilizantes/bioestimulantes (matéria-prima B2B) — cada um com critérios, cargos, capacidade, teto e cadência próprios; o perfil escolhido pelo cliente é ativado e passa a comandar a busca diária.
- **Decisões já fechadas:**
  - os dois perfis existem desde o início; o cliente escolhe qual ativar primeiro (o outro fica em rascunho);
  - perfil ativo não é editado direto: “Editar” cria uma nova versão em rascunho; ativar a nova versão inativa a anterior; voltar = reativar a versão anterior;
  - cadência padrão: dias úteis, fila pronta às 07:00 (horário de Brasília);
  - no máximo uma versão ativa por rota;
  - o app não inventa critério: campo sem valor fica “desconhecido” e bloqueia a ativação quando for obrigatório.
- **Bloqueios:** a ativação real depende da task “Escolher o primeiro perfil e enviar os critérios de bom cliente”. A tela pode ser construída e testada com um perfil fictício antes disso.

## Resultado observável

O Country Manager abre “Perfis de busca”, vê os dois perfis, preenche o escolhido, recebe a lista do que falta, ativa e vê o resumo do perfil ativo com versão e data. A partir daí a busca diária usa esse perfil.

## Limites e dependências

- **Inclui:** coleções `perfis_busca` e `perfis_versoes`; tela de lista, formulário por seções, resumo antes de ativar, ativação, nova versão, reativação de versão anterior; auditoria das ativações.
- **Fora de escopo:** cálculo da nota (SPEC-1-005), busca de empresas (SPEC-1-004), chamadas à Apollo, sugestão de critério por IA, gestão simultânea dos dois perfis com métricas comparadas (Fase 5).
- **Entradas e pré-condições:** app com login e papéis; critérios, exemplos, regiões, culturas, porte, cargos e contas excluídas enviados pelo cliente; teto mensal de créditos definido na preparação da Apollo.
- **Saídas/artefatos:** perfil ativo versionado; evidências em `05_entregas/fase-1/SPEC-1-002/`.
- **Dependências e responsáveis:** Primitivo (critérios e execução); Country Manager (confirma o resumo).
- **Atores e permissões mínimas:** `operador` cria, edita rascunho e ativa; `admin` também; anônimo não acessa.
- **Superfícies/arquivos/configurações afetadas:** `pocketbase/migrations/` (coleções desta SPEC), tag das coleções no hook de auditoria, telas Perfis de busca e Resumo do perfil.
- **Risco e plano B:** se o cliente atrasar os critérios, ativar com os mínimos obrigatórios que ele já enviou e marcar o restante como “desconhecido” (sem pontuação); nunca preencher por suposição.
- **Rollback ou reversão:** reativar a versão anterior; migração com `down`.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `perfis_busca` | app | `nome`, `rota` (`distribuidores_regionais` \| `industrias_fertilizantes`), `rota_comercial` (texto curto: ex. “importação direta/marca própria”, “matéria-prima B2B”), `estado` (`rascunho`/`ativo`/`inativo`), `versao` (int), `perfil_base` (id da primeira versão), `termos_segmento` (lista), `atividades_aceitas` (lista de atividades da base oficial), `ufs` (lista de siglas), `municipios` (lista opcional), `culturas` (lista), `funcionarios_min`/`funcionarios_max` (opcionais), `familias_cargo` (json: até 3 famílias, cada uma com `nome`, `titulos` PT/EN e `senioridades`), `criterios` (json, ver abaixo), `faixas` (json: limites A/B/C/D), `faixas_liberadas` (lista: faixas que seguem para contatos), `contas_excluidas` (json: razão social, domínio e/ou CNPJ), `capacidade_dia`, `capacidade_semana`, `teto_creditos_mes`, `canais` (lista: `email` e opcional `telefone`), `dias_execucao` (padrão seg–sex), `hora_fila` (padrão `07:00`, America/Sao_Paulo), `ativado_por`, `ativado_em` | leitura/escrita: logado; escrita em perfil `ativo` negada (só via nova versão) | ativação idempotente: ativar perfil já ativo não cria versão | validação falha → 400 com lista de campos faltantes |
| `perfis_versoes` | app | `perfil`, `versao`, `snapshot` (json completo), `ativado_por`, `ativado_em`, `motivo` | leitura: logado; criação só por hook; sem edição/exclusão | uma linha por ativação | — |

**Contrato de `criterios`** (lido pela SPEC-1-005): lista de itens `{id, nome, tipo, regra, pontos, impeditivo}`, em que `tipo` ∈ `uf_atendida`, `municipio`, `atividade`, `termo_segmento`, `porte_funcionarios`, `situacao_ativa`, `tem_dominio`, `validacao_gestor`; `regra` é o valor ou lista aceita; `pontos` é inteiro ≥ 0; `impeditivo = true` bloqueia a empresa quando a regra é violada com dado confirmado.

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-01 | ativar perfil | exige `rota`, `rota_comercial`, ≥ 1 UF, ≥ 1 termo de segmento ou atividade, ≥ 1 família de cargo com ≥ 1 título, ≥ 1 critério com pontos > 0, `faixas` e `faixas_liberadas` preenchidas, `capacidade_dia` > 0, `teto_creditos_mes` > 0 | ativa e grava versão | faltou campo → continua rascunho e mostra a lista | RQ-001 |
| RN-02 | campo opcional vazio | estado “desconhecido”, sem ponto positivo | — | RQ-001, DC-008 |
| RN-03 | ativar versão nova | versão anterior vira `inativo` na mesma transação | — | RQ-001 |
| RN-04 | conta em `contas_excluidas` | nunca entra na fila deste perfil | — | roteiro de bloqueadores (contas excluídas) |
| RN-05 | perfis de rotas diferentes | critérios, cargos, capacidade e teto não são compartilhados | — | DC-002 |

## Fluxo e regras

1. Criar as coleções com as cinco regras de acesso e o hook que impede editar perfil `ativo`.
2. Criar os dois registros iniciais em `rascunho`: “Distribuidores regionais” e “Indústrias de fertilizantes e bioestimulantes”.
3. Montar a tela “Perfis de busca”: lista com estado/versão; formulário em seções (Rota, Onde buscar, Quem buscar, Como pontuar, Quanto cabe, Quando rodar); botão “Revisar e ativar” que mostra o resumo e os campos faltantes.
4. Ativar: transação que valida RN-01, inativa a versão anterior, grava `perfis_versoes` e auditoria.
5. “Editar perfil ativo” cria rascunho `versao + 1`; “Voltar para a versão anterior” reativa a versão escolhida com motivo.
6. Preencher o perfil escolhido com os critérios enviados pelo cliente e ativar.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | perfil completo | ativo, versão 1 registrada | — |
| Limite | perfil sem família de cargo | continua rascunho; mensagem “falta: cargos a buscar” | preencher e reativar |
| Falha | tentativa de editar campo de perfil ativo pela API | 400; nada muda | usar “Editar” (nova versão) |
| Limite | ativar versão 2 | versão 1 inativa; versão 2 ativa | reativar 1 se necessário |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** esta SPEC, o que existir em `07-sistemas/radar-primitivo/` e os guias de migrações e do SDK do Skip.
2. **Alterar somente:** coleções `perfis_busca` e `perfis_versoes`, a tag delas no hook de auditoria, as telas desta SPEC, os testes e as evidências.
3. **Não alterar:** coleções e regras de acesso de outras SPECs; não sugerir nem preencher critério por conta própria.
4. **Executar nesta ordem:** migração → hook de bloqueio de edição → registros iniciais → telas → ativação → nova versão/reativação → provas → preenchimento do perfil real.
5. **Parar e pedir validação quando:** faltar critério obrigatório do cliente, houver dúvida entre os dois perfis ou o cliente pedir regra que não cabe no contrato de `criterios`.
6. **Estado válido ao parar:** perfis salvos; nenhum perfil incompleto ativo.

## Checklist de execução

- [ ] coleções criadas com regras de acesso
- [ ] dois perfis iniciais em rascunho
- [ ] tela com formulário por seções e resumo de faltantes
- [ ] ativação, nova versão e reativação funcionando com auditoria
- [ ] perfil escolhido pelo cliente ativado com os critérios dele
- [ ] evidências em `05_entregas/fase-1/SPEC-1-002/`

## Critérios de aceite

- [ ] **CA-1-05:** um perfil completo é salvo, validado e ativado; a ativação grava versão e auditoria.
- [ ] **CA-1-06:** um perfil incompleto não ativa e a tela lista exatamente os campos que faltam.
- [ ] **CA-1-07:** os perfis de distribuidores e de indústrias têm critérios, cargos, capacidade e teto independentes; perfil ativo só muda por nova versão, e voltar à versão anterior funciona.
- [ ] **CA-1-08:** o perfil escolhido pelo cliente está ativo com os critérios enviados por ele, e o Country Manager confirma o resumo.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | `perfis.test.mjs`: ativar perfil sem cargo; editar perfil ativo via API | `node --test 07-sistemas/radar-primitivo/testes/perfis.test.mjs` antes das regras | ativação aceita / edição aceita (falha esperada) — CA-1-06, CA-1-07 | `05_entregas/fase-1/SPEC-1-002/red.txt` |
| GREEN | mesmo arquivo + caso completo (fixture `perfil-teste.json`) + independência entre as duas rotas | mesmo comando | incompleto → 400 com lista; completo → ativo v1 + 1 linha de auditoria; alterar rota A não muda rota B — CA-1-05, CA-1-06, CA-1-07 | `green.txt` |
| REFACTOR/REGRESSÃO | criar versão 2, ativar, voltar para a 1; rodar a suíte inteira | `node --test 07-sistemas/radar-primitivo/testes/` | só uma versão ativa por rota; testes anteriores seguem verdes | `green.txt` + captura do resumo |

**Dados/fixtures:** os testes automáticos rodam no projeto `radar-primitivo-teste` (`RADAR_URL`), nunca no de produção; `perfil-teste.json` (rota fictícia completa), `perfil-incompleto.json` (sem família de cargo).  
**Caminhos de erro obrigatórios:** campo obrigatório ausente, edição de perfil ativo, usuário anônimo, ativação repetida.  
**Evidência exigida:** saídas RED/GREEN; captura do resumo do perfil real ativo; mensagem do Country Manager confirmando o resumo (CA-1-08).

## Teste humano do cliente

- **Origem:** não há item `CL-NNN` de validação nesta SPEC (`CL-001` é entrada e fica como pré-condição). A conferência abaixo integra o CA-1-08; o aceite da jornada completa fica na SPEC-1-007.
- **Quem testa:** Leonardo Motta Berzaghi (Country Manager).
- **Passos:** entrar no app → Perfis de busca → abrir o perfil ativo → conferir regiões, culturas, cargos, contas excluídas, capacidade e teto.
- **Resultado esperado:** o resumo bate com o que ele enviou; nada foi acrescentado sem ele pedir.
- **Evidência do aceite:** mensagem “perfil confere” no grupo ou registro no app, anexado em `05_entregas/fase-1/SPEC-1-002/`.

## Handoff e operação

- **Como demonstrar:** tentar ativar um perfil incompleto, completar e ativar; criar versão 2 e voltar.
- **Como operar depois:** o Country Manager ajusta o perfil criando nova versão; cada versão fica no histórico.
- **Como monitorar:** auditoria de ativações e versão citada em cada nota.
- **Pendência conhecida:** operação simultânea e comparada dos dois perfis fica para a Fase 5.

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|---|
| dcc49939-f29e-46ac-8eba-832b3bf5c9e0 | Escolher o primeiro perfil e enviar os critérios de bom cliente | Primitivo | SPEC-1-002 | CA-1-08 (pré-condição) | critérios recebidos e registrados | mensagem/arquivo do cliente | — |
| a12bc875-7c44-4794-bda8-1e03256ab499 | Escolher entre distribuidores e indústrias para começar | Primitivo | SPEC-1-002 | CA-1-08 (pré-condição) | rota escolhida | mensagem do cliente | — |
| 5e6af5ed-0e53-4432-b6f1-131a828b3316 | Enviar cinco bons e cinco maus exemplos de empresas | Primitivo | SPEC-1-002 | CA-1-08 (pré-condição; amostra usada na SPEC-1-005) | lista com 10 empresas | arquivo/mensagem do cliente | — |
| b4cda5f4-8a97-4ebe-82a4-a909ffe5c2d0 | Listar regiões, culturas, porte e cargos que importam | Primitivo | SPEC-1-002 | CA-1-08 (pré-condição) | campos do perfil preenchíveis | arquivo/mensagem do cliente | — |
| 4db121ca-a846-4921-aa11-d5000f9ee28c | Listar empresas que nunca devem entrar na fila | Primitivo | SPEC-1-002 | CA-1-08 (pré-condição) | `contas_excluidas` | arquivo/mensagem do cliente | — |
| d746b918-362a-4fbb-8763-0f0e4b634eb1 | Montar a tela de perfis de busca | Primitivo | SPEC-1-002 | CA-1-05, CA-1-06 | RED/GREEN de `perfis.test.mjs` | `green.txt` | app com login |
| 9e081d10-e673-42ae-a730-e73e175cd576 | Criar os perfis de distribuidores e de indústrias | Primitivo | SPEC-1-002 | CA-1-07 | dois rascunhos independentes | captura da lista | coleções criadas |
| ccc168e0-3178-4bb0-b2e6-a1bb34ea4b12 | Impedir a ativação de perfil incompleto | Primitivo | SPEC-1-002 | CA-1-06 | caso incompleto → 400 com lista | `green.txt` | formulário pronto |
| bba1553f-6269-48b4-886c-5f3cc81cf4f1 | Ativar o primeiro perfil com os critérios do cliente | Primitivo | SPEC-1-002 | CA-1-05, CA-1-08 | perfil real ativo; teste humano do resumo | captura + mensagem do Country Manager | critérios do cliente; teto da Apollo definido |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
