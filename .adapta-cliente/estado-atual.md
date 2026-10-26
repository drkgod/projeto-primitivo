# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: SPEC-1-005-nota-icp — CONCLUÍDA TECNICAMENTE (conferência do champion EM ANDAMENTO — ele vai entrar agora)
- executor: maesthos (Ethos do cliente)
- owner_informativo: Leonardo (champion)
- decisao_apollo_19_01: ADIADA — aguarda assessor; app em MODO DE SIMULAÇÃO; quando liberar: chave → busca real → validação → fila
- capacidade: CONFIRMADA pelo champion (1/dia · 5/sem)
- modulos_industriais: após a Fase 1 completa (como combinado)
- SPEC-1-002: CONCLUÍDA (aceite 18:15)
- SPEC-1-004: fundação + revisão de fusão + telas no teste 64536 (suíte 27/27); fonte MAPA APROVADA 26/10 12:05
- SPEC-1-005 (26/10): nota na criação + bloco "Por que esta nota" na ficha + recálculo ao reativar perfil (PROVADO) + tela Conferir notas; critério situacao_ativa corrigido nos hooks (v0.0.13) + recálculo único (migração 0011) — exemplos com nota 2/20 faixa D (só "Empresa ativa" é calculável do cadastro público; 18 pts entram com confirmações do champion)
- ACESSO DO CHAMPION (26/10 16:01, ref e82f97c publicado): login leonardo@primitivoagr.com com senha provisória Primitivo@2026 (segredo RADAR_LEO_TEMP_PASSWORD, resetado na migração 0010); tela Conta (/conta) para trocar a senha no primeiro acesso; layout exige sessão
- LACUNA DECLARADA: a divisão 5 bons / 5 maus enviada pelo champion não estava registrada — seed com divisão provisória 6 bons (Goplan, Modarc, Agromol, Nubio Tech, PMX, Dedeagro) / 4 maus (Belagricola, Agrogalaxy, Lavoro, Sagra); champion confirma/corrige na /conferencia
- rotina_diaria: 100% automática NÃO é possível (portal MAPA só aceita download por navegador; hooks PocketBase não têm navegador) — ALTERNATIVA proposta: Maestro baixa e injeta o lote sob demanda + botão "Executar agora" na tela Fontes quando validado; decisão com o Leonardo
- proximo_ciclo: (1) reporte do champion sobre a /conferencia (CA-1-23): notas fazem sentido? divisão bons/maus correta? aprova critérios v1 ou pede ajuste?; (2) ajustes conforme reporte; (3) importação real do arquivo MAPA (lote sob demanda) e botão Executar agora; (4) Apollo real permanece adiada
- atualizado_em: 2026-10-26T13:05:00-03:00
- comunicacao: seguir .adapta-cliente/comunicacao-com-leonardo.md; não pedir novamente ICP aprovado, capacidade confirmada, Apollo adiada, fonte aprovada; uma pergunta simples por vez
