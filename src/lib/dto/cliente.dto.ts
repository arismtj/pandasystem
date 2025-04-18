import { InferType, number, object, string } from "yup"
import {
  CAMPO_REQUERIDO,
  COORDENADAS_REGEX,
  ESTADO_ACTIVO,
  NUMERO_DNI_REGEX
} from "../constantes"
import { PaginacionDTO } from "./common.dto"

export const ClienteSchemaDTO = object({
  id: number(),
  nombres: string().max(100).required(CAMPO_REQUERIDO),
  apellidos: string().max(100).required(CAMPO_REQUERIDO),
  dni: string().max(8).matches(NUMERO_DNI_REGEX, 'Debe ingresar un número de DNI válido').required(CAMPO_REQUERIDO),
  celular: string().max(50).nullable(),
  idZona: number().required(CAMPO_REQUERIDO),
  direccion: string().max(250).required(CAMPO_REQUERIDO),
  departamento: string().max(150).required(CAMPO_REQUERIDO),
  provincia: string().max(150).required(CAMPO_REQUERIDO),
  distrito: string().max(150).required(CAMPO_REQUERIDO),
  referencia: string().max(150).nullable(),
  fachada: string().max(250).required(CAMPO_REQUERIDO),
  coordenadas: string()
    .max(100)
    .matches(COORDENADAS_REGEX, "Debe ser una coordenada válida en formato 'latitud,longitud'")
    .required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),
})

export type ClienteDTO = InferType<typeof ClienteSchemaDTO> & {
  nombreZona?: string | null
}

export interface FiltroClienteDTO extends PaginacionDTO {
  nombres?: string
  apellidos?: string
  idZona?: string | number
}
