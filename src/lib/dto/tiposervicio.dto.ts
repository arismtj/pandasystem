import { InferType, number, object, string } from "yup"
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, PRECIO_REGEX } from "../constantes"
import { PaginacionDTO } from "./common.dto"

export const TipoServicioSchemaDTO = object({
  id: number(),
  nombre: string().max(100).required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),
  frecuencia: string().max(150).required(CAMPO_REQUERIDO),
  precio_unitario: string().max(10)
    .matches(PRECIO_REGEX, 'Debe ser un número válido con hasta 2 decimales')
    .required(CAMPO_REQUERIDO),
  idCliente: number().required(CAMPO_REQUERIDO),


})

export type TipoServicioDTO = InferType<typeof TipoServicioSchemaDTO> & {

}

export interface FiltroTipoServicioDTO extends PaginacionDTO {
  precio_unitario: any
  nombre?: string
  precio?: string

}