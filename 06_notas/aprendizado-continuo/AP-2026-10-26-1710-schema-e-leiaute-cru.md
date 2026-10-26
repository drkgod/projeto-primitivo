# AP — padrões de schema e leiaute cru do MAPA (26/10)

Data: 26/10/2026 · task SPEC-1-005-nota-icp

- Neste Skip Cloud, coleção NOVA persiste campos somente com objetos simples {name, type, max, values, collectionId...} — o padrão da 0007. Construtores (new TextField/SelectField/JSONField/RelationField/BoolField) e fields.add em coleção existente NÃO persistem e falham em silêncio (provas: 0015/0018/0020/0023).
- O candidato guardado em revisoes_fusao é a linha CRUA do MAPA com chaves MAIÚSCULAS (RAZAO_SOCIAL, UNIDADE_DA_FEDERACAO, MUNICIPIO, CNPJ, STATUS_DO_REGISTRO, ATIVIDADE) — ler os dois formatos (minúsculo do mapeamento + maiúsculo cru) em qualquer conversão.
- Campo text tem limite de caracteres na gravação (motivo max 400): truncar a 360 + sufixo curto antes de salvar textos compostos longos.
- Erro de migração seed: o guardrail aponta o arquivo pendente de retry — corrigir o MESMO arquivo e reaplicar (não criar migração nova por cima).
- Regra do champion (26/10): situação jurídica nunca filtra; CNPJ nunca é chave automática; agrupamento por nome+UF com confirmação única; toda linha com nome é ativo na base.
