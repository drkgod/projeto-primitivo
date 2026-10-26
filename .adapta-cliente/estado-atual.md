# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: SPEC-1-005-nota-icp — sistema pronto para pesos do champion; regras de base aplicadas (26/10 17:00)
- executor: maesthos (Ethos do cliente)
- REGRAS DO CHAMPION (26/10 17:00) — TODAS APLICADAS E PROVADAS:
  1. Situação jurídica NUNCA filtra entrada/saída — só compõe a nota (critério situacao_juridica no perfil, pontos 0 + peso_pendente até a tabela chegar; nada inventado)
  2. CNPJ FORA de qualquer chave automática (MAPA só traz mascarado); cnpj_raiz/cnpj_completo/cnpj_fonte em dados_juridicos_cnpj, vazios para enriquecimento futuro (Receita Federal + site)
  3. Agrupamento por nome_normalizado+UF → grupo provável + confirmação ÚNICA (nunca fusão automática); empresa confirmada = 1 empresa com N unidades (Belagricola SP já CONFIRMADA pelo champion, 2 unidades)
  4. Toda linha do MAPA com nome é ativo na base: 2.310 ambíguas convertidas em unidades + 645 grupos prováveis (645 revisões de grupo pendentes da confirmação dele); 0 estacionadas fora
  5. Sementes jurídicas verificadas: Belagricola rec_extrajudicial (proc. 0070681-58.2025.8.16.0014, Curitiba, 11/12/2025) e Agrogalaxy rec_judicial (plano abr/2025, homologado mai/2025) em dados_juridicos_cnpj
- ESTADO: 7.167 empresas, 646 grupos (1 confirmado + 645 prováveis), 0 revisões de divergência pendentes, base intacta
- PESOS: rota /backend/v1/aplicar-pesos PRONTA E PROVADA (sem segredo RADAR_PESOS_CRITERIOS responde instrução, não inventa; com segredo aplica e recalcula TODAS as notas)
- PADRÃO DE SCHEMA PROVADO NESTE SKIP CLOUD: coleções novas persistem campos SOMENTE com objetos simples {name,type,...} (0007); construtores new TextField/SelectField/JSONField/RelationField/BoolField NÃO persistem (0015/0018/0020/0023 falharam silenciosamente); fields.add em coleção existente NÃO persiste; candidato nas revisões guarda o leiaute CRU do MAPA em CHAVES MAIÚSCULAS (RAZAO_SOCIAL, UNIDADE_DA_FEDERACAO...)
- proximo_ciclo: (1) tabela de pesos do champion (soma 20) → aplicar-pesos; (2) confirmação dos 645 grupos prováveis; (3) conferência das notas (CA-1-23); (4) enriquecimento CNPJ + situação jurídica em massa (campos prontos); (5) telas de grupos/unidades; (6) Apollo real permanece adiada
- atualizado_em: 2026-10-26T17:10:00-03:00
