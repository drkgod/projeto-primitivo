# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: SPEC-1-005-nota-icp — CONCLUÍDA TECNICAMENTE (conferência do champion pendente; importação real executada)
- executor: maesthos (Ethos do cliente)
- owner_informativo: Leonardo (champion)
- decisao_apollo_19_01: ADIADA — aguarda assessor; quando liberar: chave → busca real → validação → fila
- capacidade: CONFIRMADA pelo champion (1/dia · 5/sem)
- TRÊS DECISÕES APLICADAS (26/10 14:49, instrução do champion):
  1. BA no perfil ativo (migração 0017): UFs = SP, MG, RS, PR, PE, ES, SC, GO, BA — 485 empresas da BA importadas; Unifert-LEM encontrável na busca real
  2. Sintéticos limpos (migração 0016): UNIAGRO-SP + revisões/origens/execuções de teste removidos; exemplos de calibragem sem CNPJ inventado, origem 'manual'; provas futuras da tela de decisão no ambiente de TESTE (64536)
  3. Usuário de verificação (migração 0015 + 0018/0019): verificacao@radar.local / VerifRadar@2026 (segredo RADAR_VERIF_PASSWORD) — só leitura PROVADO (rota Executar agora 403; revisões bloqueadas; própria senha bloqueada); RADAR_LEO_TEMP_PASSWORD REMOVIDO — nunca mais redefinir a senha do Leonardo; campo 'papel' NÃO persistiu na coleção users gerenciada pela plataforma (2 tentativas) — regras por E-MAIL (0019)
- IMPORTAÇÃO REAL DO MAPA (26/10 15:45): arquivo oficial baixado no pod (2,87 MB, 15.884 linhas); 1ª tentativa 10.170 inválidas (mapeamento uf errado — arquivo usa UNIDADE_DA_FEDERACAO; corrigido na fonte); 2ª tentativa FINAL: 21 lotes → 10.170 lidas, 5.403 novas, 2.390 já conhecidas (idempotência provada), 2.310 para conferir, 67 inválidas. Produção: 5.414 empresas, 485 BA, 6 bons exemplos intactos
- EXECUTAR AGORA (v0.0.26, ref f07195a publicado): rota /backend/v1/executar-agora + botão na tela Fontes (auth por e-mail, dry_run, lotes de 500); LIMITAÇÃO: $http.send do Skip Cloud não alcançou dados.agricultura.gov.br (dry_run pendente >25 min — egress bloqueado/lento); caminho operacional atual: Maestro baixa e injeta via admin (idempotente)
- proximo_ciclo: (1) DECISÃO DO CHAMPION sobre 2.310 revisões pendentes (volume alto — prováveis filiais mesmo nome+UF; revisar 1 a 1 é inviável; definir regra de junção ou triagem); (2) reporte do champion sobre a /conferencia (CA-1-23); (3) 67 inválidas (padrão na tela Fontes); (4) botão 100% no app depende de egress do Skip Cloud; (5) Apollo real permanece adiada
- atualizado_em: 2026-10-26T15:50:00-03:00
- comunicacao: seguir .adapta-cliente/comunicacao-com-leonardo.md; não pedir novamente ICP aprovado, capacidade confirmada, Apollo adiada, fonte aprovada; uma pergunta simples por vez
