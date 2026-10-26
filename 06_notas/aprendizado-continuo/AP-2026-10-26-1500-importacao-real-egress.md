# AP — importação real do MAPA e limites do egress (26/10)

Data: 26/10/2026 · task SPEC-1-005-nota-icp

- $http.send do Skip Cloud NÃO alcançou dados.agricultura.gov.br: dry_run ficou pendente >25 min (egresso do backend bloqueado/muito lento para esse host). Não insistir: o caminho operacional provado é download no pod (requests com verify=False — TLS do pod não valida o certificado do gov.br) + injeção em lotes via admin.
- curl com corpo de 500 linhas JSON estoura 'Argument list too long' (Errno 7) — sempre gravar o corpo em arquivo e usar curl -d @arquivo.
- Mapeamento da fonte é ESTADO VIVO e deve espelhar o leiaute REAL: o arquivo do MAPA usa UNIDADE_DA_FEDERACAO (não UF). Sintoma de mapeamento errado: 100% 'fora das UFs do perfil ()' — UF vazia. Corrigir na fonte (PATCH config), sem mudar código.
- Importação idempotente provada em escala: 2ª passada sobre a mesma base → 2.390 'atualizados' (junta origem), 0 duplicadas.
- Campo 'papel' não persiste na coleção users gerenciada pela plataforma (new Field e SelectField falharam silenciosamente) — regras de acesso por E-MAIL funcionam (0019). Nunca referenciar @request.auth.papel em regras.
- auth.collection() lança 'Value is not an object' no goja para _superusers — em rotas, autenticar por e.auth + email, nunca por collection().name().
- $http.send: resposta tem statusCode (não status); não lança em HTTP ≠ 2xx — checar explicitamente e try/catch para transporte.
- Rotas custom: /backend/v1/... SEM /api/ (o frontend publicado não proxia /api/); middleware $apis.requireAuth() como trailing arg + e.auth.
- Registro de usuário auth exige setPassword ANTES do primeiro save (password: Cannot be blank).
