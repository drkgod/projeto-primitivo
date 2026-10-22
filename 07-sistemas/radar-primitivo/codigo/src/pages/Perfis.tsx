import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { useRealtime } from '@/hooks/use-realtime'
import { formatarDataHora } from '@/lib/formatos'
import { mensagemDeErro } from '@/lib/mensagens-erro'
import {
  ativarPerfil,
  desativarPerfil,
  listarPerfis,
  usuarioAtual,
  type PerfilBusca,
} from '@/services/perfis'

const ROTULO_ESTADO: Record<PerfilBusca['estado'], string> = {
  rascunho: 'Rascunho',
  ativo: 'Ativo',
  inativo: 'Inativo',
}

export function BadgeEstado({ estado }: { estado: PerfilBusca['estado'] }) {
  return (
    <Badge variant={estado === 'ativo' ? 'default' : 'secondary'}>
      {ROTULO_ESTADO[estado]}
    </Badge>
  )
}

export default function Perfis() {
  const isMobile = useIsMobile()
  const [itens, setItens] = useState<PerfilBusca[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [ocupado, setOcupado] = useState('')

  const carregar = useCallback(async () => {
    try {
      const pagina = await listarPerfis()
      setItens(pagina.items)
      setErro('')
    } catch (e) {
      setErro(mensagemDeErro(e, 'carregar os perfis'))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  useRealtime('perfis_busca', () => {
    carregar()
  })

  const revisarEAtivar = async (perfil: PerfilBusca) => {
    const meuId = usuarioAtual()
    if (!meuId) {
      toast.error('Sua sessão expirou. Entre de novo para continuar.')
      return
    }
    setOcupado(perfil.id)
    try {
      await ativarPerfil(perfil.id, meuId)
      toast.success(`Perfil ativo na versão ${perfil.versao}.`)
      await carregar()
    } catch (e) {
      toast.error(mensagemDeErro(e, 'ativar o perfil'))
    } finally {
      setOcupado('')
    }
  }

  const voltarVersaoAnterior = async (perfil: PerfilBusca) => {
    setOcupado(perfil.id)
    try {
      await desativarPerfil(perfil.id)
      toast.success(`Versão ${perfil.versao} desativada. Reative a versão anterior quando quiser.`)
      await carregar()
    } catch (e) {
      toast.error(mensagemDeErro(e, 'desativar o perfil'))
    } finally {
      setOcupado('')
    }
  }

  let conteudo: ReactNode
  if (carregando) {
    conteudo = (
      <div className="space-y-2" aria-busy="true" aria-label="Carregando perfis">
        {[1, 2].map((linha) => (
          <Skeleton key={linha} className="h-14 w-full" />
        ))}
      </div>
    )
  } else if (erro) {
    conteudo = (
      <Alert variant="destructive">
        <AlertTitle>Não foi possível carregar</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{erro}</p>
          <Button variant="outline" size="sm" onClick={() => carregar()}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tentar de novo
          </Button>
        </AlertDescription>
      </Alert>
    )
  } else if (itens.length === 0) {
    conteudo = (
      <div className="flex flex-col items-center py-16 text-center">
        <SlidersHorizontal className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">Nenhum perfil encontrado</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Os perfis de distribuidores e de indústrias são criados automaticamente. Se não
          aparecerem, tente de novo em instantes.
        </p>
      </div>
    )
  } else if (isMobile) {
    conteudo = (
      <ul className="space-y-3">
        {itens.map((perfil) => (
          <li key={perfil.id}>
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{perfil.nome}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {perfil.rota_comercial || '—'}
                    </p>
                  </div>
                  <BadgeEstado estado={perfil.estado} />
                </div>
                <p className="text-sm text-muted-foreground">versão {perfil.versao}</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" asChild>
                    <Link to={`/perfis/${perfil.id}`}>Abrir</Link>
                  </Button>
                  {perfil.estado === 'rascunho' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={ocupado === perfil.id}
                      onClick={() => revisarEAtivar(perfil)}
                    >
                      Revisar e ativar
                    </Button>
                  )}
                  {perfil.estado === 'ativo' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={ocupado === perfil.id}
                      onClick={() => voltarVersaoAnterior(perfil)}
                    >
                      Desativar
                    </Button>
                  )}
                  {perfil.estado === 'inativo' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={ocupado === perfil.id}
                      onClick={() => revisarEAtivar(perfil)}
                    >
                      Reativar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    )
  } else {
    conteudo = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Perfil</TableHead>
            <TableHead>Rota comercial</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Versão</TableHead>
            <TableHead>Ativado em</TableHead>
            <TableHead className="w-56">
              <span className="sr-only">Ações</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((perfil) => (
            <TableRow key={perfil.id}>
              <TableCell className="max-w-[16rem] truncate font-medium">
                <Link to={`/perfis/${perfil.id}`} className="hover:underline">
                  {perfil.nome}
                </Link>
              </TableCell>
              <TableCell className="max-w-[16rem] truncate">
                {perfil.rota_comercial || '—'}
              </TableCell>
              <TableCell>
                <BadgeEstado estado={perfil.estado} />
              </TableCell>
              <TableCell>versão {perfil.versao}</TableCell>
              <TableCell>{perfil.ativado_em ? formatarDataHora(perfil.ativado_em) : '—'}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {perfil.estado === 'rascunho' && (
                    <Button
                      size="sm"
                      disabled={ocupado === perfil.id}
                      onClick={() => revisarEAtivar(perfil)}
                    >
                      Revisar e ativar
                    </Button>
                  )}
                  {perfil.estado === 'ativo' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={ocupado === perfil.id}
                      onClick={() => voltarVersaoAnterior(perfil)}
                    >
                      Desativar
                    </Button>
                  )}
                  {perfil.estado === 'inativo' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={ocupado === perfil.id}
                      onClick={() => revisarEAtivar(perfil)}
                    >
                      Reativar
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Perfis de busca</h1>
        <p className="text-sm text-muted-foreground">
          {itens.length === 1 ? '1 perfil' : `${itens.length} perfis`} — o perfil ativo comanda a
          busca diária; editar um perfil ativo cria uma nova versão.
        </p>
      </div>
      {conteudo}
    </div>
  )
}
