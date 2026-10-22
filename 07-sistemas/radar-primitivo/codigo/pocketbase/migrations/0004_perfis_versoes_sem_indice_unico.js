// task SPEC-1-002: remove o índice único (perfil, versao) de perfis_versoes.
// A SPEC define "uma linha por ativação": reativação da mesma versão é um evento novo
// e deve gerar nova linha de auditoria. 0001 já aplicado é imutável — correção em migration nova.
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('perfis_versoes')
    col.removeIndex('idx_perfis_versoes_perfil_versao')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('perfis_versoes')
    col.addIndex('idx_perfis_versoes_perfil_versao', true, 'perfil, versao', '')
    app.save(col)
  },
)
