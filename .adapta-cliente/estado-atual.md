# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: SPEC-1-005-nota-icp — CONCLUÍDA TECNICAMENTE (conferência do champion pendente)
- executor: maesthos (Ethos do cliente)
- owner_informativo: Leonardo (champion)
- decisao_apollo_19_01: ADIADA — aguarda assessor; app em MODO DE SIMULAÇÃO; quando liberar: chave → busca real → validação → fila
- capacidade: CONFIRMADA pelo champion (1/dia · 5/sem)
- modulos_industriais: após a Fase 1 completa (como combinado)
- SPEC-1-002: CONCLUÍDA (aceite 18:15)
- SPEC-1-004: fundação + revisão de fusão + telas no teste 64536 (suíte 27/27); fonte MAPA APROVADA 26/10 12:05
- SPEC-1-005 (26/10): nota na criação + bloco "Por que esta nota" na ficha + recálculo ao reativar perfil (PROVADO) + tela Conferir notas; bloqueio de perfil ativo endurecido (só estado muda; 403 na edição)
- PRODUÇÃO 64528 (publicada 15:32, ref da595ff + b0aa126): migrações 0007 (coleções descoberta + nota), 0008 (fonte SIPEAGRO APROVADA com URL/atribuição/mapeamento oficial), 0009 (seed dos 10 exemplos com nota calculada inline) — TODAS applied; telas /conferencia /empresas /fontes /revisoes + /login com layout protegido (redireciona sem sessão)
- VERIFICAÇÃO PENDENTE: dados da produção não conferidos com autenticação (senha do Leonardo não está com o Maestro — correta e proposital); primeiro login do Leonardo confirma os exemplos na /conferencia
- rotina_diaria: 100% automática NÃO é possível (portal MAPA só aceita download por navegador; hooks PocketBase não têm navegador) — ALTERNATIVA proposta: Maestro baixa e injeta o lote sob demanda + botão "Executar agora" na tela Fontes quando validado; decisão com o Leonardo
- proximo_ciclo: (1) login do Leonardo em https://projeto-greenexta-d13f9.goskip.app → /conferencia → conferir nota dos 5 bons e 5 maus exemplos (CA-1-23); (2) ajustes de critérios se ele pedir; (3) importação real do arquivo MAPA (lote sob demanda) e botão Executar agora; (4) Apollo real permanece adiada
- atualizado_em: 2026-10-26T12:40:00-03:00
- comunicacao: seguir .adapta-cliente/comunicacao-com-leonardo.md; não pedir novamente ICP aprovado, capacidade confirmada, Apollo adiada, fonte aprovada; uma pergunta simples por vez
