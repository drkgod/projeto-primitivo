# Radar Primitivo — plataforma de construção

- plataforma: Skip
- projeto_id: 64528
- url_producao: https://projeto-greenexta-d13f9.goskip.app
- url_preview: https://projeto-greenexta-d13f9--preview.goskip.app
- versao_aplicada: a823b66 (v0.0.4 — governança da task SPEC-1-008-visual-v1)
- versao_publicada: a823b66 em 2026-10-08T14:23:19Z
- ultima_task: SPEC-1-008-visual-v1 (implementada; demo no projeto de teste 64536 pendente de publicação)
- espelho: `codigo/` guarda a última versão de cada arquivo alterado pelas tasks. É cópia de
  consulta; a fonte executável é o Skip. Nunca edite o espelho para mudar o sistema.

## Ambientes (regra comum das SPECs da Fase 1)

| Papel | Projeto Skip | ID | Hostname |
|---|---|---|---|
| Produção (dados reais) | Projeto Greenexta | 64528 | projeto-greenexta-d13f9 |
| Teste (dados fictícios, Apollo simulada) | Radar Primitivo Teste | 64536 | radar-primitivo-teste-3a85f |
| Ensaio de restauração | Radar Primitivo Restauro | 64537 | radar-primitivo-restauro-6f9a5 |

Decisão do champion Leonardo (08/10/2026): o Projeto Greenexta (64528) foi designado como
produção; os ambientes de teste e restauro foram criados em branco conforme as SPECs.

## Histórico de entregas

| Data | Task | Versão publicada | Arquivos alterados |
|---|---|---|---|
| 08/10/2026 | config | — (não é entrega de produto) | .adapta-cliente/estado-atual.md, 07-sistemas/radar-primitivo/plataforma.md |
| 08/10/2026 | SPEC-1-008-visual-v1 | produção a823b66 (governança) · teste 64536 PENDENTE (MCP "manager is closed" após 5 gravações; faltam Perfis.tsx e App.tsx no working tree) | ver espelho em codigo/ |
