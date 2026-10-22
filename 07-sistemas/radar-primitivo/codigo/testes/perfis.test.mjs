// SPEC-1-002 — TDD de perfis de busca contra o projeto de teste (RADAR_URL = URL interna do PocketBase).
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const raiz = path.resolve(aqui, '..', '..', '..')
const URL_BASE = process.env.RADAR_URL || ''
const EMAIL = 'teste@radar.local'
const SENHA = process.env.RADAR_TEST_PASSWORD
  || readFileSync(path.join(raiz, '.segredo-local'), 'utf8').trim()
const carregarFixture = (arquivo) =>
  JSON.parse(readFileSync(path.join(aqui, 'fixtures', arquivo), 'utf8'))

let token = ''
let meuId = ''
let recIncompleto = ''
let recA = ''
let recB = ''
let recInd = ''

before(async () => {
  if (!URL_BASE) throw new Error('RADAR_URL não definida')
  const r = await fetch(`${URL_BASE}/api/collections/users/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: EMAIL, password: SENHA }),
  })
  assert.equal(r.status, 200, `login do usuário de teste falhou (${r.status})`)
  const dados = await r.json()
  token = dados.token
  meuId = dados.record.id
})

const api = async (metodo, caminho, corpo, comToken = true) => {
  const cab = { 'Content-Type': 'application/json' }
  if (comToken && token) cab.Authorization = token
  const r = await fetch(`${URL_BASE}${caminho}`, {
    method: metodo,
    headers: cab,
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  })
  let dados = null
  try { dados = await r.json() } catch (_) {}
  return { status: r.status, dados }
}

const criarPerfil = async (fixture, versao) => {
  const corpo = { ...fixture, nome: `${fixture.nome} ${Date.now()}-${versao}`, versao, estado: 'rascunho' }
  const r = await api('POST', '/api/collections/perfis_busca/records', corpo)
  assert.equal(r.status, 200, `criar perfil falhou: ${JSON.stringify(r.dados)}`)
  return r.dados.id
}

test('usuário anônimo não vê nenhum perfil (regra de acesso filtra)', async () => {
  const r = await api('GET', '/api/collections/perfis_busca/records', undefined, false)
  assert.equal(r.status, 200)
  assert.equal(r.dados.totalItems, 0, 'anônimo não pode ver registros')
})

test('ativação de perfil incompleto é recusada com a lista de faltantes (CA-1-06)', async () => {
  recIncompleto = await criarPerfil(carregarFixture('perfil-incompleto.json'), 1001)
  const r = await api('PATCH', `/api/collections/perfis_busca/records/${recIncompleto}`, {
    estado: 'ativo',
    ativado_por: meuId,
  })
  assert.equal(r.status, 400, `esperado 400, veio ${r.status}: ${JSON.stringify(r.dados)}`)
  const faltantes = String(r.dados?.message || '')
  assert.match(faltantes, /cargos/)
})

test('perfil completo ativa, grava versão e auditoria (CA-1-05)', async () => {
  recA = await criarPerfil(carregarFixture('perfil-teste.json'), 1002)
  const r = await api('PATCH', `/api/collections/perfis_busca/records/${recA}`, {
    estado: 'ativo',
    ativado_por: meuId,
  })
  assert.equal(r.status, 200, `ativação falhou: ${JSON.stringify(r.dados)}`)
  const depois = await api('GET', `/api/collections/perfis_busca/records/${recA}`)
  assert.equal(depois.dados.estado, 'ativo')
  const versoes = await api(
    'GET',
    `/api/collections/perfis_versoes/records?filter=${encodeURIComponent(`(perfil='${recA}')`)}`,
  )
  assert.equal(versoes.dados.totalItems, 1, 'esperada 1 linha de auditoria')
  assert.match(versoes.dados.items[0].motivo, /Ativação da versão 1002/)
  assert.equal(versoes.dados.items[0].snapshot.rota, 'distribuidores_regionais')
})

test('só uma versão ativa por rota (RN-03 · CA-1-07)', async () => {
  recB = await criarPerfil(carregarFixture('perfil-teste.json'), 1003)
  const r = await api('PATCH', `/api/collections/perfis_busca/records/${recB}`, {
    estado: 'ativo',
    ativado_por: meuId,
  })
  assert.equal(r.status, 200, `ativação de B falhou: ${JSON.stringify(r.dados)}`)
  const depois = await api('GET', `/api/collections/perfis_busca/records/${recA}`)
  assert.equal(depois.dados.estado, 'inativo', 'versão anterior deveria ficar inativa')
})

test('editar perfil ativo pela API é recusado (CA-1-07)', async () => {
  const r = await api('PATCH', `/api/collections/perfis_busca/records/${recB}`, { nome: 'X' })
  assert.equal(r.status, 403, `esperado 403, veio ${r.status}`)
})

test('ativar perfil já ativo não cria versão nova', async () => {
  const r = await api('PATCH', `/api/collections/perfis_busca/records/${recB}`, { estado: 'ativo' })
  assert.equal(r.status, 403, `esperado 403, veio ${r.status}`)
  const versoes = await api(
    'GET',
    `/api/collections/perfis_versoes/records?filter=${encodeURIComponent(`(perfil='${recB}')`)}`,
  )
  assert.equal(versoes.dados.totalItems, 1, 'ativação repetida não deve criar versão')
})

test('reativar versão anterior funciona e registra motivo (CA-1-07)', async () => {
  const r = await api('PATCH', `/api/collections/perfis_busca/records/${recA}`, {
    estado: 'ativo',
    ativado_por: meuId,
  })
  assert.equal(r.status, 200, `reativação falhou: ${JSON.stringify(r.dados)}`)
  const depois = await api('GET', `/api/collections/perfis_busca/records/${recA}`)
  assert.equal(depois.dados.estado, 'ativo')
  const recBDepois = await api('GET', `/api/collections/perfis_busca/records/${recB}`)
  assert.equal(recBDepois.dados.estado, 'inativo')
  const versoes = await api(
    'GET',
    `/api/collections/perfis_versoes/records?filter=${encodeURIComponent(`(perfil='${recA}')`)}&sort=-created`,
  )
  assert.equal(versoes.dados.totalItems, 2)
  assert.match(versoes.dados.items[0].motivo, /Reativação da versão 1002/)
})

test('rotas são independentes (CA-1-07)', async () => {
  const fixture = { ...carregarFixture('perfil-teste.json'), rota: 'industrias_fertilizantes' }
  recInd = await criarPerfil(fixture, 2001)
  const r = await api('PATCH', `/api/collections/perfis_busca/records/${recInd}`, {
    estado: 'ativo',
    ativado_por: meuId,
  })
  assert.equal(r.status, 200, `ativação da rota indústrias falhou: ${JSON.stringify(r.dados)}`)
  const depois = await api('GET', `/api/collections/perfis_busca/records/${recA}`)
  assert.equal(depois.dados.estado, 'ativo', 'rota distribuidores não deveria mudar')
})
