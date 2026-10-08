# Índice de SPECs — Fase 1

**Fase:** 1 — Jornada completa de descoberta até a fila  
**Período:** 06/10/2026 a 20/10/2026 (feriado em 12/10)  
**Plataforma:** app “Radar Primitivo” no Skip, executado pelo cliente com o Maestro  
**Gerado em:** 05/10/2026

## Resultado da fase

O Country Manager configura um perfil de cliente uma vez; em dias úteis o app busca empresas sozinho, dá uma nota explicada, encontra decisores e contatos pela Apollo dentro do teto e entrega às 07:00 uma fila do tamanho da capacidade dele, com proteção mínima dos dados reais.

## SPECs

| SPEC | Entrega | Critérios | Degrau | Depende de |
|---|---|---|---|---|
| [SPEC-1-008](spec-1-008-primeira-experiencia-visual.md) | Primeira experiência visual: Meu dia, Ficha e Perfis, com skills de UI/UX existentes | CA-1-35 a CA-1-38 | reuso do app e recursos do Skip | app existente + skills instaladas; sem APIs reais |
| [SPEC-1-001](spec-1-001-acesso-e-protecao-dos-dados.md) | Acesso protegido e proteção mínima dos dados | CA-1-01 a CA-1-04 | nativo da plataforma (+ cópia lógica mínima) | — |
| [SPEC-1-002](spec-1-002-perfis-de-busca.md) | Perfis de busca (ICP) configuráveis e ativados | CA-1-05 a CA-1-08 | nativo da plataforma | SPEC-1-001 |
| [SPEC-1-003](spec-1-003-conexao-apollo-com-teto.md) | Conexão com a Apollo sob teto de créditos | CA-1-09 a CA-1-13 | nativo da plataforma (+ módulo único de chamada) | SPEC-1-001 |
| [SPEC-1-004](spec-1-004-descoberta-automatica-de-empresas.md) | Descoberta automática e ficha da empresa | CA-1-14 a CA-1-18 | nativo da plataforma (+ normalização) | SPEC-1-002, SPEC-1-003 |
| [SPEC-1-005](spec-1-005-score-hibrido-e-gate.md) | Score híbrido explicável e gate da empresa | CA-1-19 a CA-1-23 | construção mínima | SPEC-1-002, SPEC-1-004 |
| [SPEC-1-006](spec-1-006-decisores-e-contatos.md) | Decisores e contatos das empresas aprovadas | CA-1-24 a CA-1-28 | nativo da plataforma (+ regra de seleção) | SPEC-1-001, SPEC-1-003, SPEC-1-005 |
| [SPEC-1-007](spec-1-007-fila-do-dia-e-medicao.md) | Fila do dia, decisões e medição inicial | CA-1-29 a CA-1-34 | nativo da plataforma (+ ordenação e relatório) | SPEC-1-001 a SPEC-1-006 |

## Ordem de execução

**Atualização de 08/10/2026:** a criação do app com login, papéis e histórico foi informada como já realizada pelo consultor e retirada da lista ativa. A primeira entrega agora é a experiência visual da SPEC-1-008, seguida da revisão responsiva e validação CL-005. Critérios do cliente e acessos podem ser preparados enquanto a demo usa fixtures. O restante das entregas e provas das SPECs permanece aplicável.

0. Entrega visual antecipada (pedido de 08/10, sem prazo novo definido): skills de UI/UX existentes → três telas navegáveis fictícias → revisão desktop/celular → validação visual CL-005. As telas finais das SPECs originais reutilizam essa UI.
1. Preparação (06–09/10): app com login; perfil e critérios do cliente; Apollo liberada; fonte aprovada; regras de uso dos contatos; tempo atual e capacidade.
2. Caminho principal (09–15/10): perfil ativo → conexão Apollo → descoberta diária → consolidação → nota e gate → decisores e contatos (modo simulado).
3. Bordas e proteção (13–16/10): lista de bloqueio, falhas de fonte e da Apollo, contato manual, cópia e restauração testadas — só depois disso entra contato real.
4. Prova final (16–20/10): fila do dia, medição, jornada real gravada com o Country Manager, call de validação e decisão de fechamento.

## Fora desta fase

Pipeline comercial e histórico de abordagem, risco/crédito e NDA, radar de mercado, calibração periódica do score, papéis avançados, loops e agentes do Ethos, envio de mensagens e qualquer automação do LinkedIn.

## Regras comuns a todas as SPECs

- Três projetos Skip com as mesmas migrações e hooks: `radar-primitivo` (produção, dados reais), `radar-primitivo-teste` (testes automáticos, só dados fictícios, Apollo simulada) e `radar-primitivo-restauro` (ensaio de restauração).
- Testes em `07-sistemas/radar-primitivo/testes/` (`node --test`) rodam em `radar-primitivo-teste`; URLs e credenciais ficam em variáveis de ambiente fora do repositório.
- Evidências em `05_entregas/fase-1/SPEC-1-00N/`.
- Uma task por vez; cada task só é marcada como concluída depois das provas da SPEC e do teste humano quando houver.
- Nenhum contato real antes de `config.contato_real_liberado = true` (SPEC-1-001).
