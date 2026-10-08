# Espelho de código — cópia de consulta

A fonte executável é o Skip. Estado em 08/10/2026, task SPEC-1-008-visual-v1:
- GRAVADOS no projeto de teste (64536): `ui/visual-demo-state.mjs`, `testes/visual-demo.test.mjs`,
  `src/demo/fixtures.ts`, `src/demo/DemoShell.tsx`, `src/pages/demo/MeuDia.tsx`.
- PENDENTES de aplicação no 64536 (MCP indisponível): `src/pages/demo/Perfis.tsx` e o patch de
  `src/App.tsx` — o conteúdo aqui é o aprovado na análise, pronto para aplicar e publicar.
- Nunca edite o espelho para mudar o sistema.

## Rotas da demo (App.tsx)
- `/demo` → Meu dia (fila do dia)
- `/demo/empresa/:id` → Ficha da empresa
- `/demo/perfis` → Perfis de busca
