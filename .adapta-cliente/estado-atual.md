# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: SPEC-1-004-telas-e-revisao — GREEN no teste (em_andamento; uso real da fonte aguarda aprovação do Leonardo)
- executor: maesthos (Ethos do cliente)
- owner_informativo: Leonardo (champion)
- decisao_apollo_19_01: ADIADA — aguarda assessor; não está no orçamento do momento; app em MODO DE SIMULAÇÃO; quando liberar: chave → busca real → validação → fila
- capacidade: CONFIRMADA pelo champion (1/dia · 5/sem)
- login: Leonardo fará com a senha provisória e avisa se algo falhar
- modulos_industriais: após a Fase 1 completa (como combinado)
- SPEC-1-002: CONCLUÍDA (aceite 18:15)
- SPEC-1-004: fundação (v0.0.12) + revisão de fusão decidível (v0.0.13–v0.0.21, GREEN 4/4) + telas Empresas / Fontes e execuções / Conferir repetidos / Ficha com origens e divergências (v0.0.22); SUÍTE COMPLETA 27/27 no teste 64536
- verificacao_fonte_mapa: COMPLETA (26/10) — arquivo sipeagrofertilizante.csv acessível via navegador (o portal bloqueia TLS de fetch direto do servidor; a rotina real precisa baixar via navegador/headless ou proxy); leiaute ; UTF-8, 10 colunas (UF;MUNICIPIO;NUMERO_REGISTRO_ESTABELECIMENTO;STATUS_DO_REGISTRO;CNPJ mascarado;RAZAO_SOCIAL;NOME_FANTASIA;AREA_ATUACAO;ATIVIDADE;CLASSIFICACAO); 15.884 linhas, 14.091 ativas, 7.172 ativas nas 5 UFs do perfil, 3.751 nomes distintos; CNPJ mascarado (nunca reconstruir); licença Creative Commons Attribution; atualização semanal (25/10/2026); 113 linhas sem razão social (viram exceção com motivo); ~3.498 registros repetidos (a consolidação resolve); mapeamento em 05_entregas/fase-1/SPEC-1-004/fonte-mapa-mapeamento.md
- pergunta_ao_champion: aprovar uso do cadastro público do MAPA como fonte da primeira lista (pergunta simples enviada 26/10; pendente)
- proximo_ciclo: (1) resposta do champion sobre a fonte → registrar aprovação com URL/termo de uso e agendar rotina; (2) enquanto aguarda: planilha/manual com motivo (RN-06) com fixtures; (3) Apollo real permanece adiada
- pendente_github: changelog não atualizado nesta rodada (evitar sobrescrever edição do consultor) — atualizar na próxima
- atualizado_em: 2026-10-26T11:55:00-03:00
- comunicacao: seguir .adapta-cliente/comunicacao-com-leonardo.md; não pedir novamente ICP aprovado, capacidade confirmada ou contratação da Apollo adiada; uma pergunta simples por vez
