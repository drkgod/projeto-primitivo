// tasks d746b918/ccc168e0 (SPEC-1-002): RN-01 (ativação completa), RN-03 (uma ativa por rota),
// gravação de perfis_versoes (snapshot + motivo) e ativado_em.
onRecordUpdate((e) => {
  // JSVM: callbacks rodam em VM separada — toda função fica dentro do callback.
  function listaDe(campo, rec) {
    try {
      const valor = JSON.parse(rec.getString(campo) || 'null')
      return Array.isArray(valor) ? valor : null
    } catch (_) {
      return null
    }
  }

  const rec = e.record
  const antes = rec.original()
  const novoEstado = rec.getString('estado')
  const estadoAnterior = antes.getString('estado')
  if (novoEstado !== 'ativo' || estadoAnterior === 'ativo') {
    return e.next()
  }

  const faltantes = []
  if (!rec.getString('rota')) faltantes.push('rota do perfil')
  if (!rec.getString('rota_comercial')) faltantes.push('descrição da rota comercial')
  const ufs = listaDe('ufs', rec)
  if (!ufs || ufs.length === 0) faltantes.push('pelo menos uma UF')
  const termos = listaDe('termos_segmento', rec)
  const atividades = listaDe('atividades_aceitas', rec)
  if (!(termos && termos.length > 0) && !(atividades && atividades.length > 0)) {
    faltantes.push('pelo menos um termo de segmento ou atividade')
  }
  const cargos = listaDe('familias_cargo', rec)
  const cargosOk = !!cargos && cargos.length > 0 && cargos.every(function (f) {
    return !!f && typeof f === 'object' && Array.isArray(f.titulos) && f.titulos.length > 0
  })
  if (!cargosOk) faltantes.push('cargos a buscar (pelo menos uma família com um título)')
  const criterios = listaDe('criterios', rec)
  const criteriosOk = !!criterios && criterios.some(function (c) {
    return !!c && typeof c === 'object' && Number(c.pontos) > 0
  })
  if (!criteriosOk) faltantes.push('pelo menos um critério com pontos maior que zero')
  let faixas = null
  try { faixas = JSON.parse(rec.getString('faixas') || 'null') } catch (_) {}
  if (!faixas || typeof faixas !== 'object' || Array.isArray(faixas) || Object.keys(faixas).length === 0) {
    faltantes.push('limites das faixas A/B/C/D')
  }
  const liberadas = listaDe('faixas_liberadas', rec)
  if (!liberadas || liberadas.length === 0) faltantes.push('faixas liberadas para contatos')
  if (!(rec.getInt('capacidade_dia') > 0)) faltantes.push('capacidade por dia maior que zero')
  if (!(rec.getInt('teto_creditos_mes') > 0)) faltantes.push('teto mensal de créditos maior que zero')

  if (faltantes.length > 0) {
    throw new BadRequestError('Perfil incompleto: ' + faltantes.join('; ') + '.', {
      faltantes: faltantes.join('; '),
    })
  }

  // RN-03: apenas uma versão ativa por rota (irmãs viram inativas)
  const rota = rec.getString('rota')
  const irmaas = $app.findRecordsByFilter(
    'perfis_busca',
    'rota = "' + rota.replace(/"/g, '\\"') + '" && estado = "ativo"',
    '',
    100,
    0,
  )
  for (const irma of irmaas) {
    if (irma.id === rec.id) continue
    irma.set('estado', 'inativo')
    $app.save(irma)
  }

  if (!rec.getString('perfil_base')) {
    rec.set('perfil_base', rec.id)
  }

  const agora = new Date().toISOString().replace('T', ' ')
  rec.set('ativado_em', agora)

  const reativacao = estadoAnterior === 'inativo'
  const colVersoes = $app.findCollectionByNameOrId('perfis_versoes')
  const linha = new Record(colVersoes)
  linha.set('perfil', rec.id)
  linha.set('versao', rec.getInt('versao'))
  linha.set('snapshot', {
    nome: rec.getString('nome'),
    rota: rota,
    rota_comercial: rec.getString('rota_comercial'),
    versao: rec.getInt('versao'),
    perfil_base: rec.getString('perfil_base'),
    ufs: ufs || [],
    municipios: listaDe('municipios', rec) || [],
    termos_segmento: termos || [],
    atividades_aceitas: atividades || [],
    culturas: listaDe('culturas', rec) || [],
    funcionarios_min: rec.getInt('funcionarios_min'),
    funcionarios_max: rec.getInt('funcionarios_max'),
    familias_cargo: cargos || [],
    criterios: criterios || [],
    faixas: faixas || {},
    faixas_liberadas: liberadas || [],
    contas_excluidas: listaDe('contas_excluidas', rec) || [],
    capacidade_dia: rec.getInt('capacidade_dia'),
    capacidade_semana: rec.getInt('capacidade_semana'),
    teto_creditos_mes: rec.getInt('teto_creditos_mes'),
    canais: listaDe('canais', rec) || [],
    dias_execucao: listaDe('dias_execucao', rec) || [],
    hora_fila: rec.getString('hora_fila'),
  })
  linha.set('ativado_por', rec.getString('ativado_por'))
  linha.set('ativado_em', agora)
  linha.set('motivo', reativacao
    ? 'Reativação da versão ' + rec.getInt('versao')
    : 'Ativação da versão ' + rec.getInt('versao'))
  $app.save(linha)

  return e.next()
}, 'perfis_busca')
