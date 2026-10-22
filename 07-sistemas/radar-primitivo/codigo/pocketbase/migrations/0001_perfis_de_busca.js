// task d746b918 (SPEC-1-002): coleções perfis_busca e perfis_versoes com regras de acesso
migrate(
  (app) => {
    const perfis = new Collection({
      name: 'perfis_busca',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: null,
      fields: [
        { name: 'nome', type: 'text', required: true, max: 120 },
        { name: 'rota', type: 'select', required: true, values: ['distribuidores_regionais', 'industrias_fertilizantes'], maxSelect: 1 },
        { name: 'rota_comercial', type: 'text', max: 120 },
        { name: 'estado', type: 'select', required: true, values: ['rascunho', 'ativo', 'inativo'], maxSelect: 1 },
        { name: 'versao', type: 'number', required: true, onlyInt: true },
        { name: 'perfil_base', type: 'text', max: 15 },
        { name: 'ufs', type: 'json', maxSize: 20000 },
        { name: 'municipios', type: 'json', maxSize: 100000 },
        { name: 'termos_segmento', type: 'json', maxSize: 20000 },
        { name: 'atividades_aceitas', type: 'json', maxSize: 20000 },
        { name: 'culturas', type: 'json', maxSize: 20000 },
        { name: 'funcionarios_min', type: 'number', onlyInt: true },
        { name: 'funcionarios_max', type: 'number', onlyInt: true },
        { name: 'familias_cargo', type: 'json', maxSize: 50000 },
        { name: 'criterios', type: 'json', maxSize: 100000 },
        { name: 'faixas', type: 'json', maxSize: 20000 },
        { name: 'faixas_liberadas', type: 'json', maxSize: 2000 },
        { name: 'contas_excluidas', type: 'json', maxSize: 200000 },
        { name: 'capacidade_dia', type: 'number', onlyInt: true },
        { name: 'capacidade_semana', type: 'number', onlyInt: true },
        { name: 'teto_creditos_mes', type: 'number', onlyInt: true },
        { name: 'canais', type: 'json', maxSize: 2000 },
        { name: 'dias_execucao', type: 'json', maxSize: 2000 },
        { name: 'hora_fila', type: 'text', max: 5 },
        { name: 'ativado_por', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'ativado_em', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(perfis)

    const perfisId = app.findCollectionByNameOrId('perfis_busca').id
    const versoes = new Collection({
      name: 'perfis_versoes',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'perfil', type: 'relation', required: true, collectionId: perfisId, maxSelect: 1, cascadeDelete: true },
        { name: 'versao', type: 'number', required: true, onlyInt: true },
        { name: 'snapshot', type: 'json', maxSize: 500000 },
        { name: 'ativado_por', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'ativado_em', type: 'date' },
        { name: 'motivo', type: 'text', max: 300 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_perfis_versoes_perfil_versao ON perfis_versoes (perfil, versao)',
      ],
    })
    app.save(versoes)
  },
  (app) => {
    try { app.delete(app.findCollectionByNameOrId('perfis_versoes')) } catch (_) {}
    try { app.delete(app.findCollectionByNameOrId('perfis_busca')) } catch (_) {}
  },
)
