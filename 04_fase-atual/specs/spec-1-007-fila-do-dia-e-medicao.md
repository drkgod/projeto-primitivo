# SPEC-1-007 — Fila do dia, decisões e medição inicial

**Fase:** 1  
**Status:** planejada  
**Dono:** Primitivo (execução com o Maestro; teste de aceite pelo Country Manager); validação e fechamento pelo consultor Rodrigo Santos  
**Origem no escopo:** DC-001, DC-003, DC-007, DC-009, DC-013; RQ-008, RQ-009, RQ-015; gate G-07; critérios da Fase 1 “fila respeita capacidade e teto e explica estado vazio”, “gestor conclui a jornada sem planilha como interface principal”, “custo e origem aparecem na ficha”; checklist `CL-005`, `CL-PEND-005`, `CL-PEND-006`  
**Degrau da solução:** nativo da plataforma — rotina agendada, coleções e telas do Skip; construção mínima só da ordenação da fila e do relatório semanal.

## Contexto e decisões fechadas

- **Estado atual:** não há fila; o Country Manager decide com quem falar a partir de pesquisas soltas. O tempo gasto nisso ainda não foi medido.
- **Estado desejado:** em dias úteis, às 07:00 (horário de Brasília), a tela “Meu dia” traz uma fila curta, do tamanho da capacidade dele, com empresa, decisor, contato, nota e motivo; ele aprova, adia ou descarta com um clique e um motivo curto; o app mede volume, créditos, contatos válidos e tempo de revisão contra o tempo atual informado.
- **Decisões já fechadas:**
  - rotina `fila_diaria` com `cronAdd("fila_diaria", "0 10 * * 1-5", …)` (UTC = 07:00 de Brasília);
  - vagas da fila (`capacidade_dia` do perfil) só para empresas aprovadas na nota, não bloqueadas e com contato válido, ordenadas por nota (maior primeiro) e depois pela data de descoberta (mais antiga primeiro); soma semanal ≤ `capacidade_semana`;
  - empresas aprovadas sem contato válido aparecem em “Pendências”, fora das vagas;
  - item adiado volta na data/condição de reentrada; item descartado ou aprovado não volta como novo;
  - “Aprovar” significa “pronto para abordar”; o app não envia nada; o registro da abordagem é Fase 2;
  - motivos curtos por ação (chips), com texto opcional de até 140 caracteres: descartar (`fora_do_perfil`, `concorrente`, `ja_e_cliente`, `empresa_inativa`, `contato_errado`, `outro`); adiar (`momento`, `aguardar_safra`, `sem_contato_valido`, `outro` + data); aprovar (`bom_fit`, `momento_certo`, `outro`);
  - fila vazia explica a primeira causa encontrada nesta ordem: sem perfil ativo → fonte sem sucesso/sem aprovação → nenhuma empresa nas faixas liberadas → empresas aprovadas sem contato válido → teto do mês atingido → capacidade semanal usada.
- **Bloqueios:** o baseline, a capacidade, a definição de contato válido e a validade vêm da task “Medir o tempo atual de pesquisa e informar a capacidade diária”; o teste com dados reais depende da liberação de contato real (SPEC-1-001) e da Apollo (SPEC-1-003).

## Resultado observável

Às 07:00, “Meu dia” mostra a fila do dia (ou o motivo de estar vazia), a ficha completa de cada empresa e as ações de decisão. Na sexta-feira, o relatório semanal mostra quanto entrou, quanto foi aprovado, quantos contatos válidos, quantos créditos e o tempo de revisão, ao lado do tempo que o Country Manager gastava antes. O Country Manager percorre a jornada inteira com dados reais, sem planilha, e registra o aceite.

## Limites e dependências

- **Inclui:** coleções `fila_itens`, `decisoes`, `eventos_medicao`; `config.medicao`; rotina da fila; telas “Meu dia”, “Ficha da empresa” (composição dos blocos das SPECs 1-004, 1-005 e 1-006 + custo e histórico de decisões) e “Relatório semanal”; desfazer/reabrir; registro de tempo; roteiro de aceite; validação e fechamento da fase.
- **Fora de escopo:** registro de abordagem, resposta e próximo passo (Fase 2), oportunidades, risco/crédito, radar, painel avançado e calibração (Fase 4), notificações por e-mail/WhatsApp.
- **Entradas e pré-condições:** SPECs 1-001 a 1-006 com provas verdes; baseline, capacidade e definição de contato válido do cliente; ajustes de tela pedidos na avaliação do protótipo (`CL-005`), quando houver.
- **Saídas/artefatos:** fila diária; decisões auditadas; relatório semanal (JSON e CSV) em `05_entregas/fase-1/SPEC-1-007/`; vídeo da jornada; registro do aceite; ata da call de validação.
- **Dependências e responsáveis:** Primitivo (execução, baseline e teste); Rodrigo Santos (validação em call, revisão de evidências e decisão de fechamento).
- **Atores e permissões mínimas:** `operador` usa “Meu dia”, decide e vê o relatório do seu perfil; `admin` também gera relatório e ajusta `config.medicao`; anônimo nada.
- **Superfícies/arquivos/configurações afetadas:** migração (coleções e `config.medicao`), `pocketbase/hooks/fila.pb.js`, rota `GET /backend/v1/relatorio-semanal`, tags de auditoria, telas desta SPEC.
- **Risco e plano B:** fila vazia por cobertura → motivo explícito e pendências manuais; baseline ausente → métricas aparecem como “a medir”, sem afirmar ganho.
- **Rollback ou reversão:** “Desfazer” a última decisão de um item com motivo; regerar a fila do dia (admin) sem duplicar itens; migração com `down`.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `fila_itens` | app | `perfil`, `empresa`, `data_fila`, `posicao`, `secao` (`vagas`/`pendencias`), `estado` (`novo`/`em_revisao`/`pronto_contato`/`aguardando`/`concluido`/`bloqueado`), `motivo_prioridade` (até 3 critérios que mais somaram), `pessoa_principal`, `custo_creditos`, `reentrada_em` | leitura/escrita `operador` e `admin`; rotina cria | índice único (`perfil`, `empresa`, `data_fila`); regerar no mesmo dia não duplica | erro na rotina mantém a fila anterior e mostra aviso |
| `decisoes` | app | `fila_item`, `empresa`, `acao` (`aprovar`/`adiar`/`descartar`/`reabrir`/`desfazer`), `motivo_codigo`, `motivo_texto`, `reentrada_em`, `usuario`, `criado` | criação `operador`/`admin`; sem edição/exclusão | — | adiar sem data/condição → 400 |
| `eventos_medicao` | app | `tipo` (`fila_gerada`/`fila_vazia`/`item_aberto`/`item_decidido`), `fila_item`, `duracao_seg`, `dados` (json), `usuario`, `criado` | criação pelo app; leitura `admin` | — | falha de evento não bloqueia a decisão (registra no log) |
| `config.medicao` | app | `baseline_minutos_por_lead`, `baseline_horas_semana`, `baseline_amostra`, `baseline_data`, `definicao_contato_valido` (texto aprovado), `validade_contato_dias` | escrita `admin` | — | ausente → métricas “a medir” |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-01 | itens elegíveis > vagas | só entram `capacidade_dia`; o resto espera o próximo dia | — | RQ-008 |
| RN-02 | capacidade semanal atingida | fila do dia vazia com motivo “capacidade semanal usada” | — | RQ-008 |
| RN-03 | decisão | exige motivo; grava `decisoes` e auditoria; estados: aprovar → item `pronto_contato`; adiar → item `aguardando` e empresa `adiada`; descartar → item `concluido` e empresa `descartada`; reabrir → item `em_revisao` e empresa `reaberta` | — | DC-009 |
| RN-04 | adiar | exige `reentrada_em` ou condição; volta na data | — | RQ-009 |
| RN-05 | desfazer/reabrir | exige motivo; mantém a decisão anterior no histórico | — | RQ-009 |
| RN-06 | relatório | custo por contato válido = créditos do período × `custo_por_credito_brl` ÷ contatos válidos; sem custo por crédito, mostrar só créditos; o relatório usa somente o projeto de produção | sem baseline → “a medir” | RQ-015, DC-007 |

## Fluxo e regras

1. Migração das coleções e de `config.medicao`; tags de auditoria.
2. Rotina `fila_diaria` com as regras acima e o motivo de fila vazia.
3. Tela “Meu dia”: vagas, pendências, aviso de fonte, contador de capacidade; cada item com empresa, decisor, canal, nota/faixa, motivo da prioridade e ações.
4. Tela “Ficha da empresa”: dados e origens, “Por que esta nota”, “Decisores e contatos”, custo em créditos da empresa, histórico de decisões.
5. Eventos de medição (abrir e decidir item) e rota do relatório semanal.
6. Registrar baseline, capacidade, definição de contato válido e validade enviados pelo cliente.
7. Jornada real: perfil ativo → descoberta → nota → decisores/contatos (amostra autorizada dentro do teto) → fila → decisões, gravada em vídeo pelo Country Manager.
8. Call de validação com o consultor e decisão de fechamento.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | 8 elegíveis, capacidade 5 | 5 vagas ordenadas por nota; 3 esperam | — |
| Limite | 0 elegíveis por teto atingido | fila vazia: “teto de créditos do mês atingido” | admin/cliente decide teto |
| Falha | adiar sem data | 400 e mensagem | informar data/condição |
| Limite | desfazer descarte | item volta a `em_revisao` com histórico | — |
| Principal | sexta-feira | relatório com métricas e baseline | baseline ausente → “a medir” |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** esta SPEC, o que existir em `07-sistemas/radar-primitivo/` e os blocos de ficha das SPECs 1-004, 1-005 e 1-006.
2. **Alterar somente:** coleções, rotina, rota, telas, testes e evidências desta SPEC.
3. **Não alterar:** nota, gate, módulo Apollo, perfis; não enviar mensagens; não criar planilha como interface.
4. **Executar nesta ordem:** migração → rotina com fixtures → telas → decisões → medição → relatório → baseline do cliente → jornada real → call de validação.
5. **Parar e pedir validação quando:** faltar baseline/capacidade, a fila real vier vazia por cobertura, o Country Manager precisar de planilha para concluir a jornada, ou qualquer critério das SPECs 1-001 a 1-006 estiver vermelho.
6. **Estado válido ao parar:** fila consistente com capacidade e teto; decisões auditadas.

## Checklist de execução

- [ ] coleções e `config.medicao` criadas
- [ ] rotina da fila às 07:00 com vagas, pendências e motivo de fila vazia
- [ ] “Meu dia” e ficha completas
- [ ] decisões com motivo, adiar com data, desfazer/reabrir auditados
- [ ] medição e relatório semanal
- [ ] baseline, capacidade e contato válido registrados
- [ ] jornada real gravada e aceite registrado
- [ ] call de validação feita e decisão de fechamento registrada
- [ ] evidências em `05_entregas/fase-1/SPEC-1-007/`

## Critérios de aceite

- [ ] **CA-1-29:** às 07:00 em dias úteis, a fila tem no máximo `capacidade_dia` itens com contato válido, ordenados pela nota, respeita a capacidade semanal e o teto, e explica o motivo quando vem vazia.
- [ ] **CA-1-30:** aprovar, adiar e descartar pedem só um clique e um motivo curto; adiar exige data ou condição; desfazer e reabrir ficam auditados; item decidido não volta como novo.
- [ ] **CA-1-31:** a ficha mostra origem e data de cada dado, a nota com explicação, decisores e contatos com origem e o custo em créditos da empresa.
- [ ] **CA-1-32:** o relatório semanal mostra volume por rota, faixas, contatos válidos, créditos, custo por contato válido e tempo de revisão, ao lado do baseline informado (ou “a medir”).
- [ ] **CA-1-33:** o Country Manager conclui a jornada perfil → empresas → nota → decisores → fila → decisão com dados reais autorizados, sem planilha, em vídeo, e registra o aceite.
- [ ] **CA-1-34:** o consultor revisa as evidências de todas as SPECs da Fase 1 em call e registra a decisão: aceita, aceita com pendência ou não aceita.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | `fila.test.mjs` com 8 empresas fictícias elegíveis, 2 sem contato, 1 adiada para hoje, 1 descartada; capacidade 5; teto esgotado em um caso | `node --test 07-sistemas/radar-primitivo/testes/fila.test.mjs` antes da rotina | fila sem limite/ordem ou sem motivo de vazio (falha esperada) — CA-1-29 | `05_entregas/fase-1/SPEC-1-007/red.txt` |
| GREEN | mesmo arquivo + `decisoes.test.mjs` (motivo obrigatório, adiar sem data → 400, desfazer auditado) + `relatorio.test.mjs` (contagens e custo por contato válido com e sem baseline) | `node --test 07-sistemas/radar-primitivo/testes/` | 5 vagas por nota, 2 pendências, adiada volta, descartada não; motivos de vazio corretos; relatório confere com as fixtures — CA-1-29 a CA-1-32 | `green.txt` |
| REFACTOR/REGRESSÃO | suíte completa das SPECs 1-001 a 1-007 + jornada real gravada (roteiro abaixo) | `node --test 07-sistemas/radar-primitivo/testes/` + roteiro humano | tudo verde; jornada concluída sem planilha; aceite registrado — CA-1-33; call registrada — CA-1-34 | `green.txt`, vídeo, relatório semanal, ata da call |

**Dados/fixtures:** os testes automáticos rodam no projeto `radar-primitivo-teste` (`RADAR_URL`), nunca no de produção; 8 empresas com nota e contato simulados; perfil com capacidade 5/dia e 20/semana; `custo_por_credito_brl` de teste.  
**Caminhos de erro obrigatórios:** fila vazia por cada uma das seis causas, adiar sem data, decisão sem motivo, regerar a fila no mesmo dia, baseline ausente.  
**Evidência exigida:** RED/GREEN, captura de “Meu dia” às 07:00, ficha completa, relatório semanal, vídeo da jornada, aceite do Country Manager, registro da decisão do consultor.

## Teste humano do cliente

- **Origem:** `CL-PEND-006` (testar a jornada completa da Fase 1 e registrar o aceite; a confirmar com o cliente).
- **Quem testa:** Leonardo Motta Berzaghi (Country Manager).
- **Passos:** 1) abrir “Meu dia” às 07:00 de um dia útil; 2) abrir três empresas da fila e ler origem, nota, decisor e contato; 3) aprovar uma, adiar outra com data e descartar outra com motivo; 4) desfazer uma decisão; 5) abrir Perfis de busca e conferir o perfil ativo; 6) abrir o relatório da semana; tudo sem abrir planilha, com gravação de tela.
- **Resultado esperado:** ele entende por que cada empresa está na fila e decide sem pesquisar fora do app.
- **Evidência do aceite:** vídeo da jornada e mensagem “aceito” (ou a lista do que não aceitou) anexados em `05_entregas/fase-1/SPEC-1-007/`.

## Handoff e operação

- **Como demonstrar:** a gravação da jornada real e o relatório semanal.
- **Como operar depois:** todo dia útil o Country Manager abre “Meu dia”, decide os itens e resolve pendências; na sexta-feira lê o relatório.
- **Como monitorar:** idade dos itens na fila, taxa de fila vazia por causa e tempo médio de revisão.
- **Pendência conhecida:** registro de abordagem e próximo passo entram na Fase 2.

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|---|
| 417da661-3d97-4501-8612-884e5a5c0ff5 | Medir o tempo atual de pesquisa e informar a capacidade diária | Primitivo | SPEC-1-007 | CA-1-32 (pré-condição) | baseline, capacidade, contato válido e validade em `config.medicao` | mensagem/planilha de medição do cliente | G-07 |
| 51b5d269-9f90-41b3-b491-4d112665d855 | Montar a fila do dia com aprovar, adiar e descartar | Primitivo | SPEC-1-007 | CA-1-29, CA-1-30 | GREEN de `fila.test.mjs` e `decisoes.test.mjs` | `green.txt` | SPECs 1-004 a 1-006 verdes em modo simulado |
| 6e7e9935-db05-4aad-b86a-cecfb7895f9c | Limitar a fila à capacidade e explicar fila vazia | Primitivo | SPEC-1-007 | CA-1-29 | casos de capacidade e das seis causas de vazio | `green.txt` | rotina da fila |
| 78dcadd3-cc42-40e9-b795-3e1d7a3a86e2 | Mostrar origem, nota, contatos e custo na ficha | Primitivo | SPEC-1-007 | CA-1-31 | ficha completa | captura da ficha | blocos das SPECs 1-004 a 1-006 |
| 282e1d90-af2e-4474-961d-c38799c324f9 | Registrar tempo, volume, créditos e contatos válidos | Primitivo | SPEC-1-007 | CA-1-32 | `relatorio.test.mjs` + relatório real | `green.txt` + relatório semanal | baseline registrado |
| aa5cb47b-252d-4b9e-9390-6efb8ef5d818 | Testar a jornada completa com dados autorizados | Primitivo | SPEC-1-007 | CA-1-33 | roteiro do teste humano | vídeo + aceite | `contato_real_liberado = true`; Apollo liberada; fonte aprovada |
| 55b888f1-86e0-4bd7-8cfc-3f612dd55113 | Validar a Fase 1 em call com o consultor | Rodrigo Santos | SPEC-1-007 | CA-1-34 | demonstração e conferência dos critérios CA-1-01 a CA-1-33 | ata/gravação da call | jornada testada |
| 02b1b0f0-5bfa-4c3e-94bb-eb540d9dbf02 | Revisar as evidências e decidir o fechamento da Fase 1 | Rodrigo Santos | SPEC-1-007 | CA-1-34 | evidências de todas as SPECs | registro da decisão de fechamento | call de validação |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
