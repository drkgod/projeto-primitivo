# Histórico operacional

## 22/10/2026 — SPEC-1-002: perfis de busca construídos e provados (ciclo contínuo)

- Backend no projeto de teste 64536: migrações 0001 (coleções perfis_busca/perfis_versoes com
  regras de acesso), 0002 (dois perfis iniciais em rascunho, idempotente), 0004 (remove índice
  único — reativação gera nova linha de auditoria, conforme a SPEC "uma linha por ativação");
  0003 (usuário de teste) só no 64536, com senha em segredo RADAR_TEST_PASSWORD.
- Hooks: ativa-perfil-busca (RN-01 valida e responde 400 com a lista do que falta; RN-03 deixa
  uma versão ativa por rota; grava perfis_versoes com snapshot e motivo) e
  bloqueia-edicao-perfil-ativo (403).
- TDD: RED 7 falhas / 1 passa (sem hooks) → GREEN 8/8 (perfis.test.mjs contra o banco real,
  URL interna do PocketBase). Evidências em 05_entregas/fase-1/SPEC-1-002/ (red.txt, green.txt).
- Frontend: serviço src/services/perfis.ts, libs mensagens-erro/formatos, telas /perfis (lista
  com tabela/cards por estado e ações) e /perfis/:id (formulário por seções: Rota, Onde buscar,
  Quem buscar, Como pontuar, Quanto cabe, Quando rodar). Publicado no teste: v0.0.7 (a4a9e73),
  https://radar-primitivo-teste-3a85f.goskip.app/perfis — prova visual com sessão autenticada.
- Réplica na produção 64528 (v0.0.7 e28d4c1 publicada): coleções + hooks + telas, sem a demo e
  sem o usuário de teste.
- Aprendizados capturados: API do PocketBase vive na URL interna (domínio público só serve o
  frontend); função top-level em hook não é visível no callback (JSVM) — QA do Skip pegou;
  regra de lista FILTRA (200 + vazio para anônimo), não rejeita com 401.
- Tasks d746b918, 9e081d10 e ccc168e0 concluídas; bba1553f (ativação do perfil real) em espera:
  depende do teto de créditos Apollo e de acesso de login na produção.

## 22/10/2026 — ICP v1 validado pelo champion (DECISÃO DO CLIENTE)

- Leonardo respondeu o formulário do ICP v1: bons exemplos (Goplan, Modarc, Agromol, Nubio Tec,
  PMX, Dedeagro), maus exemplos (Belagricola, Agrogalaxy, Lavoro, Sagra, UNIAGRO/Unitech),
  blacklist (Goplan, Modarc, Dedeagro, PMX, Agromol), todas as regiões/culturas/porte/cargos.
- Premissas declaradas: primeiro perfil = distribuidores regionais; matriz v1 e corte ≥6 aprovados;
  blacklist interpretada como relacionamento direto já existente (fora da fila de prospecção,
  mantida como calibragem) — confirmação pendente na próxima parada.
- Informação nova: Modarc atua em três quartos do RS (norte/nordeste), portfólio mais limitado,
  e também em MG, PR, SP e GO.
- Tasks de entrada da SPEC-1-002 marcadas [x].

## 09/10/2026 — SPEC-1-008 concluída com aceite do champion

- Leonardo aprovou a demo publicada (CL-005, "Aprovado" em 15:25 BRT) — aceite registrado em
  05_entregas/fase-1/SPEC-1-008/aceite-visual.md.
- Quadro: os 3 cards da SPEC-1-008 marcados como concluídos.
- Estado da task movido para concluida; nenhuma nova task aberta neste envio.

## 08/10/2026 — Publicação da demo no ambiente de teste concluída

- Recuperação da indisponibilidade MCP: o working tree do 64536 sobreviveu com 6/8 arquivos;
  Perfis.tsx e App.tsx reaplicados do espelho aprovado.
- Aplicação v0.0.2 (4aa2ec4) com QA integral verde e publicação em
  https://radar-primitivo-teste-3a85f.goskip.app.
- Prova de fumaça no ar; estado movido para aguardando_teste_humano; roteiro CL-005 enviado.

## 08/10/2026 — Task SPEC-1-008-visual-v1 implementada; publicação no teste pendente

- Autorização do champion executada: módulo de estado demonstrativo com TDD (RED confirmado,
  GREEN 11/11), fixtures, shell e telas Meu dia, Ficha e Perfis; App.tsx com rotas /demo.
- Evidências em 05_entregas/fase-1/SPEC-1-008/.
- Produção 64528 publicada (a823b66) com governança da task.
- Publicação da demo no teste 64536 PENDENTE: indisponibilidade da camada MCP do Skip.

## 08/10/2026 — Configuração do plugin concluída e análise da primeira task

- Rota configurar fechada: GitHub validado por leitura; 3 projetos Skip confirmados (produção 64528, teste 64536, restauro 64537); plataforma.md registrada (commit 43db15d).
- Produção publicada (v0.0.4, ref a823b66) com estado do orquestrador, mapa e análise.
- Primeira task selecionada e analisada: SPEC-1-008 — relatório em .adapta-cliente/analises/.
- DÚVIDA registrada ao consultor: o "app com login e papéis já realizado" não foi localizado.

## 08/10/2026 — Entrega visual no início da Fase 1

- Incluída a SPEC-1-008 com Meu dia, Ficha e Perfis navegáveis, fixtures, ações simuladas, revisão responsiva/acessibilidade e aceite CL-005.
- Três novos cards: criar versão visual, testar navegação/celular e validar com o Country Manager.
- Lista ativa: 57 cards e 8 SPECs; os 54 cards anteriores permanecem intactos.

## 08/10/2026 — Retirada da primeira task já realizada

- A pedido do consultor, retirado o grupo “Criar o app no Skip com login e papéis de acesso”.
- Histórico e UUIDs preservados em 06_notas/2026-10-08-task-inicial-ja-realizada.md.

## 08/10/2026 — Publicação no GitHub

- Pacote operacional publicado no repositório privado drkgod/projeto-primitivo, branch main.
- Preservados os 59 cards com UUIDs, as 7 SPECs com TDD e o índice da Fase 1.

## 08/10/2026 — Pacote da Fase 1 gerado

- Materializadas as tasks em 04_fase-atual/fase.md e o índice + 7 SPECs em 04_fase-atual/specs/.
- Preservados os 59 UUIDs, status, responsáveis, prazos, descrições e hierarquia.
