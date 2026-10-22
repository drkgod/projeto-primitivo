import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { formatarDataHora, formatarNumero } from '@/lib/formatos'
import { mensagemDeErro } from '@/lib/mensagens-erro'
import {
  ativarPerfil,
  criarNovaVersao,
  linhasParaLista,
  listaParaLinhas,
  obterPerfil,
  salvarRascunho,
  usuarioAtual,
  type ContaExcluida,
  type CriterioPerfil,
  type FamiliaCargo,
  type PerfilBusca,
} from '@/services/perfis'

interface Formulario {
  nome: string
  rota_comercial: string
  ufs: string
  municipios: string
  termos_segmento: string
  atividades_aceitas: string
  culturas: string
  funcionarios_min: string
  familias_cargo: string
  criterios: string
  faixas: string
  faixas_liberadas: string
  contas_excluidas: string
  capacidade_dia: string
  capacidade_semana: string
  teto_creditos_mes: string
  hora_fila: string
}

const paraTexto = (valor: number | null | undefined) =>
  valor === null || valor === undefined ? '' : String(valor)

const carregarFormulario = (perfil: PerfilBusca): Formulario => ({
  nome: perfil.nome,
  rota_comercial: perfil.rota_comercial ?? '',
  ufs: listaParaLinhas(perfil.ufs),
  municipios: listaParaLinhas(perfil.municipios),
  termos_segmento: listaParaLinhas(perfil.termos_segmento),
  atividades_aceitas: listaParaLinhas(perfil.atividades_aceitas),
  culturas: listaParaLinhas(perfil.culturas),
  funcionarios_min: paraTexto(perfil.funcionarios_min),
  familias_cargo: JSON.stringify(perfil.familias_cargo ?? [], null, 2),
  criterios: JSON.stringify(perfil.criterios ?? [], null, 2),
  faixas: JSON.stringify(perfil.faixas ?? {}, null, 2),
  faixas_liberadas: listaParaLinhas(perfil.faixas_liberadas),
  contas_excluidas: JSON.stringify(perfil.contas_excluidas ?? [], null, 2),
  capacidade_dia: paraTexto(perfil.capacidade_dia),
  capacidade_semana: paraTexto(perfil.capacidade_semana),
  teto_creditos_mes: paraTexto(perfil.teto_creditos_mes),
  hora_fila: perfil.hora_fila ?? '07:00',
})

function parseJsonSeguro<T>(texto: string, padrao: T): { valor: T; erro?: string } {
  if (!texto.trim()) return { valor: padrao }
  try {
    return { valor: JSON.parse(texto) as T }
  } catch {
    return { valor: padrao, erro: 'JSON inválido' }
  }
}

const numeroDe = (texto: string): number | null => {
  const limpo = texto.trim().replace(/\./g, '').replace(',', '.')
  if (!limpo) return null
  const valor = Number(limpo)
  return Number.isFinite(valor) ? valor : null
}

export default function PerfilEditar() {
  const { id = '' } = useParams()
  const navegar = useNavigate()
  const [perfil, setPerfil] = useState<PerfilBusca | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState<Formulario | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [ativando, setAtivando] = useState(false)

  const carregar = useCallback(async () => {
    try {
      const registro = await obterPerfil(id)
      setPerfil(registro)
      setForm(carregarFormulario(registro))
      setErro('')
    } catch (e) {
      setErro(mensagemDeErro(e, 'carregar o perfil'))
    } finally {
      setCarregando(false)
    }
  }, [id])

  useEffect(() => {
    carregar()
  }, [carregar])

  if (carregando) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Carregando perfil">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (erro || !perfil || !form) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/perfis">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Não foi possível abrir o perfil</AlertTitle>
          <AlertDescription>{erro || 'Perfil não encontrado.'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const ativo = perfil.estado === 'ativo'
  const atualizar = (campo: keyof Formulario, valor: string) =>
    setForm((atual) => (atual ? { ...atual, [campo]: valor } : atual))

  const prepararAtivacao = async () => {
    setAtivando(true)
    try {
      if (ativo) {
        const nova = await criarNovaVersao(perfil)
        toast.success(`Rascunho da versão ${nova.versao} criado. Ajuste e ative quando quiser.`)
        navegar(`/perfis/${nova.id}`)
        return
      }
      await salvarTudo(false)
      const meuId = usuarioAtual()
      if (!meuId) {
        toast.error('Sua sessão expirou. Entre de novo para continuar.')
        return
      }
      await ativarPerfil(perfil.id, meuId)
      toast.success(`Perfil ativo na versão ${perfil.versao}.`)
      await carregar()
    } catch (e) {
      toast.error(mensagemDeErro(e, 'ativar o perfil'))
    } finally {
      setAtivando(false)
    }
  }

  const salvarTudo = async (avisar = true) => {
    if (!form) return
    const familias = parseJsonSeguro<FamiliaCargo[]>(form.familias_cargo, [])
    const criterios = parseJsonSeguro<CriterioPerfil[]>(form.criterios, [])
    const faixas = parseJsonSeguro<Record<string, number>>(form.faixas, {})
    const contas = parseJsonSeguro<ContaExcluida[]>(form.contas_excluidas, [])
    if (familias.erro || criterios.erro || faixas.erro || contas.erro) {
      toast.error(
        'Há JSON inválido nos campos avançados (cargos, critérios, faixas ou contas). Corrija antes de salvar.',
      )
      return
    }
    setSalvando(true)
    try {
      await salvarRascunho(perfil.id, {
        nome: form.nome.trim(),
        rota_comercial: form.rota_comercial.trim(),
        ufs: linhasParaLista(form.ufs),
        municipios: linhasParaLista(form.municipios),
        termos_segmento: linhasParaLista(form.termos_segmento),
        atividades_aceitas: linhasParaLista(form.atividades_aceitas),
        culturas: linhasParaLista(form.culturas),
        funcionarios_min: numeroDe(form.funcionarios_min),
        familias_cargo: familias.valor,
        criterios: criterios.valor,
        faixas: faixas.valor,
        faixas_liberadas: linhasParaLista(form.faixas_liberadas),
        contas_excluidas: contas.valor,
        capacidade_dia: numeroDe(form.capacidade_dia),
        capacidade_semana: numeroDe(form.capacidade_semana),
        teto_creditos_mes: numeroDe(form.teto_creditos_mes),
        hora_fila: form.hora_fila.trim(),
      })
      if (avisar) toast.success('Rascunho salvo.')
      await carregar()
    } catch (e) {
      toast.error(mensagemDeErro(e, 'salvar o perfil'))
    } finally {
      setSalvando(false)
    }
  }

  const secoes: { titulo: string; descricao: string; conteudo: React.ReactNode }[] = [
    {
      titulo: 'Rota',
      descricao: 'Identificação do perfil no sistema.',
      conteudo: (
        <>
          <div className="space-y-1">
            <Label htmlFor="nome">Nome do perfil</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => atualizar('nome', e.target.value)}
              disabled={ativo}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="rota_comercial">Rota comercial</Label>
            <Input
              id="rota_comercial"
              value={form.rota_comercial}
              onChange={(e) => atualizar('rota_comercial', e.target.value)}
              disabled={ativo}
              placeholder="ex.: importação direta / marca própria"
            />
          </div>
        </>
      ),
    },
    {
      titulo: 'Onde buscar',
      descricao: 'Regiões e municípios prioritários (um por linha).',
      conteudo: (
        <>
          <div className="space-y-1">
            <Label htmlFor="ufs">UFs (uma por linha)</Label>
            <Textarea
              id="ufs"
              rows={4}
              value={form.ufs}
              onChange={(e) => atualizar('ufs', e.target.value)}
              disabled={ativo}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="municipios">Municípios (opcional, um por linha)</Label>
            <Textarea
              id="municipios"
              rows={3}
              value={form.municipios}
              onChange={(e) => atualizar('municipios', e.target.value)}
              disabled={ativo}
            />
          </div>
        </>
      ),
    },
    {
      titulo: 'Quem buscar',
      descricao: 'Segmento, atividades e porte das empresas.',
      conteudo: (
        <>
          <div className="space-y-1">
            <Label htmlFor="termos_segmento">Termos de segmento (um por linha)</Label>
            <Textarea
              id="termos_segmento"
              rows={3}
              value={form.termos_segmento}
              onChange={(e) => atualizar('termos_segmento', e.target.value)}
              disabled={ativo}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="atividades_aceitas">Atividades aceitas (opcional, uma por linha)</Label>
            <Textarea
              id="atividades_aceitas"
              rows={3}
              value={form.atividades_aceitas}
              onChange={(e) => atualizar('atividades_aceitas', e.target.value)}
              disabled={ativo}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="funcionarios_min">Funcionários mínimos (opcional)</Label>
            <Input
              id="funcionarios_min"
              inputMode="numeric"
              value={form.funcionarios_min}
              onChange={(e) => atualizar('funcionarios_min', e.target.value)}
              disabled={ativo}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="culturas">Culturas-alvo (uma por linha)</Label>
            <Textarea
              id="culturas"
              rows={3}
              value={form.culturas}
              onChange={(e) => atualizar('culturas', e.target.value)}
              disabled={ativo}
            />
          </div>
        </>
      ),
    },
    {
      titulo: 'Como pontuar',
      descricao: 'Critérios, pesos e faixas — em JSON, conforme o contrato da SPEC.',
      conteudo: (
        <>
          <div className="space-y-1">
            <Label htmlFor="familias_cargo">Famílias de cargo (JSON)</Label>
            <Textarea
              id="familias_cargo"
              rows={8}
              value={form.familias_cargo}
              onChange={(e) => atualizar('familias_cargo', e.target.value)}
              disabled={ativo}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="criterios">Critérios (JSON)</Label>
            <Textarea
              id="criterios"
              rows={10}
              value={form.criterios}
              onChange={(e) => atualizar('criterios', e.target.value)}
              disabled={ativo}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="faixas">Faixas A/B/C/D (JSON)</Label>
            <Textarea
              id="faixas"
              rows={4}
              value={form.faixas}
              onChange={(e) => atualizar('faixas', e.target.value)}
              disabled={ativo}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="faixas_liberadas">Faixas liberadas para contatos (uma por linha)</Label>
            <Textarea
              id="faixas_liberadas"
              rows={2}
              value={form.faixas_liberadas}
              onChange={(e) => atualizar('faixas_liberadas', e.target.value)}
              disabled={ativo}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="contas_excluidas">Contas excluídas — nunca entram na fila (JSON)</Label>
            <Textarea
              id="contas_excluidas"
              rows={6}
              value={form.contas_excluidas}
              onChange={(e) => atualizar('contas_excluidas', e.target.value)}
              disabled={ativo}
              className="font-mono text-xs"
            />
          </div>
        </>
      ),
    },
    {
      titulo: 'Quanto cabe',
      descricao: 'Capacidade de trabalho e teto de créditos.',
      conteudo: (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="capacidade_dia">Capacidade por dia</Label>
            <Input
              id="capacidade_dia"
              inputMode="numeric"
              value={form.capacidade_dia}
              onChange={(e) => atualizar('capacidade_dia', e.target.value)}
              disabled={ativo}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="capacidade_semana">Capacidade por semana</Label>
            <Input
              id="capacidade_semana"
              inputMode="numeric"
              value={form.capacidade_semana}
              onChange={(e) => atualizar('capacidade_semana', e.target.value)}
              disabled={ativo}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="teto_creditos_mes">Teto de créditos por mês</Label>
            <Input
              id="teto_creditos_mes"
              inputMode="numeric"
              value={form.teto_creditos_mes}
              onChange={(e) => atualizar('teto_creditos_mes', e.target.value)}
              disabled={ativo}
            />
          </div>
        </div>
      ),
    },
    {
      titulo: 'Quando rodar',
      descricao: 'Cadência da busca e da fila.',
      conteudo: (
        <div className="space-y-1">
          <Label htmlFor="hora_fila">Hora da fila (America/Sao_Paulo)</Label>
          <Input
            id="hora_fila"
            value={form.hora_fila}
            onChange={(e) => atualizar('hora_fila', e.target.value)}
            disabled={ativo}
          />
          <p className="text-xs text-muted-foreground">
            Dias úteis por padrão (segunda a sexta). A fila fica pronta às {form.hora_fila || '07:00'}.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Button variant="ghost" size="sm" asChild className="mb-1 -ml-2">
            <Link to="/perfis">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Perfis de busca
            </Link>
          </Button>
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight">
            {perfil.nome}
            <Badge variant={ativo ? 'default' : 'secondary'}>
              {ativo ? 'Ativo' : perfil.estado === 'inativo' ? 'Inativo' : 'Rascunho'}
            </Badge>
            <span className="text-sm font-normal text-muted-foreground">versão {perfil.versao}</span>
          </h1>
          {perfil.ativado_em && (
            <p className="text-sm text-muted-foreground">
              Ativado em {formatarDataHora(perfil.ativado_em)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {!ativo && (
            <Button
              variant="outline"
              onClick={() => salvarTudo(true)}
              disabled={salvando || ativando}
            >
              {salvando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Salvar rascunho
            </Button>
          )}
          {ativo ? (
            <Button onClick={prepararAtivacao} disabled={salvando || ativando}>
              {ativando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Editar (nova versão)
            </Button>
          ) : (
            <Button onClick={prepararAtivacao} disabled={salvando || ativando}>
              {ativando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Revisar e ativar
            </Button>
          )}
        </div>
      </div>

      {ativo && (
        <Alert>
          <AlertTitle>Perfil ativo</AlertTitle>
          <AlertDescription>
            Este perfil comanda a busca diária e não pode ser alterado direto. "Editar (nova
            versão)" cria um rascunho da versão {formatarNumero(perfil.versao + 1)}; ao ativá-la,
            esta versão fica inativa e pode ser reativada depois.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {secoes.map((secao) => (
          <Card key={secao.titulo}>
            <CardHeader>
              <CardTitle className="text-base">{secao.titulo}</CardTitle>
              <p className="text-sm text-muted-foreground">{secao.descricao}</p>
            </CardHeader>
            <CardContent className="space-y-4">{secao.conteudo}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
