import { date, InferType, number, object, string } from "yup"
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, MONTO_INVALIDO } from "../constantes"
import { PaginacionDTO } from "./common.dto"

export const DeudaSchemaDTO = object({
  id: number(),
  fechaLimite: date().required(CAMPO_REQUERIDO),
  fechaNotificacion: date().required(CAMPO_REQUERIDO),
  monto: number().positive(MONTO_INVALIDO).required(CAMPO_REQUERIDO),
  ultimoPago: string().max(100).required(CAMPO_REQUERIDO),

  idServicio: number().required(CAMPO_REQUERIDO),

  // auditoria
  estado: string().length(1).default(ESTADO_ACTIVO),
})

export type DeudaDTO = InferType<typeof DeudaSchemaDTO> & {
  fechaCreacion?: Date
}

export interface FiltroDeudaDTO extends PaginacionDTO {
  fechaCreacion?: string
  ultimoPago?: string
}
