import { date, InferType, number, object, string } from "yup"
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, MONTO_INVALIDO } from "../constantes"
import { PaginacionDTO } from "./common.dto"

export const PagoSchemaDTO = object({
  id: number(),
  fechaPago: date().required(CAMPO_REQUERIDO),
  monto: number().positive(MONTO_INVALIDO).required(CAMPO_REQUERIDO),
  formaPago: string().max(30).required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),

  idServicio: number().required(CAMPO_REQUERIDO),
  idDeuda: number().required(CAMPO_REQUERIDO),
})

export type PagoDTO = InferType<typeof PagoSchemaDTO> & {}

export interface FiltroPagoDTO extends PaginacionDTO {
  fechaPago?: Date
  formaPago?: string
}
