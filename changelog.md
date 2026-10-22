# Histórico operacional

## 22/10/2026 (18:08) — Ajuste do champion: UniAgro → Grupo Modarc (v2 do perfil ativada)

- Correção de identidade (voz do Leonardo): a razão social sempre foi Modarc; "UniAgro" é o nome
  antigo que aparece em materiais de referência e significa Modarc. Hoje é o GRUPO Modarc, com
  várias empresas dentro (UniAgro é uma delas). Tratar tudo como Modarc.
- Ação no perfil ativo (regra da casa: perfil ativo não se edita — nova versão): criada versão 2
  em rascunho a partir da v1 com contas_excluidas sem UniAgro (Goplan, Modarc, Dedeagro, PMX,
  Agromol) e ativada pela API em nome do Leonardo (21:09Z). V1 ficou inativa, com auditoria
  ("Ativação da versão 1" 20:10Z; "Ativação da versão 2" 21:09Z, snapshot sem UniAgro).
- Regra de leitura de materiais registrada: onde disser UniAgro/UniAgro-Modarc, ler Modarc.

## 22/10/2026 — Decisões do champion + perfil real ativado (bba1553f em aceite)

- Decisões por voz (16:48): teto Apollo 500 créditos/mês (recomendação aceita); primeiro acesso
  na produção com senha provisória (troca no primeiro login); blacklist CORRIGIDA — Leonardo
  não tem clientes: Goplan, Modarc, Dedeagro, PMX, Agromol são PROSPECTS ativos em prospecção
  manual, ficam fora da fila de descoberta automática; maus exemplos = empresas em recuperação
  judicial/problema de caixa (critério de risco, não relacionamento).
- Módulos industriais: Leonardo quer rodar depois ("dois casos interessantes") — anotado para
  o próximo ciclo; não altera a SPEC atual.
- Produção 64528 v0.0.8 (d2d6320): migration 0005 (usuário leonardo@primitivoagr.com, senha no
  segredo RADAR_LEO_TEMP_PASSWORD), 0006 (perfil distribuidores preenchido com o ICP v1 —
  8 critérios/20 pontos, pesos ×2 do contrato de inteiros, corte 60% via faixa B≥60,
  capacidade provisória 1/dia·5/sem, teto 500, prospects em contas_excluidas).
- Ativação pela API em nome do Leonardo: hook RN-01 validou, perfis_versoes gravou 1 linha
  (snapshot completo), indústrias segue rascunho (independência).
- Prova visual: /perfis mostra Distribuidores regionais ATIVO — resumo-perfil-ativo-producao.png.
- CA-1-08 pendente do aceite humano: Leonardo confere o resumo e responde "perfil confere".

## 22/10/2026 — SPEC-1-002: perfis de busca construídos e provados (ciclo contínuo)

- Backend no projeto de teste 64536: migrações 0001 (coleções perfis_busca/perfis_versoes com
  regras de acesso), 0002 (dois perfis iniciais em rascunho, idempotente), 0004 (remove índice
  único — reativação gera nova linha de auditoria); 0003 (usuário de teste) só no 64536, com
  senha em segredo RADAR_TEST_PASSWORD.
- Hooks: ativa-perfil-busca (RN-01 valida e responde 400 com a lista do que falta; RN-03 deixa
  uma versão ativa por rota; grava perfis_versoes com snapshot e motivo) e
  bloqueia-edicao-perfil-ativo (403).
- TDD: RED 7 falhas / 1 passa → GREEN 8/8 (perfis.test.mjs contra o banco real).
- Frontend: serviço, libs mensagens-erro/formatos, telas /perfis e /perfis/:id. Publicado no
  teste: v0.0.7 (a4a9e73) — prova visual com sessão autenticada.
- Réplica na produção 64528 (v0.0.7 e28d4c1 publicada).
- Aprendizados: URL interna do PB; JSVM top-level; lista filtra (200 + vazio).

## 22/10/2026 — ICP v1 validado pelo champion (DECISÃO DO CLIENTE)

- Leonardo respondeu o formulário do ICP v1: bons exemplos (Goplan, Modarc, Agromol, Nubio Tec,
  PMX, Dedeagro), maus exemplos (Belagricola, Agrogalaxy, Lavoro, Sagra, UNIAGRO/Unitech),
  blacklist (Goplan, Modarc, Dedeagro, PMX, Agromol), todas as regiões/culturas/porte/cargos.
- Premissas declaradas: primeiro perfil = distribuidores regionais; matriz v1 e corte ≥6 aprovados.
- Informação nova: Modarc atua em três quartos do RS (norte/nordeste), portfólio mais limitado,
  e também em MG, PR, SP e GO.

## 09/10/2026 — SPEC-1-008 concluída com aceite do champion

- Leonardo aprovou a demo publicada (CL-005, "Aprovado" em 15:25 BRT) — aceite registrado.

## 08/10/2026 — Publicação da demo no ambiente de teste concluída

- Recuperação da indisponibilidade MCP; v0.0.2 (4aa2ec4) com QA integral verde e publicação.

## 08/10/2026 — Task SPEC-1-008-visual-v1 implementada; publicação no teste pendente

- Autorização do champion executada: módulo de estado demonstrativo com TDD (RED confirmado,
  GREEN 11/11), fixtures, shell e telas Meu dia, Ficha e Perfis; App.tsx com rotas /demo.
- Evidências em 05_entregas/fase-1/SPEC-1-008/.
- Produção 64528 publicada (a823b66) com governança da task.

## 08/10/2026 — Configuração do plugin concluída e análise da primeira task

- Rota configurar fechada: GitHub validado; 3 projetos Skip confirmados (produção 64528, teste 64536, restauro 64537); plataforma.md registrada (commit 43db15d).
- Produção publicada (v0.0.4, ref a823b66) com estado do orquestrador, mapa e análise.
- Primeira task analisada: SPEC-1-008 — relatório em .adapta-cliente/analises/.
- DÚVIDA registrada ao consultor: o "app com login e papéis já realizado" não foi localizado.

## 08/10/2026 — Entrega visual no início da Fase 1

- Incluída a SPEC-1-008 com Meu dia, Ficha e Perfis navegáveis, fixtures, ações simuladas, revisão responsiva/acessibilidade e aceite CL-005.

## 08/10/2026 — Retirada da primeira task já realizada

- A pedido do consultor, retirado o grupo “Criar o app no Skip com login e papéis de acesso”.
- Histórico e UUIDs preservados em 06_notas/2026-10-08-task-inicial-ja-realizada.md.

## 08/10/2026 — Publicação no GitHub

- Pacote operacional publicado no repositório privado drkgod/projeto-primitivo, branch main.

## 08/10/2026 — Pacote da Fase 1 gerado

- Materializadas as tasks em 04_fase-atual/fase.md e o índice + 7 SPECs em 04_fase-atual/specs/.
