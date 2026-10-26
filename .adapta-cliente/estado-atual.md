# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: SPEC-1-005-nota-icp — GREEN no teste (em_andamento; conferência do champion pendente)
- executor: maesthos (Ethos do cliente)
- owner_informativo: Leonardo (champion)
- decisao_apollo_19_01: ADIADA — aguarda assessor; app em MODO DE SIMULAÇÃO; quando liberar: chave → busca real → validação → fila
- capacidade: CONFIRMADA pelo champion (1/dia · 5/sem)
- login: Leonardo fará com a senha provisória e avisa se algo falhar
- modulos_industriais: após a Fase 1 completa (como combinado)
- SPEC-1-002: CONCLUÍDA (aceite 18:15)
- SPEC-1-004: fundação + revisão de fusão + telas (v0.0.22); situação Ativa/Ativo (v0.0.24); fonte MAPA APROVADA 26/10 12:05
- SPEC-1-005: nota na criação (v0.0.23) + bloco "Por que esta nota" na ficha + recálculo ao reativar perfil (PROVADO: desativar→reativar recalcula, 15:21:33) + tela Conferir notas (/conferencia) com bons/maus exemplos (v0.0.31–32); bloqueio de perfil ativo endurecido (só estado pode mudar; 403 na edição de conteúdo — regressão corrigida em v0.0.30)
- exemplos_no_app: 5 bons (Goplan, Modarc, Agromol, PMX, Dedeagro — estado "adiada", fora da fila, prospect manual) + 4 maus (Nubio Tech, Belagricola, Agrogalaxy, Lavoro, Sagra — todos nota 2/11 faixa D); UniAgro removido da conferência (é a Modarc, correção 22/10); mapeamento da fonte restaurado para o leiaute oficial MAPA (foi sobrescrito pelo teste)
- SUÍTE COMPLETA: 27/27
- rotina_diaria: NÃO POSSÍVEL como cron automático no ambiente atual (cron do Maestro não alcança o PocketBase do Skip; cronAdd do Skip Cloud exige plano/serviço não confirmado) — ALTERNATIVA proposta ao Leonardo: execução manual por botão "Executar agora" (a implementar na tela Fontes) ou rodada sob demanda pelo Maestro (baixa via navegador headless); pendente decisão
- proximo_ciclo: (1) conferência do champion na tela /conferencia (CA-1-23 — chamado enviado 26/10); (2) botão "Executar agora" na tela Fontes + importação real do arquivo MAPA via headless; (3) Apollo real permanece adiada
- pendente_github: changelog consolidado na próxima sincronização
- atualizado_em: 2026-10-26T12:55:00-03:00
- comunicacao: seguir .adapta-cliente/comunicacao-com-leonardo.md; não pedir novamente ICP aprovado, capacidade confirmada, Apollo adiada, fonte aprovada; uma pergunta simples por vez
