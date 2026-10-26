# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: SPEC-1-005-nota-icp — GREEN no teste (em_andamento)
- executor: maesthos (Ethos do cliente)
- owner_informativo: Leonardo (champion)
- decisao_apollo_19_01: ADIADA — aguarda assessor; app em MODO DE SIMULAÇÃO; quando liberar: chave → busca real → validação → fila
- capacidade: CONFIRMADA pelo champion (1/dia · 5/sem)
- login: Leonardo fará com a senha provisória e avisa se algo falhar
- modulos_industriais: após a Fase 1 completa (como combinado)
- SPEC-1-002: CONCLUÍDA (aceite 18:15)
- SPEC-1-004: fundação + revisão de fusão + telas publicadas (v0.0.22); situação Ativa/Ativo corrigida (v0.0.24)
- fonte_mapa: APROVADA pelo champion em 26/10/2026 12:05 — cadastro público do MAPA como primeira fonte; CNPJ parcialmente escondido mantido; atribuição MAPA na origem; licença CC-BY; URL + mapeamento registrados na fonte no app; decisão observável registrada em 05_entregas/fase-1/SPEC-1-004/aprovacao-fonte.md
- SPEC-1-005: nota de prioridade na criação da empresa (v0.0.23) — ICP ativo (criterios/faixas/faixas_liberadas), percentual para faixa (escala-invariante), dado desconhecido não soma (CA-1-19), impeditivo só bloqueia com confirmação negativa, explicação item a item; lote de teste real: 6 linhas → 3 novas + 1 atualizada + 2 inválidas com motivo; nota 2/11 (18%) faixa D — correto para empresa sem porte/domínio/confirmações
- SUÍTE COMPLETA: 27/27 (descoberta 4 + revisões 4 + perfis 8 + demo 11)
- proximo_ciclo: (1) recalcular notas das empresas existentes quando o perfil mudar (CA-1-22); (2) bloco “Por que esta nota” na ficha (CA-1-19); (3) conferir nota com bons/maus exemplos do Leonardo (CA-1-23, precisa dele); (4) rotina agendada diária da fonte aprovada (baixa via navegador headless); (5) Apollo real permanece adiada
- pendente_github: changelog consolidado na próxima sincronização
- atualizado_em: 2026-10-26T12:40:00-03:00
- comunicacao: seguir .adapta-cliente/comunicacao-com-leonardo.md; não pedir novamente ICP aprovado, capacidade confirmada, Apollo adiada ou fonte aprovada; uma pergunta simples por vez
