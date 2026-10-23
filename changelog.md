# Histórico operacional

## 23/10/2026 — Comunicação simples e retomada sem perguntas repetidas

- Orientação do consultor: Leonardo deve receber explicações e perguntas de negócio sem siglas, códigos ou exigência de conhecimento técnico. Criados guia de conversa e resumo simples; as oito SPECs recebem uma explicação de negócio antes da referência do Maestro, preservando os contratos e as provas técnicas.
- Reconciliados o quadro e o encaminhamento com o aceite do perfil em 22/10, a capacidade 1/dia·5/semana e a decisão de adiar Apollo por orçamento/assessor. Não solicitar novamente o formulário aprovado, a capacidade ou chave/contratação da Apollo.
- Nove cards de entrada, construção e ativação de Perfis marcados concluídos com base nas respostas, provas e aceite já registrados em 22/10; nenhuma nova execução inferida. IDs, títulos, responsáveis, prazos e hierarquia preservados.
- O Maestro prepara fonte, arquivo, formato e condições de uso. Ao cliente, pede só uma decisão específica e compreensível; não exige URL ou validação técnica. Telas e provas simuladas continuam enquanto a autorização de uso real estiver pendente.
- Fonte pública candidata documentada com páginas oficiais e arquivo indicado pelo MAPA; não foi aprovada em nome do Leonardo, importada no app nem agendada nesta revisão.
- Alteração documental: não comprova atualização do runtime do Maestro, retomada de sessão, novos testes do app ou liberação de dados/consumo reais.

## 22/10/2026 (19:30) — Decisão Apollo + fundação da SPEC-1-004 no teste (GREEN)

- Decisão do champion (19:01): Apollo ADIADA — aguarda orientação do assessor e não está no
  orçamento do momento. App segue em MODO DE SIMULAÇÃO; ciclo contínuo prossegue no que não
  depende dela. Capacidade CONFIRMADA com os números informados (1/dia · 5/sem). Login será
  feito pelo Leonardo com a senha provisória. Módulos industriais após a Fase 1 completa.
  Quando o assessor liberar: chave → ativação da busca real → validação da conexão → fila.
- SPEC-1-004 (fundação no teste 64536, v0.0.12): migração 0007 (coleções fontes/execucoes/
  empresas/empresa_origens/revisoes_fusao com regras da SPEC), 0008 (fontes iniciais NÃO
  aprovadas), 0009 (superusuário de teste — só no 64536), hook processa-lote-descoberta
  (RN-01 filtros com motivo, RN-02 consolidação com divergências, RN-03 revisão de fusão,
  CA-1-16 CNPJ mascarado preservado).
- TDD: RED 4/4 falhando → GREEN 4/4 (descoberta.test.mjs) → SUÍTE COMPLETA 23/23 (descoberta
  4 + perfis 8 + demo 11) sem regressão. Evidências em 05_entregas/fase-1/SPEC-1-004/.
- Aprendizados da rodada: hook em onRecordCreate que salva o próprio registro entra em
  recursão (usar onRecordAfterCreateSuccess); id_na_fonte precisa incluir a execução (índice
  único fonte+id); superusuário de teste dirige a rotina sem afrouxar regras; token de teste
  no INÍCIO do nome preserva a remoção de sufixos da normalização.
- Pendente na SPEC-1-004: rotina agendada real, tela Fontes/execuções, planilha/manual —
  aguardando aprovação da fonte (task 8f422530, do champion) e Apollo.

## 22/10/2026 (18:15) — Aceite do champion fecha a SPEC-1-002

- Leonardo confirmou o resumo do perfil ativo: "Perfil confere" (18:15 BRT) — CA-1-08 atendido.
- Evidência registrada em 05_entregas/fase-1/SPEC-1-002/aceite-resumo.md.
- SPEC-1-002 concluída: coleções, hooks, telas, TDD GREEN 8/8, perfil real ativo (v2) e aceite.

## 22/10/2026 (18:08) — Ajuste do champion: UniAgro → Grupo Modarc (v2 do perfil ativada)

- Correção de identidade: a razão social sempre foi Modarc; "UniAgro" é o nome antigo que
  aparece em materiais de referência e significa Modarc. Hoje é o GRUPO Modarc (UniAgro é uma
  das empresas do grupo). Tratar tudo como Modarc.
- Versão 2 do perfil ativada sem UniAgro em contas_excluidas (5 prospects); v1 inativa com
  auditoria ("Ativação da versão 1" 20:10Z; "Ativação da versão 2" 21:09Z).

## 22/10/2026 — Decisões do champion + perfil real ativado (bba1553f)

- Decisões por voz: teto Apollo 500 créditos/mês; primeiro acesso com senha provisória;
  blacklist CORRIGIDA — Leonardo não tem clientes: Goplan, Modarc, Dedeagro, PMX, Agromol são
  PROSPECTS ativos em prospecção manual, fora da fila de descoberta automática; maus exemplos
  = empresas em recuperação judicial/problema de caixa (critério de risco).
- Produção 64528 v0.0.8 (d2d6320): migration 0005 (usuário do Leonardo, senha em segredo),
  0006 (perfil distribuidores preenchido com o ICP v1 — 8 critérios/20 pontos, pesos ×2,
  corte 60% via faixa B≥60, capacidade provisória 1/dia·5/sem, teto 500).
- Ativação pela API em nome do Leonardo; auditoria com snapshot completo; prova visual.

## 22/10/2026 — SPEC-1-002: perfis de busca construídos e provados (ciclo contínuo)

- Backend no projeto de teste 64536: migrações 0001/0002/0004; 0003 (usuário de teste) só no
  64536, com senha em segredo RADAR_TEST_PASSWORD.
- Hooks: ativa-perfil-busca (RN-01/RN-03 + auditoria) e bloqueia-edicao-perfil-ativo (403).
- TDD: RED 7 falhas / 1 passa → GREEN 8/8.
- Frontend: serviço, libs, telas /perfis e /perfis/:id. Publicado no teste v0.0.7 (a4a9e73)
  e na produção v0.0.7 (e28d4c1).

## 22/10/2026 — ICP v1 validado pelo champion (DECISÃO DO CLIENTE)

- Leonardo respondeu o formulário do ICP v1: bons exemplos (Goplan, Modarc, Agromol, Nubio Tec,
  PMX, Dedeagro), maus exemplos (Belagricola, Agrogalaxy, Lavoro, Sagra, UNIAGRO/Unitech),
  blacklist (Goplan, Modarc, Dedeagro, PMX, Agromol), todas as regiões/culturas/porte/cargos.
- Premissas: primeiro perfil = distribuidores regionais; matriz v1 e corte ≥6 aprovados.
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
