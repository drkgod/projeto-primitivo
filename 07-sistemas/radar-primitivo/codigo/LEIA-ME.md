# Espelho de código — cópia de consulta

A fonte executável é o Skip. Estado em 22/10/2026, task SPEC-1-002-perfis-busca:
- 64536 (teste): v0.0.7 a4a9e73 publicada — https://radar-primitivo-teste-3a85f.goskip.app/perfis
- 64528 (produção): v0.0.7 e28d4c1 publicada — https://projeto-greenexta-d13f9.goskip.app/perfis
- Migrações 0001/0002/0004 nos dois ambientes; 0003 (usuário de teste) só no 64536.
- App.tsx e Layout.tsx aqui são os da PRODUÇÃO (sem a demo; a demo do 64536 adiciona as rotas /demo).
- TDD: GREEN 8/8 (testes/perfis.test.mjs contra a URL interna do PocketBase do 64536).
- Nunca edite o espelho para mudar o sistema.
