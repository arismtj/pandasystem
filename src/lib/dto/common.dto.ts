import { User } from "next-auth"

export interface PaginacionDTO {
  page: number | string // Página actual
  rowsPerPage?: number | string // Filas por página
  sortBy?: string // Ordernar por nombre de campo
  orderBy?: 'asc' | 'desc' // Ordenar de forma ascendente o descendente
}

export interface RespuestaDTO<T> {
  ok: boolean
  error?: any
  data?: T
}

export interface SelectDTO {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectDTO2 extends SelectDTO {
  extras: any
}

export interface SelectOptions {
  excluirId?: number | string
  incluirId?: number | string
  soloActivos?: boolean
}