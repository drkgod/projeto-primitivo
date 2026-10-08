# SPEC-1-004 — Descoberta automática e ficha da empresa

**Fase:** 1  
**Status:** planejada  
**Dono:** Primitivo (aprovação da fonte e execução com o Maestro); aceite do consultor Rodrigo Santos  
**Origem no escopo:** DC-003, DC-011, DC-013; RQ-002, RQ-003, RQ-017; gate G-01A; critérios da Fase 1 “execução programada, sem upload de lista…” e “uma empresa entra por ao menos duas rotas, é consolidada…”; checklist `CL-PEND-003`  
**Degrau da solução:** nativo da plataforma — rotinas agendadas (`cronAdd`), hooks, `$http.send` e coleções do Skip; a busca na Apollo passa pelo módulo da SPEC-1-003. Construção mínima só da normalização e da deduplicação.

## Contexto e decisões fechadas

- **Estado atual:** o Country Manager procura empresas manualmente; não há base estruturada.
- **Estado desejado:** em dias úteis, antes da fila das 07:00, o app busca sozinho empresas do perfil ativo em duas rotas — base oficial SIPEAGRO (estabelecimentos de fertilizantes registrados no MAPA, dados abertos) e busca de organizações da Apollo — normaliza, junta repetidas e guarda origem e data de cada dado. Planilha e inclusão manual existem só como contingência, correção ou carga histórica.
- **Decisões já fechadas:**
  - rotas automáticas da Fase 1: `sipeagro` e `apollo_organizacoes`; vigentes somente com `fontes.aprovada = true`, registrado na task de aprovação da fonte;
  - o CNPJ da base SIPEAGRO vem mascarado: guardar como veio em `cnpj_mascarado` e deixar `cnpj` vazio; nunca reconstruir CNPJ;
  - chave de consolidação, nesta ordem: CNPJ completo igual → domínio igual → nome normalizado + UF + município iguais; qualquer outro caso parecido vai para revisão humana;
  - nome normalizado: minúsculas, sem acentos, sem pontuação e sem os sufixos `ltda`, `s a`, `sa`, `eireli`, `me`, `epp`, `ss`;
  - horário: `descoberta_diaria` com `cronAdd("descoberta_diaria", "0 8 * * 1-5", …)` (UTC = 05:00 de Brasília);
  - uma execução processa no máximo 2.000 linhas da base oficial e o número de páginas da Apollo definido em `config.descoberta.paginas_apollo_por_execucao` (padrão 1 página de 25); o restante continua na execução seguinte pelo cursor.
- **Bloqueios:** a URL exata do arquivo da base oficial, o termo de uso e a aprovação das duas rotas vêm da task “Aprovar a fonte inicial de empresas”. A rota Apollo real depende da liberação da Apollo (SPEC-1-003).

## Resultado observável

Sem ninguém subir lista, o app amanhece com empresas novas do perfil ativo. Cada ficha mostra de onde veio cada dado e quando foi coletado; uma empresa encontrada nas duas rotas aparece uma vez só, com as duas origens.

## Limites e dependências

- **Inclui:** coleções `fontes`, `execucoes`, `empresas`, `empresa_origens`, `revisoes_fusao`; leitura da base oficial; busca de organizações na Apollo; normalização; consolidação; revisão de casos ambíguos; separar fusão; planilha e inclusão manual de contingência; tela Fontes e execuções; ficha mínima da empresa.
- **Fora de escopo:** nota da empresa (SPEC-1-005), pessoas e contatos (SPEC-1-006), dados abertos completos do CNPJ da Receita (arquivo nacional muito grande para esta fase; pode entrar como emenda), outras APIs pagas, radar.
- **Entradas e pré-condições:** perfil ativo (SPEC-1-002); módulo Apollo (SPEC-1-003); aprovação da fonte com URL, termo de uso e cadência.
- **Saídas/artefatos:** empresas consolidadas com origem; relatório de exceções por execução; evidências em `05_entregas/fase-1/SPEC-1-004/`.
- **Dependências e responsáveis:** Primitivo (aprovação e execução); MAPA/dados.gov.br e Apollo (disponibilidade).
- **Atores e permissões mínimas:** rotinas do servidor gravam; `operador` lê fichas e decide revisões de fusão; `admin` também envia planilha, aprova fonte e força execução; anônimo nada.
- **Superfícies/arquivos/configurações afetadas:** `pocketbase/migrations/` (coleções desta SPEC e `config.descoberta`), `pocketbase/hooks/descoberta.pb.js`, `pocketbase/hooks/lib/normalizacao.js`, tag no hook de auditoria, telas Fontes e execuções, Revisão de fusões e Ficha da empresa.
- **Risco e plano B:** base oficial fora do ar ou com colunas diferentes → execução `falhou`/`parcial` e dados anteriores mantidos; Apollo com pouca cobertura → a base oficial sustenta a rotina e a planilha cobre exceções com motivo.
- **Rollback ou reversão:** cada execução tem id; “Desfazer execução” (admin) marca como `revertida` as origens daquele lote e remove empresas que só existiam por ele, com auditoria; “Separar” desfaz uma fusão.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| Base oficial SIPEAGRO (arquivo CSV em dados.gov.br) | MAPA | colunas reais mapeadas em `fontes.config.mapeamento` para: razão social, CNPJ mascarado, município, UF, atividade/categoria, situação | pública; sem credencial | `timeout: 120`; hash SHA-256 do arquivo: igual ao da última execução completa → “sem novidade”; cursor por linha | arquivo > 20 MB, sem coluna de razão social ou UF → `falhou` com motivo; linha sem razão social → exceção |
| Apollo — busca de organizações (via módulo da SPEC-1-003) | Apollo | corpo: `organization_locations` (UFs do perfil como “<Estado>, Brazil”), `q_organization_keyword_tags` (termos de segmento), `organization_num_employees_ranges` (do porte, quando houver), `page`, `per_page: 25`; leitura: `id`, `name`, domínio/site, cidade/estado quando presentes | módulo da SPEC-1-003 | chave de idempotência = perfil + página + data | erros conforme SPEC-1-003; resposta sem cidade/estado → campo desconhecido |
| `fontes` | app | `nome`, `tipo` (`sipeagro`/`apollo_organizacoes`/`planilha`/`manual`), `config` (url, mapeamento, filtros), `termo_uso`, `aprovada`, `aprovada_por`, `aprovada_em`, `status` (`ok`/`indisponivel`), `ultima_execucao` | leitura logado; escrita `admin` | — | fonte não aprovada não executa |
| `execucoes` | app | `fonte`, `perfil`, `inicio`, `fim`, `status` (`em_andamento`/`concluida`/`parcial`/`falhou`/`revertida`), `lidos`, `novos`, `atualizados`, `ambiguos`, `invalidos`, `cursor`, `hash_arquivo`, `chave_idempotencia` (fonte + perfil + data, única), `motivo` (obrigatório para planilha/manual), `excecoes` (json) | criação por rotina ou `admin`; leitura logado | reexecutar no mesmo dia continua do cursor | falha mantém o que já foi gravado e consistente |
| `empresas` | app | `razao_social`, `nome_normalizado`, `cnpj` (texto 14, opcional), `cnpj_mascarado`, `municipio`, `uf`, `dominio`, `aliases` (json), `atividades` (lista), `situacao`, `funcionarios`, `apollo_org_id`, `perfis` (relação), `estado` (`importada`/`em_consolidacao`/`incompleta`/`avaliada`/`aprovada_pesquisa`/`adiada`/`descartada`/`reaberta`), `resultado_pessoas`, `pessoas_buscadas_em` | leitura logado; escrita por rotina e ações da ficha | índice único parcial em `cnpj` quando não vazio | — |
| `empresa_origens` | app | `empresa`, `fonte`, `execucao`, `id_na_fonte`, `dados_originais` (json), `coletado_em`, `divergencias` (json), `revertida` (bool) | leitura logado; criação por rotina | índice único (`fonte`, `id_na_fonte`) | — |
| `revisoes_fusao` | app | `empresa`, `candidato` (json ou relação), `motivo`, `estado` (`pendente`/`fundida`/`separada`), `decidido_por`, `decidido_em` | `operador`/`admin` | — | — |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-01 | linha/organização fora das UFs do perfil, situação inativa ou em `contas_excluidas` | não cria empresa; conta em `invalidos` com motivo | nenhuma | RQ-002, perfil |
| RN-02 | chave de consolidação igual e sem CNPJ conflitante | junta na mesma empresa; nova linha em `empresa_origens`; valores diferentes vão para `divergencias` | — | RQ-003 |
| RN-03 | mesmo nome normalizado + UF com município diferente ou ausente em um dos lados | não junta; cria `revisoes_fusao` pendente | — | RQ-003 |
| RN-04 | CNPJ informado (planilha/manual) | remover pontuação, maiúsculas, exigir 14 caracteres (12 letras/dígitos + 2 dígitos); senão rejeitar a linha | — | RQ-003 |
| RN-05 | “Separar” uma fusão | recria a empresa a partir das origens dela; a nota é recalculada para as duas; pessoas ligadas ficam `pendente_redistribuicao` e itens de fila ficam `bloqueado` com motivo “redistribuição pendente”, até decisão humana | — | RQ-003 |
| RN-06 | planilha ou inclusão manual | exige motivo `contingencia`, `correcao` ou `carga_historica`; origem marcada | — | DC-011 |
| RN-07 | fonte indisponível | não apaga nada; `fontes.status = indisponivel`; após 3 dias úteis sem sucesso, aviso em “Meu dia” | — | RQ-017 |

## Fluxo e regras

1. Criar coleções, `config.descoberta` e regras de acesso; acrescentar as tags no hook de auditoria.
2. Registrar as duas fontes (`sipeagro`, `apollo_organizacoes`) com `aprovada = false`; na task de aprovação, gravar URL exata do arquivo, termo de uso, cadência e `aprovada = true`.
3. Escrever `lib/normalizacao.js` (nome, CNPJ, UF, domínio) e a consolidação (RN-02/RN-03).
4. Escrever a rotina `descoberta_diaria`: para cada perfil ativo → base oficial (baixar, comparar hash, mapear, filtrar, consolidar em lotes) → Apollo (páginas permitidas pelo teto) → fechar execução com contagens.
5. Montar as telas: Fontes e execuções (status, contagens, exceções, “executar agora”, “desfazer execução”), Revisão de fusões (juntar ou manter separadas), Ficha mínima (dados, origens com data, divergências).
6. Montar envio de planilha (modelo: `razao_social, cnpj, municipio, uf, dominio, observacao`) e inclusão manual, ambos com motivo.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | perfil ativo, fontes aprovadas | empresas novas com origem e data | — |
| Principal | mesma empresa na base oficial e na Apollo (nome + UF + município) | 1 empresa, 2 origens | — |
| Limite | mesmo nome e UF, município diferente | 2 empresas + 1 revisão pendente | operador decide |
| Falha | arquivo oficial indisponível | execução `falhou`; empresas antigas intactas | próxima execução tenta de novo |
| Limite | mesma execução rodada duas vezes | nenhuma duplicata | — |

## Instruções de execução para o Ethos

1. **Ler antes de alterar:** esta SPEC, o que existir em `07-sistemas/radar-primitivo/`, os guias de hooks e migrações do Skip e a página do conjunto de dados SIPEAGRO em dados.gov.br.
2. **Alterar somente:** coleções, hooks, telas, testes e evidências desta SPEC.
3. **Não alterar:** o módulo da Apollo (só usar); perfis; nunca chamar a Apollo fora do módulo; não usar outra fonte além das duas aprovadas.
4. **Executar nesta ordem:** coleções → fontes não aprovadas → normalização e consolidação com fixtures → rotina com base oficial → rotina com Apollo (simulado, depois real) → telas → planilha/manual → provas → agendamento.
5. **Parar e pedir validação quando:** a fonte não estiver aprovada, o arquivo oficial não tiver razão social ou UF, a cobertura combinada do perfil for zero, ou surgir necessidade de outra fonte.
6. **Estado válido ao parar:** nenhuma empresa duplicada; execuções com status correto; rotina pausada se a fonte não estiver aprovada.

## Checklist de execução

- [ ] coleções e regras de acesso
- [ ] fontes registradas e aprovadas com URL, termo de uso e cadência
- [ ] normalização e consolidação provadas com fixtures
- [ ] rotina diária com base oficial e Apollo, em lotes e idempotente
- [ ] telas de fontes, revisão de fusões e ficha mínima
- [ ] planilha e manual só com motivo
- [ ] falha de fonte e lote repetido provados
- [ ] evidências em `05_entregas/fase-1/SPEC-1-004/`

## Critérios de aceite

- [ ] **CA-1-14:** a execução agendada, sem upload de lista, busca empresas do perfil ativo na base oficial e na Apollo, e cada empresa mostra fonte e data de coleta.
- [ ] **CA-1-15:** a mesma empresa vinda das duas rotas vira uma ficha com as duas origens; caso ambíguo vai para revisão e não é fundido sozinho; “Separar” devolve as duas empresas.
- [ ] **CA-1-16:** CNPJ fica como texto de 14 caracteres (numérico ou alfanumérico) ou vazio quando a fonte o mascara; nunca é convertido em número.
- [ ] **CA-1-17:** rodar o mesmo lote duas vezes não duplica empresas nem origens; fonte fora do ar não apaga registros e deixa a falha visível.
- [ ] **CA-1-18:** planilha e inclusão manual só entram com motivo de contingência, correção ou carga histórica e ficam marcadas com essa origem.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | `descoberta.test.mjs` com `sipeagro-amostra.csv` (8 linhas fictícias: 2 repetidas, 1 inativa, 1 fora da UF, 1 sem razão social, CNPJs mascarados) + organizações simuladas (1 igual a uma linha da base) | `node --test 07-sistemas/radar-primitivo/testes/descoberta.test.mjs` antes da rotina | contagens erradas/duplicatas (falha esperada) — CA-1-14 a CA-1-16 | `05_entregas/fase-1/SPEC-1-004/red.txt` |
| GREEN | mesmo arquivo + `cnpj.test.mjs` (formatos numérico, alfanumérico e mascarado) | `node --test 07-sistemas/radar-primitivo/testes/` | 4 novas, 1 consolidada com 2 origens, 1 revisão, 2 inválidas com motivo; CNPJ como texto — CA-1-14, CA-1-15, CA-1-16 | `green.txt` |
| REFACTOR/REGRESSÃO | rodar a mesma execução 2×; simular URL fora do ar; enviar planilha sem motivo e com motivo; suíte completa | mesmo comando | sem duplicatas; `falhou` sem perda; planilha sem motivo rejeitada — CA-1-17, CA-1-18 | `green.txt` + captura da tela Fontes e execuções |

**Dados/fixtures:** os testes automáticos rodam no projeto `radar-primitivo-teste` (`RADAR_URL`), nunca no de produção; `sipeagro-amostra.csv`, `apollo_simulacoes` de organizações, `planilha-contingencia.csv` (3 linhas, 1 com CNPJ alfanumérico).  
**Caminhos de erro obrigatórios:** fonte não aprovada, arquivo indisponível, coluna ausente, linha inválida, lote repetido, empresa ambígua, planilha sem motivo.  
**Evidência exigida:** RED/GREEN, relatório da primeira execução real (contagens por rota) e captura da ficha com duas origens.

## Teste humano do cliente

- **Origem:** não aplicável (a aprovação da fonte é pré-condição `CL-PEND-003`; o aceite da jornada fica na SPEC-1-007).

## Handoff e operação

- **Como demonstrar:** mostrar a execução da manhã com contagens e uma ficha com duas origens; mostrar uma revisão de fusão.
- **Como operar depois:** o Country Manager resolve revisões pendentes em “Revisão de fusões”; o administrador acompanha falhas em “Fontes e execuções”.
- **Como monitorar:** status da última execução por fonte e aviso após 3 dias úteis sem sucesso.
- **Pendência conhecida:** dados abertos completos do CNPJ ficam fora desta fase.

## Tasks vinculadas

| ID | Task | Dono | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|---|
| 8f422530-9b50-4607-be7f-8c9b35f27e0a | Aprovar a fonte inicial de empresas | Primitivo | SPEC-1-004 | CA-1-14 (pré-condição) | fontes com `aprovada = true`, URL e termo de uso | registro da aprovação | G-01A |
| 7ada1a8b-83db-451a-b582-3fb3ab2c6e27 | Buscar empresas automaticamente a partir do perfil | Primitivo | SPEC-1-004 | CA-1-14 | GREEN de `descoberta.test.mjs` + 1ª execução real | `green.txt` + relatório | fonte aprovada; perfil ativo |
| 80743b26-bb73-4698-ab61-0dab851f42e6 | Importar empresas da base oficial do MAPA | Primitivo | SPEC-1-004 | CA-1-14, CA-1-16 | rota `sipeagro` com fixtures e arquivo real | `green.txt` | fonte aprovada |
| 4f4c732f-f8ea-4340-8570-b14e0ef57a5e | Buscar empresas na Apollo pelo perfil ativo | Primitivo | SPEC-1-004 | CA-1-14 | rota `apollo_organizacoes` simulada e real | `green.txt` + consumo registrado | módulo Apollo; chave cadastrada |
| 6e125b5e-1e2c-4844-85bc-9fd30e9b9a88 | Agendar a busca diária antes da fila | Primitivo | SPEC-1-004 | CA-1-14 | `cronAdd` 08:00 UTC em dias úteis | captura da rotina + execução registrada | rotas prontas |
| 1bb3ec25-92ce-4b5d-9fa4-9fe5b7791700 | Juntar empresas repetidas sem perder a origem | Primitivo | SPEC-1-004 | CA-1-15 | casos de consolidação, revisão e separar | `green.txt` + captura da ficha | rotas prontas |
| b1ac5f45-7f33-4c99-83c2-fe7e88a06b9b | Manter a busca funcionando quando a fonte falhar | Primitivo | SPEC-1-004 | CA-1-17, CA-1-18 | casos de falha, repetição e contingência | `green.txt` | rotina diária pronta |
| db8cd666-263d-4716-acad-5c682ae0c3be | Incluir empresas por planilha só como contingência | Primitivo | SPEC-1-004 | CA-1-18 | planilha com/sem motivo | `green.txt` | coleções criadas |
| a6c9068a-0acb-4008-80a7-a0e1c14f0339 | Testar fonte fora do ar e lote repetido | Primitivo | SPEC-1-004 | CA-1-17 | URL indisponível e execução repetida | `green.txt` | rotina diária pronta |

## Emendas

<!-- Append-only (D19): mudanças aprovadas depois da geração. A história não é reescrita. -->

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
