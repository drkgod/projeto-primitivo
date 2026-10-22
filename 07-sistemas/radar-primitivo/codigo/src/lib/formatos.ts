import { format, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const numero = new Intl.NumberFormat('pt-BR')

export const formatarNumero = (valor: number) => numero.format(valor)

function data(iso: string) {
  const valor = iso ? parseISO(iso) : null
  return valor && isValid(valor) ? valor : null
}

export function formatarData(iso: string) {
  const valor = data(iso)
  return valor ? format(valor, 'dd/MM/yyyy', { locale: ptBR }) : '—'
}

export function formatarDataHora(iso: string) {
  const valor = data(iso)
  return valor ? format(valor, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '—'
}
