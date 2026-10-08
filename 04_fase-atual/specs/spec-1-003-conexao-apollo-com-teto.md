# SPEC-1-003 — Conexão com a Apollo sob teto de créditos

**Fase:** 1  
**Status:** planejada  
**Dono:** Primitivo (contrato, chave e execução com o Maestro); aceite do consultor Rodrigo Santos  
**Origem no escopo:** DC-004, DC-010, DC-012; RQ-006, RQ-015 (custo), RQ-017; gate G-01; checklist `CL-PEND-002`  
**Degrau da solução:** nativo da plataforma — segredos, hooks e `$http.send` do Skip; construção mínima apenas do módulo que concentra teto, idempotência e registro de consumo, para que nenhuma outra parte do app chame a Apollo direto.

## Contexto e decisões fechadas

- **Estado atual:** o cliente ainda não usa a Apollo; plano, chave e teto não estão definidos.
- **Estado desejado:** o app tem uma única porta de saída para a Apollo, que só chama com a chave guardada no cofre do Skip, respeita o teto mensal, não repete consumo, registra cada chamada e funciona em modo simulado para testes.
- **Decisões já fechadas:**
  - fonte de pessoas e contatos é a API oficial da Apollo, contratada pelo cliente; nada de LinkedIn automatizado;
  - endpoints usados na Fase 1 (conferir na documentação oficial vigente em `docs.apollo.io` antes de codar): busca de organizações `POST https://api.apollo.io/api/v1/mixed_companies/search`; busca de pessoas `POST https://api.apollo.io/api/v1/mixed_people/api_search` (não revela e-mail/telefone); enriquecimento `POST https://api.apollo.io/api/v1/people/match`; autenticação por cabeçalho `x-api-key`;
  - segredos `APOLLO_API_KEY` e `APOLLO_MODO` (`simulado` ou `real`); padrão `simulado` até a task de liberação da Apollo estar concluída;
  - créditos por endpoint vêm do plano contratado e ficam em `config.apollo.creditos_por_endpoint`; sem esse número o endpoint fica bloqueado;
  - não há nova tentativa dentro da mesma chamada: erro temporário é reprocessado pela próxima execução, até 3 tentativas no total.
- **Bloqueios:** chamadas reais dependem da task “Liberar o acesso à Apollo com limite mensal de créditos”. Tudo desta SPEC pode ser construído e provado em modo simulado antes disso.

## Resultado observável

Na Administração, a tela “Consumo da Apollo” mostra modo (simulado/real), teto do mês, créditos usados por perfil, últimas chamadas e alertas. Uma chamada que estouraria o teto não acontece e aparece como bloqueada; a chave nunca aparece em tela, resposta ou log.

## Limites e dependências

- **Inclui:** segredos; coleções `consumo_creditos` e `apollo_simulacoes`; chave `config.apollo`; módulo `pocketbase/hooks/lib/apollo.js`; tela Consumo da Apollo; amostra de cobertura com os bons exemplos do cliente.
- **Fora de escopo:** escolher quais empresas ou pessoas consultar (SPECs 1-004 e 1-006), conciliação automática com a fatura da Apollo, gestão de orçamento por período avançada (Fase 4).
- **Entradas e pré-condições:** app com login e papéis (SPEC-1-001); plano com acesso à API, chave mestra, teto mensal e créditos por endpoint informados pelo cliente; lista de bons exemplos (SPEC-1-002).
- **Saídas/artefatos:** módulo de chamada; registros de consumo; relatório de cobertura amostral em `05_entregas/fase-1/SPEC-1-003/cobertura.json`.
- **Dependências e responsáveis:** Primitivo (contrato, pagamento, chave e teto); Apollo (cobertura e disponibilidade).
- **Atores e permissões mínimas:** só hooks do servidor chamam a Apollo; `admin` vê consumo, troca o modo e pausa; `operador` vê o consumo do perfil; anônimo nada.
- **Superfícies/arquivos/configurações afetadas:** segredos do projeto Skip, `pocketbase/migrations/` (coleções desta SPEC e `config.apollo`), `pocketbase/hooks/lib/apollo.js`, tag no hook de auditoria, tela Consumo da Apollo.
- **Risco e plano B:** cobertura baixa ou custo alto → registrar no relatório e levar ao consultor; a operação segue com contato manual (SPEC-1-006), que não substitui o aceite da integração.
- **Rollback ou reversão:** `APOLLO_MODO = simulado` ou `config.apollo.pausado = true` interrompe chamadas reais na hora; migração com `down`.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| Apollo API | retorno original da Apollo | corpo JSON por endpoint; resposta resumida guardada sem e-mail/telefone em `consumo_creditos.resposta_resumo` | `x-api-key` com `APOLLO_API_KEY`; nunca no front | `timeout: 30`; sem retry imediato; `chave_idempotencia` única (endpoint + referência + dia ou lote) | 401/403 → `erro_credencial` e `config.apollo.pausado = true`; 429/5xx/transporte → `erro_temporario` (até 3 tentativas pelas execuções seguintes); 422 → `erro_requisicao` sem nova tentativa |
| `consumo_creditos` | app | `perfil`, `execucao` (opcional), `endpoint` (`organizacoes`/`pessoas_busca`/`pessoas_enriquecimento`), `referencia` (empresa ou pessoa), `creditos_estimados`, `creditos_reais` (conciliado pelo admin), `status` (`ok`/`simulado`/`bloqueado_teto`/`bloqueado_supressao`/`erro_credencial`/`erro_temporario`/`erro_requisicao`), `tentativas`, `chave_idempotencia` (único), `http_status`, `resposta_resumo`, `criado` | criação só por hook; leitura `admin` e `operador` (sem `resposta_resumo` para operador); sem exclusão | índice único em `chave_idempotencia` | falha ao gravar consumo cancela a chamada |
| `apollo_simulacoes` | app | `endpoint`, `chave_correspondencia`, `resposta` (json fictício) | somente `admin` | — | sem correspondência → resposta vazia simulada |
| `config.apollo` | app | `teto_creditos_mes_global`, `creditos_por_endpoint` (json), `custo_por_credito_brl` (opcional, do contrato), `pausado` | escrita `admin` | — | campo ausente bloqueia o endpoint correspondente |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-01 | consumo do mês (perfil ou global) + estimativa > teto | não chama; grava `bloqueado_teto`; alerta na Administração | nenhuma | RQ-006 |
| RN-02 | mesma `chave_idempotencia` já com `ok`/`simulado` | devolve o resultado registrado; não chama de novo | `admin` pode forçar nova chamada com motivo (nova chave) | RQ-017 |
| RN-03 | enriquecimento de pessoa com chave suprimida | não chama; grava `bloqueado_supressao` com zero crédito | nenhuma | DC-010, RQ-016 |
| RN-04 | `APOLLO_MODO = simulado` | usa `apollo_simulacoes`; créditos 0; status `simulado` | nenhuma | TDD |
| RN-05 | qualquer log ou resposta do app | nunca contém a chave; contém endpoint, status e referência | nenhuma | RQ-016 |

## Fluxo e regras

1. Criar segredos `APOLLO_MODO = simulado` e, quando a task de liberação for concluída, `APOLLO_API_KEY`.
2. Criar coleções, `config.apollo` e regras de acesso; acrescentar a tag no hook de auditoria.
3. Escrever `pocketbase/hooks/lib/apollo.js` com uma função `chamar({endpoint, corpo, perfilId, referencia, chaveIdempotencia})` que aplica, nesta ordem: pausa → modo → idempotência → supressão (só enriquecimento) → teto → chamada → registro.
4. Montar a tela Consumo da Apollo.
5. Popular `apollo_simulacoes` com respostas fictícias dos três endpoints e provar RN-01 a RN-05 em modo simulado.
6. Depois da liberação: no projeto de produção, cadastrar a chave, trocar para `real`, rodar a busca de organizações com os cinco bons exemplos do cliente (nome + UF) e registrar quantos foram encontrados em `cobertura.json`. O projeto `radar-primitivo-teste` fica sempre em `simulado` e sem chave real.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | chamada dentro do teto | resposta usada; 1 linha `ok` | — |
| Limite | consumo do mês = teto − 1 e estimativa 2 | não chama; `bloqueado_teto`; alerta | admin ajusta teto com aprovação do cliente |
| Falha | Apollo devolve 503 | `erro_temporario`; dado existente intacto | reprocessa na próxima execução (máx. 3) |
| Falha | chave inválida (401) | `erro_credencial`; chamadas pausadas | admin corrige a chave e despausa |
| Limite | mesma chamada repetida | nenhuma chamada nova | — |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** esta SPEC, o que existir em `07-sistemas/radar-primitivo/`, o guia de hooks do Skip (segredos e `$http.send`) e a documentação oficial dos três endpoints da Apollo.
2. **Alterar somente:** segredos, coleções, módulo e tela desta SPEC, testes e evidências.
3. **Não alterar:** a chave fora do cofre; não chamar a Apollo de nenhum outro arquivo; não usar endpoint diferente dos três listados.
4. **Executar nesta ordem:** segredos (modo simulado) → coleções → módulo → tela → simulações → provas simuladas → (após liberação) modo real → amostra de cobertura.
5. **Parar e pedir validação quando:** a documentação oficial divergir do contrato desta SPEC (caminho, autenticação ou regra de crédito), faltar o número de créditos por endpoint, o plano não der acesso à API ou a amostra de cobertura encontrar menos da metade dos bons exemplos.
6. **Estado válido ao parar:** modo simulado ativo ou chamadas reais pausadas; nenhum consumo sem registro.

## Checklist de execução

- [ ] segredos criados; modo simulado por padrão
- [ ] coleções e `config.apollo` com regras de acesso
- [ ] módulo único de chamada com pausa, modo, idempotência, supressão, teto e registro
- [ ] tela Consumo da Apollo
- [ ] provas simuladas de teto, idempotência, erro e credencial
- [ ] modo real ligado após a liberação; amostra de cobertura registrada
- [ ] evidências em `05_entregas/fase-1/SPEC-1-003/`

## Critérios de aceite

- [ ] **CA-1-09:** a chave da Apollo existe só no cofre do Skip; nenhuma tela, resposta do app ou log a contém.
- [ ] **CA-1-10:** toda chamada, real ou simulada, gera uma linha em `consumo_creditos` com endpoint, perfil, créditos estimados e status; repetir a mesma chave de idempotência não chama de novo.
- [ ] **CA-1-11:** uma chamada que ultrapassaria o teto do mês não é feita, fica `bloqueado_teto` e aparece como alerta, sem derrubar o app.
- [ ] **CA-1-12:** Apollo fora do ar ou chave inválida não apaga nem corrompe dados; erro temporário é reprocessado no máximo 3 vezes e chave inválida pausa as chamadas.
- [ ] **CA-1-13:** com o plano real, a busca de organizações com os cinco bons exemplos do cliente responde e a cobertura encontrada fica registrada.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | `apollo.test.mjs` (modo simulado): consumo acima do teto, chave de idempotência repetida, resposta 503 e 401 simuladas, busca do valor da chave nas respostas do app e conferência manual dos logs do projeto no Skip | `node --test 07-sistemas/radar-primitivo/testes/apollo.test.mjs` antes do módulo | chamadas feitas e sem registro (falha esperada) — CA-1-10, CA-1-11, CA-1-12 | `05_entregas/fase-1/SPEC-1-003/red.txt` |
| GREEN | mesmo arquivo com o módulo pronto | mesmo comando | teto bloqueia; idempotência evita 2ª chamada; 503 → `erro_temporario`; 401 → pausa; nenhuma ocorrência da chave — CA-1-09 a CA-1-12 | `green.txt` |
| REFACTOR/REGRESSÃO | suíte completa + chamada real única de busca de organizações com os bons exemplos | `node --test 07-sistemas/radar-primitivo/testes/` e rota `POST /backend/v1/admin/apollo/cobertura` | suíte verde; `cobertura.json` com encontrados/total — CA-1-13 | `green.txt` + `cobertura.json` |

**Dados/fixtures:** os testes automáticos rodam no projeto `radar-primitivo-teste` (`RADAR_URL`), nunca no de produção; `apollo_simulacoes` com 3 organizações, 4 pessoas e 2 enriquecimentos fictícios; respostas simuladas 503 e 401; teto de teste = 5 créditos.  
**Caminhos de erro obrigatórios:** teto atingido, idempotência, 401, 429/503, timeout, supressão, campo de créditos ausente.  
**Evidência exigida:** RED/GREEN, captura da tela Consumo da Apollo, `cobertura.json`.

## Teste humano do cliente

- **Origem:** não aplicável (a liberação da Apollo é pré-condição `CL-PEND-002`, não teste).

## Handoff e operação

- **Como demonstrar:** mostrar o modo, o teto e uma chamada bloqueada por teto em modo simulado; mostrar a amostra de cobertura real.
- **Como operar depois:** o administrador concilia `creditos_reais` com o painel da Apollo toda sexta-feira e ajusta o teto somente com aprovação do cliente.
- **Como monitorar:** alerta de teto ≥ 80% e de credencial na Administração.
- **Pendência conhecida:** conciliação automática com fatura fica para a Fase 4.

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|---|
| c5e72ce3-d293-46c7-a104-67e8f2a0993d | Liberar o acesso à Apollo com limite mensal de créditos | Primitivo | SPEC-1-003 | CA-1-13 (pré-condição) | plano, chave e teto disponíveis | confirmação do cliente | G-01 |
| f97fc9b8-69e4-49c7-a3c8-cb6e648b56a5 | Confirmar o plano da Apollo com acesso à API | Primitivo | SPEC-1-003 | CA-1-13 (pré-condição) | plano com API e créditos por endpoint | captura do plano | — |
| 8bf96caf-e6b7-4e95-b440-113fd5544461 | Definir o teto mensal de créditos e o custo por contato | Primitivo | SPEC-1-003 | CA-1-11 (pré-condição) | valores em `config.apollo` | mensagem do cliente | plano confirmado |
| c025b258-9ed3-42d4-a9a8-7cd6999f5786 | Cadastrar a chave da Apollo no cofre do Skip | Primitivo | SPEC-1-003 | CA-1-09 | segredo existe; nenhuma ocorrência fora do cofre | captura da lista de segredos (sem valor) | plano confirmado |
| c342f4e5-ab24-4894-a4ee-0fedd9380088 | Conectar o app à Apollo com controle de créditos | Primitivo | SPEC-1-003 | CA-1-09, CA-1-10 | RED/GREEN de `apollo.test.mjs` | `green.txt` | app com login |
| 3fb35c66-3910-47a9-9467-2264c7a1293f | Registrar cada consumo de créditos da Apollo | Primitivo | SPEC-1-003 | CA-1-10 | casos de registro e idempotência | `green.txt` | módulo criado |
| af955f24-6373-47bf-9ee5-6faaa72cf1f5 | Bloquear chamadas acima do teto | Primitivo | SPEC-1-003 | CA-1-11 | caso de teto | `green.txt` + captura do alerta | módulo criado |
| cbfebd9a-e04c-4066-b13f-7cce062c8558 | Medir a cobertura da Apollo com os bons exemplos | Primitivo | SPEC-1-003 | CA-1-13 | chamada real única | `cobertura.json` | chave cadastrada; bons exemplos enviados |
| a9202438-5f6f-43ca-bb0e-58137ea6b3e6 | Testar a Apollo fora do ar e o teto atingido | Primitivo | SPEC-1-003 | CA-1-11, CA-1-12 | casos 401/503/teto com as rotinas das SPECs 1-004 e 1-006 | `green.txt` | rotinas de descoberta e contatos prontas |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
