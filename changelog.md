# Histórico operacional

## 09/10/2026 — SPEC-1-008 concluída com aceite do champion

- Leonardo aprovou a demo publicada (CL-005, "Aprovado" em 15:25 BRT) — aceite registrado em
  05_entregas/fase-1/SPEC-1-008/aceite-visual.md.
- Quadro: os 3 cards da SPEC-1-008 marcados como concluídos (criar versão visual, testar
  navegação/celular, validar com o Country Manager).
- Estado da task movido para concluida; nenhuma nova task aberta neste envio.

## 08/10/2026 — Publicação da demo no ambiente de teste concluída

- Recuperação da indisponibilidade MCP: o working tree do 64536 sobreviveu com 6/8 arquivos
  (incluindo FichaEmpresa.tsx); Perfis.tsx e App.tsx reaplicados do espelho aprovado.
- Aplicação v0.0.2 (4aa2ec4) com QA integral verde (setup, análise estática, build,
  integrações, testes) e publicação em https://radar-primitivo-teste-3a85f.goskip.app.
- Prova de fumaça no ar: Meu dia com as 6 empresas fictícias e ações; Perfis com os 2 perfis
  e pré-visualização funcionando.
- Estado movido para aguardando_teste_humano; roteiro CL-005 enviado ao champion.
- Nenhuma alteração na produção de dados reais (64528 segue em v0.0.4).

## 08/10/2026 — Task SPEC-1-008-visual-v1 implementada; publicação no teste pendente

- Autorização do champion ("Sim — pode implementar") executada: módulo de estado
  demonstrativo com TDD (RED confirmado, GREEN 11/11), fixtures, shell e telas Meu dia,
  Ficha e Perfis; App.tsx com rotas /demo.
- Evidências em 05_entregas/fase-1/SPEC-1-008/ (red.txt, green.txt, rede.md, skills-ui-ux.md,
  publicacao.md).
- Produção 64528 publicada (a823b66) com governança da task.
- Publicação da demo no teste 64536 PENDENTE: indisponibilidade da camada MCP do Skip
  ("manager is closed") após 5 arquivos gravados; Perfis.tsx e App.tsx ficaram fora do
  working tree e serão aplicados na recuperação.
- Nenhum teste humano solicitado sobre versão não publicada (regra da casa).

## 08/10/2026 — Configuração do plugin concluída e análise da primeira task

- Rota configurar fechada: GitHub validado por leitura; 3 projetos Skip confirmados (produção 64528 "Projeto Greenexta", teste 64536 "Radar Primitivo Teste", restauro 64537 "Radar Primitivo Restauro"); `07-sistemas/radar-primitivo/plataforma.md` registrada (commit 43db15d).
- Produção publicada (v0.0.4, ref a823b66) com estado do orquestrador, mapa do sistema e análise da primeira task.
- Primeira task selecionada e analisada: "Criar a primeira versão visual do Radar Primitivo" (SPEC-1-008, CA-1-35/36) — relatório em `.adapta-cliente/analises/SPEC-1-008-visual-v1.md`, estado `aguardando_autorizacao`.
- DÚVIDA registrada ao consultor: o "app com login e papéis já realizado" não foi localizado em nenhum dos 4 projetos da org (verificado por listagem); a demo segue na estrutura real do template.
- Nenhuma task implementada nesta atualização; aguardando autorização do champion.

## 08/10/2026 — Entrega visual no início da Fase 1

- Incluída a SPEC-1-008 com Meu dia, Ficha e Perfis navegáveis, fixtures, ações simuladas, revisão responsiva/acessibilidade e aceite CL-005.
- Três novos cards antes da preparação: criar versão visual, testar navegação/celular e validar com o Country Manager; sem UUID ou prazo inventado.
- Maestro deve localizar, ler e aplicar as skills de UI/UX instaladas, registrando nomes e decisões. A ausência de skill acessível é impedimento explícito.
- Mantidos login existente e contratos funcionais. Demo não depende de Apollo e não substitui o aceite real da Fase 1.
- Lista ativa: 57 cards e 8 SPECs. Os 54 cards anteriores permanecem intactos.
- Execução do app, capturas e testes da SPEC permanecem pendentes; esta mudança atualiza o plano de execução.

## 08/10/2026 — Retirada da primeira task já realizada

- A pedido do consultor, retirado da lista ativa o grupo “Criar o app no Skip com login e papéis de acesso”, incluindo quatro subtarefas, pois ele informou que já foi feito.
- Histórico e UUIDs preservados em [06_notas/2026-10-08-task-inicial-ja-realizada.md](06_notas/2026-10-08-task-inicial-ja-realizada.md).
- Lista ativa: 24 tasks principais e 30 subtarefas; UUIDs, prazos, responsáveis, status e descrições restantes preservados.
- Atualizados a SPEC-1-001, o índice e a documentação operacional. Nenhum teste técnico executado nesta atualização.

## 08/10/2026 — Publicação no GitHub

- Pacote operacional publicado no repositório privado `drkgod/projeto-primitivo`, branch `main`, a pedido do consultor.
- Preservados os 59 cards com UUIDs, as 7 SPECs com TDD e o índice da Fase 1.
- Incluídos marcadores para manter as pastas de entregas, notas e sistemas no Git e regras para ignorar credenciais locais.
- Nenhuma task concluída nesta publicação.

## 08/10/2026 — Pacote da Fase 1 gerado

- Materializadas as tasks em '04_fase-atual/fase.md' e o índice + 7 SPECs em '04_fase-atual/specs/'.
- Preservados os 59 UUIDs, status, responsáveis, prazos, descrições e hierarquia.
- UUIDs vinculados às tabelas das SPECs.
- Preparadas as pastas de entregas, notas e sistemas.
- Validados formato das tasks, TDD, vínculos e igualdade com a fonte da fase.
- Nenhuma task marcada como executada nesta montagem; sincronização remota pendente.
