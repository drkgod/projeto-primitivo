# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: bba1553f (SPEC-1-002) — perfil real ATIVO na produção (VERSÃO 2); em_andamento (aguarda aceite humano)
- executor: maesthos (Ethos do cliente)
- owner_informativo: Leonardo (champion)
- etapa: aguardando_aceite_humano — Leonardo confere o resumo da v2 e responde "perfil confere" (CA-1-08)
- ajuste_18_08: UniAgro = nome antigo da Modarc (razão social sempre foi Modarc; hoje Grupo Modarc, UniAgro é uma empresa do grupo). Materiais antigos que citam UniAgro se referem à Modarc. V2 do perfil ativada sem UniAgro em contas_excluidas (5 prospects); v1 inativa com auditoria.
- decisoes_do_champion_22_10: teto Apollo 500/mês; primeiro acesso com senha provisória (RADAR_LEO_TEMP_PASSWORD); blacklist = prospects ativos fora da fila (sem clientes hoje); maus exemplos = recuperação judicial; módulos industriais depois ("dois casos")
- producao: 64528 v0.0.8 (d2d6320) — usuário do Leonardo + perfil distribuidores preenchido (ICP v1) + ativo v2 (6wcpln8wcsfx5d4)
- auditoria: perfis_versoes — "Ativação da versão 1" (20:10Z) e "Ativação da versão 2" (21:09Z, snapshot sem UniAgro)
- prova_visual: 05_entregas/fase-1/SPEC-1-002/resumo-perfil-ativo-producao.png (v1; v2 muda só a lista de exclusão)
- premissas_registradas: pesos ×2 (contrato de inteiros; corte 60% inalterado); capacidade provisória 1/dia·5/sem (meta KickOff) até medição real (task 417da661)
- proximo_ciclo: (1) aceite do resumo v2 → fecha CA-1-08; (2) módulos industriais (2 casos) quando o Leonardo trouxer os nomes; (3) SPEC-1-003 (Apollo) segue bloqueada pela chave — teto já decidido
- pendente_github: nao
- atualizado_em: 2026-10-22T18:15:00-03:00
