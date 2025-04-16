import { InferType, number, object, string, array } from 'yup'
import { PaginacionDTO } from './common.dto'
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, SELECT_MINIMO_UNO } from '../constantes'

export const PermisoSchemaDTO = object({
  id: number(),
  nombre: string().required(CAMPO_REQUERIDO),
  idsModulo: array()
    .of(number().required(CAMPO_REQUERIDO))
    .min(1, SELECT_MINIMO_UNO)
    .required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),
})

export type PermisoDTO = InferType<typeof PermisoSchemaDTO> & {
  modulos?: { nombre?: string, id?: number }
}

export interface FiltroPermisoDTO extends PaginacionDTO {
  nombre?: string
  idModulo?: string
}