# Radar Primitivo — plataforma de construção

- plataforma: Skip
- projeto_id: 64528
- url_producao: https://projeto-greenexta-d13f9.goskip.app
- url_preview: https://projeto-greenexta-d13f9--preview.goskip.app
- ultima_task: SPEC-1-002-perfis-busca (tela + coleções + hooks; teste 64536 v0.0.7 a4a9e73; produção v0.0.7 e28d4c1)
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

## Nota operacional (22/10/2026)

- A API do PocketBase responde na URL interna `*.shrd00.internal.goskip.dev` (a mesma que o app
  usa via VITE_POCKETBASE_URL). O domínio público `*.goskip.app` serve só o frontend.
- Migrações 0001/0002/0004 (coleções de perfis + seeds) valem para produção e teste (mesmo banco
  por ambiente). A 0003 (usuário de teste) existe só no 64536.
- Sem tela de login ainda (DÚVIDA de 08/10 ao consultor): a tela /perfis exige sessão autenticada
  (regra de acesso); sem sessão, a lista aparece vazia por design.

## Histórico de entregas

| Data | Task | Versão publicada | Arquivos alterados |
|---|---|---|---|
| 08/10/2026 | config | — | governança |
| 08/10/2026 | SPEC-1-008-visual-v1 | teste 64536 v0.0.2 (4aa2ec4) — demo no ar | demo (só teste) |
| 09/10/2026 | SPEC-1-008-visual-v1 (fechamento) | produção v0.0.6 (44d6992) — aceite CL-005 | aceite, changelog, STATUS, fase |
| 22/10/2026 | SPEC-1-002-perfis-busca | teste 64536 v0.0.7 (a4a9e73) + produção v0.0.7 (e28d4c1) | migrações 0001/0002/0004, hooks, serviço, libs, telas /perfis |
