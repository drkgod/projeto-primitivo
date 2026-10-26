# AP — hooks goja: json, campos novos e superusuário

Data: 26/10/2026 · task SPEC-1-004-telas-e-revisao

- Record.get('campo_json') em hook goja NÃO desserializa: usar getString e JSON.parse (objeto direto vem undefined → "sem razão social" fantasma).
- Campo novo usado por hook precisa de MIGRAÇÃO antes: PocketBase descarta silenciosamente campos não declarados (acao_decisao sumia no PATCH).
- Superusuário não é registro da coleção users: gravar relation decidido_por com id de superusuário falha (400 opaco). Validar com findRecordById('users', id) antes.
- after-success hooks devem terminar com e.next() em TODOS os caminhos (aviso da plataforma: realtime e outros handlers deixam de rodar).
- Testes que acumulam registros no banco: paginação estoura (perPage=50 já não bastava para revisões) — usar perPage alto + sort=-created e token único por rodada.
- dados.agricultura.gov.br rejeita TLS de não-navegador: curl/fetch do servidor falham (unexpected EOF); navegador funciona. Baixa da fonte real exige headless/proxy.
