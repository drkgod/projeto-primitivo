import type { RecordModel } from 'pocketbase'
import pb from '@/lib/pocketbase/client'

export type RotaPerfil = 'distribuidores_regionais' | 'industrias_fertilizantes'
export type EstadoPerfil = 'rascunho' | 'ativo' | 'inativo'

export interface FamiliaCargo {
  nome: string
  titulos: string[]
  senioridades?: string[]
}

export interface CriterioPerfil {
  id: string
  nome: string
  tipo: string
  regra: unknown
  pontos: number
  impeditivo?: boolean
}

export interface ContaExcluida {
  razao_social: string
  dominio?: string
  cnpj?: string
}

export interface PerfilBusca extends RecordModel {
  nome: string
  rota: RotaPerfil
  rota_comercial: string
  estado: EstadoPerfil
  versao: number
  perfil_base: string
  ufs?: string[]
  municipios?: string[]
  termos_segmento?: string[]
  atividades_aceitas?: string[]
  culturas?: string[]
  funcionarios_min?: number
  funcionarios_max?: number
  familias_cargo?: FamiliaCargo[]
  criterios?: CriterioPerfil[]
  faixas?: Record<string, number>
  faixas_liberadas?: string[]
  contas_excluidas?: ContaExcluida[]
  capacidade_dia?: number
  capacidade_semana?: number
  teto_creditos_mes?: number
  canais?: string[]
  dias_execucao?: string[]
  hora_fila?: string
  ativado_por?: string
  ativado_em?: string
  created: string
  updated: string
}

export interface PerfilVersao extends RecordModel {
  perfil: string
  versao: number
  snapshot: Record<string, unknown>
  ativado_por?: string
  ativado_em?: string
  motivo: string
  created: string
}

export interface EntradaPerfil {
  nome: string
  rota_comercial: string
  ufs: string[]
  municipios: string[]
  termos_segmento: string[]
  atividades_aceitas: string[]
  culturas: string[]
  funcionarios_min: number | null
  familias_cargo: FamiliaCargo[]
  criterios: CriterioPerfil[]
  faixas: Record<string, number>
  faixas_liberadas: string[]
  contas_excluidas: ContaExcluida[]
  capacidade_dia: number | null
  capacidade_semana: number | null
  teto_creditos_mes: number | null
  canais: string[]
  dias_execucao: string[]
  hora_fila: string
}

/** Converte listas de texto (uma por linha) em arrays limpos. */
export const linhasParaLista = (texto: string): string[] =>
  texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean)

export const listaParaLinhas = (lista: string[] | undefined): string =>
  (lista ?? []).join('\n')

export const listarPerfis = () =>
  pb.collection<PerfilBusca>('perfis_busca').getList(1, 20, { sort: 'rota,-versao' })

export const obterPerfil = (id: string) => pb.collection<PerfilBusca>('perfis_busca').getOne(id)

export const salvarRascunho = (id: string, dados: Partial<EntradaPerfil>) =>
  pb.collection<PerfilBusca>('perfis_busca').update(id, dados)

/** Cria rascunho da próxima versão a partir do perfil atual (novo registro). */
export const criarNovaVersao = async (perfil: PerfilBusca): Promise<PerfilBusca> => {
  const corpo = { ...perfil } as Record<string, unknown>
  delete corpo.id
  delete corpo.collectionId
  delete corpo.collectionName
  delete corpo.created
  delete corpo.updated
  delete corpo.ativado_por
  delete corpo.ativado_em
  corpo.estado = 'rascunho'
  corpo.versao = perfil.versao + 1
  corpo.perfil_base = perfil.perfil_base || perfil.id
  return pb.collection<PerfilBusca>('perfis_busca').create(corpo)
}

/** Ativa (rascunho→ativo) ou reativa (inativo→ativo); o hook valida e audita. */
export const ativarPerfil = (id: string, ativadoPor: string) =>
  pb.collection<PerfilBusca>('perfis_busca').update(id, {
    estado: 'ativo',
    ativado_por: ativadoPor,
  })

/** Desativa (ativo→inativo) sem alterar o conteúdo — permitido pelo hook de bloqueio. */
export const desativarPerfil = (id: string) =>
  pb.collection<PerfilBusca>('perfis_busca').update(id, { estado: 'inativo' })

export const listarVersoes = (perfilId: string) =>
  pb
    .collection<PerfilVersao>('perfis_versoes')
    .getList(1, 50, { filter: pb.filter('perfil = {:p}', { p: perfilId }), sort: '-created' })

export const usuarioAtual = (): string | null => pb.authStore.record?.id ?? null
