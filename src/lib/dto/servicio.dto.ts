import { date, InferType, number, object, string } from "yup"
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, FECHA_INVALIDA, IP_V4_REGEX, MONTO_INVALIDO, NUMERO_INVALIDO } from "../constantes"
import { PaginacionDTO } from "./common.dto"

export const ServicioSchemaDTO = object({
  id: number(),
  fechaInicio: date().typeError(FECHA_INVALIDA).required(CAMPO_REQUERIDO),
  fechaFin: date().typeError(FECHA_INVALIDA).nullable(),
  unidad: number().typeError(NUMERO_INVALIDO).required(CAMPO_REQUERIDO).positive().integer(),
  precioUnidad: number().typeError(MONTO_INVALIDO).required(CAMPO_REQUERIDO).positive(),
  ultimoPago: date().typeError(FECHA_INVALIDA).nullable(),
  ultimaDeuda: date().typeError(FECHA_INVALIDA).nullable(),
  estadoDeuda: string().max(100).default('PE').required(CAMPO_REQUERIDO),
  numeroIp: string()
    .max(100)
    .matches(IP_V4_REGEX, { excludeEmptyString: true, message: "Debe ser una dirección IPv4 válida" })
    .nullable(),

  idCliente: number().required(CAMPO_REQUERIDO),
  idTipoServicio: number().required(CAMPO_REQUERIDO),

  estado: string().length(1).default(ESTADO_ACTIVO),
})

export type ServicioDTO = InferType<typeof ServicioSchemaDTO> & {
  nombreCliente?: string
  direccionCliente?: string
  nombreTipoServicio?: string
  frecuenciaServicio?: string
}

export interface FiltroServicioDTO extends PaginacionDTO {
  nombre?: string
  precioUnidad?: string
}
