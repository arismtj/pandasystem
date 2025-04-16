import { InferType, number, object, string } from "yup"
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, IP_V4_REGEX, PRECIO_REGEX } from "../constantes"
import { PaginacionDTO } from "./common.dto"

export const ServicioSchemaDTO = object({
  id: number(),
  nombre: string().max(100).required(CAMPO_REQUERIDO),
  fechaInicio: string().max(100).required(CAMPO_REQUERIDO),
  fechaFin: string().max(100).required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),

  unidad: string().max(100).required(CAMPO_REQUERIDO),
  precioUnidad: string()
    .max(10)
    .matches(PRECIO_REGEX, "Debe ser un número válido con hasta 2 decimales")
    .required(CAMPO_REQUERIDO),
  ultimoPago: string().max(100).required(CAMPO_REQUERIDO),
  ultimaDeuda: string().max(100).required(CAMPO_REQUERIDO),
  estadoDeuda: string().max(100).required(CAMPO_REQUERIDO),
  numeroIp: string()
    .max(100)
    .matches(IP_V4_REGEX, "Debe ser una dirección IPv4 válida")
    .nullable(),

  idCliente: number().required(CAMPO_REQUERIDO),
  idTipoServicio: number().required(CAMPO_REQUERIDO),
})

export type ServicioDTO = InferType<typeof ServicioSchemaDTO> & {}

export interface FiltroServicioDTO extends PaginacionDTO {
  nombre?: string
  precio_unidad?: string
}
