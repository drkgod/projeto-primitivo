# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: SPEC-1-002-perfis-busca (d746b918 + 9e081d10 + ccc168e0 concluídas; bba1553f em_espera)
- executor: maesthos (Ethos do cliente)
- owner_informativo: Leonardo (champion)
- spec: 04_fase-atual/specs/spec-1-002-perfis-de-busca.md
- analise: .adapta-cliente/analises/SPEC-1-002-perfis-busca.md (+ ICP-v1-validacao.md)
- etapa: aguardando_resposta (parada com perguntas ao champion)
- ciclo: continuo (plugin 0.8.1) — 3 tasks entregues em aguardando_teste
- aguardando_teste: tela /perfis no projeto de teste (v0.0.7 a4a9e73) e na produção (e28d4c1)
- em_espera: bba1553f — ativação do perfil real depende do teto de créditos Apollo (decisão do champion) e de acesso de login na produção
- perguntas_na_parada: (1) teto mensal de créditos Apollo; (2) como criar o usuário de login na produção; (3) confirmar interpretação da blacklist (relacionamento direto fora da fila)
- verificacao_automatica: passou — GREEN 8/8 (perfis.test.mjs, URL interna do PB); QA Skip verde em 64536 (v0.0.7 a4a9e73) e produção (v0.0.7 e28d4c1)
- aprendizado: capturado na parada (3 sinais: URL interna do PB, JSVM top-level, lista filtra)
- sistema: radar-primitivo
- skip_projeto: 64528 (produção) · 64536 (teste) · 64537 (restauro)
- pendente_github: nao
- atualizado_em: 2026-10-22T16:10:00-03:00
