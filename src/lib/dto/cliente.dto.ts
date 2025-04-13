import { InferType, number, object, string } from "yup";
import {
  CAMPO_REQUERIDO,
  ESTADO_ACTIVO,
  COORDENADAS_REGEX,
  IP_V4_REGEX,
} from "../constantes";
import { PaginacionDTO } from "./common.dto";

export const ClienteSchemaDTO = object({
  id: number(),
  ip: string()
    .max(100)
    .matches(IP_V4_REGEX, "Debe ser una dirección IPv4 válida")
    .required(CAMPO_REQUERIDO),
  nombres: string().max(100).required(CAMPO_REQUERIDO),
  apellidos: string().max(100).required(CAMPO_REQUERIDO),
  numero_dni: string().max(8).required(CAMPO_REQUERIDO),
  numeroTelefono: string().max(50).nullable(),
  idZona: number().required(CAMPO_REQUERIDO),
  direccion: string().max(250).required(CAMPO_REQUERIDO),
  departamento: string().max(150).required(CAMPO_REQUERIDO),
  provincia: string().max(150).required(CAMPO_REQUERIDO),
  distrito: string().max(150).required(CAMPO_REQUERIDO),
  referencia: string().max(150).required(CAMPO_REQUERIDO),
  fachada: string().max(250).required(CAMPO_REQUERIDO),
  coordenadas: string()
    .max(20)
    .matches(
      COORDENADAS_REGEX,
      "Debe ser una coordenada válida en formato 'latitud,longitud'"
    )
    .required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),
});

export type ClienteDTO = InferType<typeof ClienteSchemaDTO> & {
  nombreZona?: string | null;
};

export interface FiltroClienteDTO extends PaginacionDTO {
  nombres?: string;
  apellidos?: string;
  idZona?: string | number;
}
