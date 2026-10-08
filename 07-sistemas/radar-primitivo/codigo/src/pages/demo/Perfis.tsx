// Perfis de busca — dois perfis separados com resumo por seções (CA-1-35/36)
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createInitialDemoState } from '@/demo/fixtures'

export default function Perfis() {
  const demo = createInitialDemoState()
  const [previsto, setPrevisto] = useState<string | null>(null)

  return (
    <section aria-labelledby="titulo-perfis">
      <h1 id="titulo-perfis" className="text-2xl font-semibold">
        Perfis de busca
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Dois perfis independentes — distribuidores regionais e indústrias. Na demonstração, nada
        é ativado: “Pré-visualizar perfil” altera apenas esta tela.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {demo.perfis.map((perfil) => {
          const emPrevisao = previsto === perfil.id
          return (
            <Card key={perfil.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{perfil.nome}</CardTitle>
                    <CardDescription>{perfil.rotaComercial}</CardDescription>
                  </div>
                  <Badge
                    variant={perfil.estado === 'ativo' ? 'default' : 'outline'}
                    className={perfil.estado === 'ativo' ? '' : 'border-border text-muted-foreground'}
                  >
                    {perfil.estado === 'ativo' ? 'Ativo' : 'Rascunho'} · versão {perfil.versao}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {perfil.secoes.map((secao) => (
                  <div key={secao.titulo}>
                    <h3 className="text-sm font-medium">{secao.titulo}</h3>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
                      {secao.itens.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={emPrevisao ? 'secondary' : 'outline'}
                    onClick={() => setPrevisto(emPrevisao ? null : perfil.id)}
                    aria-pressed={emPrevisao}
                  >
                    {emPrevisao ? 'Fechar pré-visualização' : 'Pré-visualizar perfil'}
                  </Button>
                </div>
                {emPrevisao && (
                  <p role="status" className="rounded-md bg-accent px-3 py-2 text-sm">
                    Pré-visualização de {perfil.nome}: os critérios acima seriam usados pela busca
                    diária após a ativação. Nada foi ativado nesta demonstração.
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
