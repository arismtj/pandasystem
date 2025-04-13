import { InferType, number, object, string } from 'yup'
import { PaginacionDTO } from './common.dto'
import { CAMPO_REQUERIDO, ESTADO_ACTIVO } from '../constantes'

export const UsuarioSchemaDTO = object({
  id: number(),
  username: string().required(CAMPO_REQUERIDO),
  nombres: string().max(100).required(CAMPO_REQUERIDO),
  apellidos: string().max(100).required(CAMPO_REQUERIDO),
  email: string().max(100).required(CAMPO_REQUERIDO),
  numeroTelefono: string().max(50).nullable(),
  idPermiso: number().required(CAMPO_REQUERIDO),

  estado: string().length(1).default(ESTADO_ACTIVO),
})

export type UsuarioDTO = InferType<typeof UsuarioSchemaDTO> & {
  nombrePermiso?: string
}

export interface FiltroUsuarioDTO extends PaginacionDTO {
  username?: string
  nombres?: string
  apellidos?: string
}