// task ccc168e0 (SPEC-1-002): perfil ativo não muda pela API — nova versão é o caminho.
onRecordUpdateRequest((e) => {
  const antes = e.record.original()
  if (antes.getString('estado') === 'ativo') {
    throw new ForbiddenError('Perfil ativo não pode ser editado. Use "Editar" para criar uma nova versão em rascunho.')
  }
  return e.next()
}, 'perfis_busca')
