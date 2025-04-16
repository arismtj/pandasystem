import { InferType, number, object, string } from "yup"
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, PRECIO_REGEX } from "../constantes"
import { PaginacionDTO } from "./common.dto"

export const TipoServicioSchemaDTO = object({
  id: number(),
  nombre: string().max(100).required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),
  frecuencia: string().max(150).required(CAMPO_REQUERIDO),
  precioUnitario: number().required(CAMPO_REQUERIDO),
  idCliente: number().required(CAMPO_REQUERIDO),
})

export type TipoServicioDTO = InferType<typeof TipoServicioSchemaDTO> & {
  nombreFrecuencia?: string
}

export interface FiltroTipoServicioDTO extends PaginacionDTO {
  precioUnitario?: number
  nombre?: string
  frecuencia?: string
}