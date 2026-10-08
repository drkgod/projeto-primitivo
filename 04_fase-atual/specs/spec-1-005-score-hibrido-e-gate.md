# SPEC-1-005 — Score híbrido explicável e gate da empresa

**Fase:** 1  
**Status:** planejada  
**Dono:** Primitivo (execução com o Maestro; critérios e conferência pelo Country Manager); aceite do consultor Rodrigo Santos  
**Origem no escopo:** DC-003, DC-008; RQ-004; gate G-03; critérios da Fase 1 “recebe score auditável” e “empresa abaixo do gate não consome enriquecimento”; checklist `CL-001`, `CL-PEND-008`  
**Degrau da solução:** construção mínima — regras determinísticas em hook do Skip, lendo os critérios do perfil; sem IA, sem biblioteca externa, porque a nota precisa ser auditável sem consultar código ou prompt.

## Contexto e decisões fechadas

- **Estado atual:** a prioridade de cada empresa depende da memória do Country Manager.
- **Estado desejado:** toda empresa descoberta recebe uma nota de fit, uma faixa A/B/C/D e a explicação critério a critério; só as faixas liberadas no perfil seguem para busca de decisores.
- **Decisões já fechadas:**
  - modelo híbrido: critérios objetivos do perfil + validação do gestor por empresa, com motivo;
  - estados de cada critério: `confirmado` (dado da fonte oficial ou da Apollo que atende a regra), `inferido` (coincidência só por texto: nome ou palavra-chave), `desconhecido` (sem dado);
  - pontos: `confirmado` soma os pontos do critério; `inferido` soma `perfil.peso_inferido` % dos pontos (padrão 50, arredondado para baixo); `desconhecido` soma 0;
  - impeditivo violado com dado `confirmado` bloqueia a empresa (faixa D, `bloqueada = true`, motivo); impeditivo `desconhecido` não bloqueia, mas reduz a confiança;
  - faixa pelo percentual da nota máxima do perfil, com limites em `perfil.faixas` (ex.: A ≥ 75, B ≥ 55, C ≥ 35, D abaixo — valores finais aprovados pelo Country Manager);
  - fit não fala de crédito, risco ou capacidade de pagamento;
  - pesos nunca mudam sozinhos; mudança = nova versão do perfil.
- **Bloqueios:** a versão 1 real depende dos critérios e dos 10 exemplos enviados pelo cliente; a prioridade automática só vale depois da conferência do Country Manager (G-03).

## Resultado observável

Na ficha, o bloco “Por que esta nota” mostra cada critério com ✓/✗/?, os pontos, a fonte e a data do dado, a faixa e a versão do perfil. Empresas fora das faixas liberadas não aparecem para busca de decisores.

## Limites e dependências

- **Inclui:** campo `peso_inferido` no perfil; coleção `scores`; rotina `score_diario`; recálculo por mudança de empresa, de versão do perfil ou validação do gestor; ajuste do gestor com motivo; gate para `aprovada_pesquisa`; amostra conhecida; bloco de explicação na ficha.
- **Fora de escopo:** calibração periódica e comparação de versões com métricas (Fase 4), score de risco/crédito (Fase 2 como estado humano), aprendizado automático de pesos.
- **Entradas e pré-condições:** empresas da SPEC-1-004; perfil ativo com critérios e faixas (SPEC-1-002); 5 bons e 5 maus exemplos do cliente.
- **Saídas/artefatos:** notas atuais e históricas; relatório da amostra conhecida em `05_entregas/fase-1/SPEC-1-005/amostra.json`.
- **Dependências e responsáveis:** Primitivo (critérios, conferência e execução).
- **Atores e permissões mínimas:** rotina grava nota; `operador` faz ajuste do gestor com motivo e lê; `admin` também; anônimo nada.
- **Superfícies/arquivos/configurações afetadas:** migração (coleção `scores`, campo `peso_inferido` em `perfis_busca`), `pocketbase/hooks/score.pb.js`, `pocketbase/hooks/lib/score.js`, tag de auditoria, bloco “Por que esta nota” na ficha.
- **Risco e plano B:** dados públicos pouco discriminantes deixam muitas empresas na mesma faixa → Country Manager ajusta pesos em nova versão; se a amostra não separar bons e maus, a prioridade automática não é liberada e a fila mostra a ordem por data com aviso.
- **Rollback ou reversão:** reativar a versão anterior do perfil recalcula as notas; notas antigas ficam com `atual = false`.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `scores` | app | `empresa`, `perfil`, `perfil_versao`, `nota`, `nota_maxima`, `percentual`, `faixa` (`A`–`D`), `bloqueada`, `motivo_bloqueio`, `confianca` (% de critérios `confirmado`), `decomposicao` (json: `criterio_id`, `nome`, `estado`, `pontos_obtidos`, `pontos_possiveis`, `evidencia` {fonte, campo, valor, coletado_em}, `impeditivo_violado`), `ajuste_gestor` (pontos, motivo, usuário), `atual` (bool), `calculado_em` | criação por hook; leitura logado; ajuste do gestor por rota com motivo | um `atual = true` por empresa + perfil; recálculo com mesma versão e mesmos dados não cria linha nova | critério com tipo desconhecido → `desconhecido` e alerta ao admin |
| Critérios | `perfis_versoes.snapshot` | contrato `criterios` da SPEC-1-002 | — | — | — |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-01 | critério sem dado | `desconhecido`, 0 ponto | — | DC-008 |
| RN-02 | impeditivo violado com dado confirmado | `bloqueada = true`, faixa D, motivo | — | RQ-004 |
| RN-03 | faixa em `faixas_liberadas` e não bloqueada | `empresas.estado = aprovada_pesquisa` | decisão “descartar” do gestor prevalece | RQ-005 |
| RN-04 | faixa fora das liberadas | `empresas.estado = avaliada`; nenhuma chamada de pessoas ou enriquecimento | o gestor pode aprovar manualmente com motivo (fica auditado e marcado “aprovação manual”) | RQ-005 |
| RN-05 | ajuste do gestor | até ± o valor de `regra` do critério `validacao_gestor`; motivo obrigatório | sem critério `validacao_gestor` no perfil → ajuste desabilitado | DC-008 |
| RN-06 | nova versão do perfil ativada | recalcular todas as empresas do perfil | — | RQ-004 |

## Fluxo e regras

1. Migração: coleção `scores` e campo `peso_inferido` (padrão 50).
2. `lib/score.js`: função pura `calcular(empresa, origens, versaoPerfil, ajuste)` que devolve nota, faixa, bloqueio, confiança e decomposição.
3. Rotina `score_diario` com `cronAdd("score_diario", "40 8 * * 1-5", …)` (UTC = 05:40 de Brasília) para empresas novas/alteradas e hook de recálculo ao ativar versão do perfil.
4. Gate: atualizar `empresas.estado` conforme RN-03/RN-04.
5. Bloco “Por que esta nota” na ficha e ação “Ajustar nota” com motivo.
6. Amostra conhecida: incluir os 10 exemplos do cliente (inclusão manual com motivo `carga_historica`, se a descoberta não os trouxe), calcular e gerar `amostra.json` com faixa esperada × obtida; Country Manager confere e aprova ou pede nova versão.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | empresa com UF e atividade confirmadas | nota e faixa com decomposição | — |
| Limite | empresa só com nome parecido | critério `inferido` com metade dos pontos | gestor pode ajustar com motivo |
| Falha | impeditivo confirmado | bloqueada, faixa D | gestor descarta ou reabre com motivo |
| Limite | volta à versão anterior | notas recalculadas; históricas preservadas | — |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** esta SPEC, o que existir em `07-sistemas/radar-primitivo/` e o contrato `criterios` descrito na SPEC-1-002.
2. **Alterar somente:** coleção `scores`, campo `peso_inferido`, hooks e bloco de tela desta SPEC, testes e evidências.
3. **Não alterar:** critérios e pesos do perfil (só o Country Manager, por nova versão); dados das empresas; nenhuma chamada à Apollo.
4. **Executar nesta ordem:** migração → função pura com testes → rotina e recálculo → gate → tela → amostra conhecida.
5. **Parar e pedir validação quando:** a amostra conhecida tiver 2 ou mais exemplos fora da faixa esperada, o cliente pedir critério fora do contrato, ou quase todas as empresas ficarem na mesma faixa.
6. **Estado válido ao parar:** notas consistentes com a versão ativa; nenhuma empresa fora das faixas liberadas em `aprovada_pesquisa` sem aprovação manual auditada.

## Checklist de execução

- [ ] função de cálculo pura com testes
- [ ] rotina diária e recálculo por versão
- [ ] gate atualizando o estado da empresa
- [ ] bloco “Por que esta nota” e ajuste com motivo
- [ ] amostra conhecida calculada e conferida pelo Country Manager
- [ ] evidências em `05_entregas/fase-1/SPEC-1-005/`

## Critérios de aceite

- [ ] **CA-1-19:** toda empresa avaliada tem nota, faixa, decomposição por critério com estado e evidência, e a versão do perfil usada.
- [ ] **CA-1-20:** dado desconhecido não soma ponto; impeditivo violado com dado confirmado bloqueia a empresa com motivo.
- [ ] **CA-1-21:** só empresas nas faixas liberadas e sem bloqueio passam para `aprovada_pesquisa`; as demais não geram chamada de pessoas nem de enriquecimento.
- [ ] **CA-1-22:** voltar para a versão anterior do perfil recalcula as notas e preserva as notas antigas no histórico.
- [ ] **CA-1-23:** com os 5 bons e 5 maus exemplos do cliente, o Country Manager confere o resultado e aprova a versão 1 dos critérios.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | `score.test.mjs` com 6 empresas fictícias (completa, só nome parecido, sem UF, impeditivo confirmado, impeditivo desconhecido, fora da faixa) | `node --test 07-sistemas/radar-primitivo/testes/score.test.mjs` antes da função | notas sem decomposição ou desconhecido pontuando (falha esperada) — CA-1-19, CA-1-20 | `05_entregas/fase-1/SPEC-1-005/red.txt` |
| GREEN | mesmo arquivo + `gate.test.mjs` (contagem de chamadas simuladas à Apollo = 0 para faixas não liberadas) | `node --test 07-sistemas/radar-primitivo/testes/` | faixas e bloqueios esperados; zero chamada para empresas fora do gate — CA-1-19 a CA-1-21 | `green.txt` |
| REFACTOR/REGRESSÃO | ativar versão 2 com pesos diferentes, voltar à 1; suíte completa; amostra conhecida | mesmo comando + rota `POST /backend/v1/admin/score/amostra` | histórico preservado; notas da v1 restauradas; `amostra.json` gerado — CA-1-22, CA-1-23 | `green.txt` + `amostra.json` + mensagem do Country Manager |

**Dados/fixtures:** os testes automáticos rodam no projeto `radar-primitivo-teste` (`RADAR_URL`), nunca no de produção; 6 empresas fictícias com origens; `perfil-teste.json` com 5 critérios (1 impeditivo) e faixas de teste.  
**Caminhos de erro obrigatórios:** critério desconhecido, impeditivo confirmado, impeditivo desconhecido, ajuste sem motivo, versão trocada.  
**Evidência exigida:** RED/GREEN, `amostra.json`, captura do bloco “Por que esta nota”, aprovação do Country Manager.

## Teste humano do cliente

- **Origem:** `CL-PEND-008` (conferir a nota com empresas conhecidas; a confirmar com o cliente).
- **Quem testa:** Leonardo Motta Berzaghi (Country Manager).
- **Passos:** abrir a lista da amostra conhecida → ver faixa e explicação de cada um dos 10 exemplos → marcar “confere” ou “não confere” com motivo.
- **Resultado esperado:** bons exemplos em A/B, maus em C/D ou bloqueados; explicação compreensível sem ajuda técnica.
- **Evidência do aceite:** `amostra.json` com a marcação do Country Manager e mensagem de aprovação da versão 1.

## Handoff e operação

- **Como demonstrar:** abrir a ficha de um bom exemplo e de um mau exemplo e ler “Por que esta nota”.
- **Como operar depois:** o Country Manager ajusta pesos criando nova versão do perfil; usa “Ajustar nota” só com motivo.
- **Como monitorar:** distribuição por faixa na tela Fontes e execuções; alerta se mais de 80% das empresas ficarem numa só faixa.
- **Pendência conhecida:** calibração com resultado real e comparação de versões ficam para a Fase 4.

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|---|
| 39e37980-a89b-4e2f-8d7e-82d2da3decb1 | Calcular a nota de cada empresa com explicação | Primitivo | SPEC-1-005 | CA-1-19, CA-1-20 | GREEN de `score.test.mjs` | `green.txt` | empresas descobertas; perfil ativo |
| 54fa2b52-0947-4f36-a29e-395f3b5e723d | Aplicar os critérios e pesos aprovados | Primitivo | SPEC-1-005 | CA-1-19, CA-1-20 | função pura + rotina diária | `green.txt` | perfil ativo |
| 9177ae39-b81b-4c80-87e0-aaf203f405d8 | Mostrar por que a empresa ganhou ou perdeu pontos | Primitivo | SPEC-1-005 | CA-1-19 | bloco “Por que esta nota” | captura da ficha | notas calculadas |
| d0eb365c-491c-4cd2-bd00-93a5540a0583 | Voltar a nota para a versão anterior | Primitivo | SPEC-1-005 | CA-1-22 | troca de versão e retorno | `green.txt` | duas versões do perfil |
| 3711059c-c7f6-4bf3-bd18-48d92e962e0c | Liberar para contatos só as empresas aprovadas na nota | Primitivo | SPEC-1-005 | CA-1-21 | `gate.test.mjs` | `green.txt` | notas calculadas |
| b1801004-71d4-4cc4-a1d0-f3cda7eee2a0 | Conferir a nota com empresas conhecidas | Primitivo | SPEC-1-005 | CA-1-23 | amostra conhecida + teste humano | `amostra.json` + aprovação | 10 exemplos do cliente |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
