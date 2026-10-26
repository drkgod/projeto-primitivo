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
- SPEC-1-005 (26/10): nota na criação + bloco "Por que esta nota" + recálculo provado + tela Conferir notas; critério situacao_ativa corrigido (v0.0.13) + recálculo único (0011) — exemplos 2/20 faixa D
- ACESSO DO CHAMPION: login leonardo@primitivoagr.com / senha provisória Primitivo@2026 (confirmada exata 26/10 16:30); tela Conta (/conta) para trocar a senha
- CORREÇÃO CONTA (26/10 16:40, ref 3b4b6a8 publicado): causa da falha era a tela NÃO enviar oldPassword (API recusava "Cannot be blank") — corrigido; olho (mostrar/ocultar) nos 3 campos; mensagem de erro REAL da API na tela (campo + código, traduzido quando conhecido); Login mostra mensagem de sucesso vinda da Conta; PROVADO no browser: erro real exibido ("Senha atual: Missing or invalid old password.") com senha atual errada — senha do Leonardo NÃO foi alterada (login revalidado OK)
- rotina_diaria: 100% automática NÃO é possível (portal MAPA só aceita download por navegador) — ALTERNATIVA proposta: Maestro baixa e injeta o lote sob demanda + botão "Executar agora" na tela Fontes quando validado; decisão com o Leonardo
- proximo_ciclo: (1) reporte do champion sobre a /conferencia (CA-1-23); (2) troca de senha pelo champion na /conta (agora com oldPassword + olho + erro real); (3) importação real do arquivo MAPA (lote sob demanda) e botão Executar agora; (4) Apollo real permanece adiada
- atualizado_em: 2026-10-26T13:45:00-03:00
- comunicacao: seguir .adapta-cliente/comunicacao-com-leonardo.md; não pedir novamente ICP aprovado, capacidade confirmada, Apollo adiada, fonte aprovada; uma pergunta simples por vez
