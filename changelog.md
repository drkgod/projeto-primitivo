# Histórico operacional

## 08/10/2026 — Publicação da demo no ambiente de teste concluída

- Recuperação da indisponibilidade MCP: o working tree do 64536 sobreviveu com 6/8 arquivos
  (incluindo FichaEmpresa.tsx); Perfis.tsx e App.tsx reaplicados do espelho aprovado.
- Aplicação v0.0.2 (4aa2ec4) com QA integral verde (setup, análise estática, build,
  integrações, testes) e publicação em https://radar-primitivo-teste-3a85f.goskip.app.
- Prova de fumaça no ar: Meu dia com as 6 empresas fictícias e ações; Perfis com os 2 perfis
  e pré-visualização funcionando.
- Estado movido para aguardando_teste_humano; roteiro CL-005 enviado ao champion.
- Nenhuma alteração na produção de dados reais (64528 segue em v0.0.4).

## 08/10/2026 — Task SPEC-1-008-visual-v1 implementada; publicação no teste pendente

- Autorização do champion ("Sim — pode implementar") executada: módulo de estado
  demonstrativo com TDD (RED confirmado, GREEN 11/11), fixtures, shell e telas Meu dia,
  Ficha e Perfis; App.tsx com rotas /demo.
- Evidências em 05_entregas/fase-1/SPEC-1-008/ (red.txt, green.txt, rede.md, skills-ui-ux.md,
  publicacao.md).
- Produção 64528 publicada (a823b66) com governança da task.
- Publicação da demo no teste 64536 PENDENTE: indisponibilidade da camada MCP do Skip
  ("manager is closed") após 5 arquivos gravados; Perfis.tsx e App.tsx ficaram fora do
  working tree e serão aplicados na recuperação.
- Nenhum teste humano solicitado sobre versão não publicada (regra da casa).
