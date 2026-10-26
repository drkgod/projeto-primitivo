# AP — bloqueio de perfil ativo e recálculo (goja)

Data: 26/10/2026 · task SPEC-1-005-nota-icp

- onRecordUpdateRequest roda ANTES de salvar mesmo para superusuário (não bypassa) — o bloqueio da SPEC-1-002 travava o desativar→reativar.
- Record do goja NÃO tem dataSet() nem fields.allNames() — usar lista fixa de campos para comparar mudanças.
- Regra final do bloqueio: com perfil ativo, só "estado" pode mudar (para inativo); qualquer outro campo → 403. Desativar→corrigir→reativar é o caminho de manutenção.
- Recálculo de notas (CA-1-22) implementado em onRecordAfterUpdateSuccess de perfis_busca quando estado vira ativo: varre empresas em lotes de 200 e recalcula (lógica em sincronia com calcula-nota-empresa.js).
- PROVA: desativar→reativar recalculou (nota_calculada_em 15:17:27 → 15:21:33).
- Mapeamento da fonte é ESTADO VIVO: o teste da SPEC-1-004 sobrescreveu com o leiaute antigo — restaurar antes de lotes com o leiaute oficial (RAZAO_SOCIAL/CNPJ/MUNICIPIO/UF/STATUS_DO_REGISTRO/ATIVIDADE).
- Empresas dos exemplos bons criadas com estado "adiada" (fora da fila, prospect manual) para a conferência da nota sem violar a exclusão da fila.
