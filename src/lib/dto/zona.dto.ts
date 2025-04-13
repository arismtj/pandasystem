import { InferType, number, object, string } from "yup"
import { CAMPO_REQUERIDO, ESTADO_ACTIVO } from "../constantes"
import { PaginacionDTO } from "./common.dto"

export const ZonaSchemaDTO = object({
  id: number(),
  nombre: string().max(100).required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),
})

export type ZonaDTO = InferType<typeof ZonaSchemaDTO> & {

}

export interface FiltroZonaDTO extends PaginacionDTO {
  nombre?: string
}