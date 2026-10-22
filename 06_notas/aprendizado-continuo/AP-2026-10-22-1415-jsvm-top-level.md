# AP-2026-10-22-1415 — função top-level em hook não é visível no callback (JSVM)

- Task: SPEC-1-002 (hook ativa-perfil-busca)
- Sintoma: QA do Skip reprovou o hook com "Hook scoping error".
- Causa: o JSVM executa callbacks em VM separada; declarações top-level não são acessíveis.
- Regra: toda função auxiliar de hook fica DENTRO do callback. O QA do Skip é o compilador —
  deixou pegar antes de rodar os testes.
