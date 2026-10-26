# AP — deploy da SPEC-1-004/005 na produção (64528)

Data: 26/10/2026 · task SPEC-1-005-nota-icp

- Migrações aplicadas na produção: 0007 (coleções descoberta com campos da nota + fontes iniciais), 0008 (fonte SIPEAGRO APROVADA — decisão do Leonardo 26/10 12:05, com URL, atribuição MAPA e mapeamento oficial), 0009 (seed dos 10 exemplos da conferência com nota calculada inline; bons = estado "adiada", fora da fila).
- Frontend publicado (da595ff + b0aa126): /login (nova tela), layout protegido (redireciona para /login sem sessão), rotas /conferencia /empresas /fontes /revisoes.
- Hooks levados para a produção: calcula-nota-empresa, recalcula-notas-perfil, processa-lote-descoberta, decide-revisao-fusao (bloqueia-edicao-perfil-ativo já existia).
- Verificação dos dados com autenticação NÃO foi possível (senha do Leonardo não está com o Maestro — correta e proposital). Primeiro login dele confirma os exemplos.
- Erros de gravação corrompida de hook (v0.0.9 da produção) foram reescritos limpos antes do apply final — QA verde.
- goja: sem dataSet(), sem fields.allNames() — listas fixas de campos; onRecordUpdateRequest roda mesmo para superusuário.
