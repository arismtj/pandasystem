import { InferType, number, object, string } from "yup";
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, PRECIO_REGEX } from "../constantes";
import { PaginacionDTO } from "./common.dto";

export const ServicioSchemaDTO = object({
  id: number(),
  nombre: string().max(100).required(CAMPO_REQUERIDO),
  fecha_inicio: string().max(100).required(CAMPO_REQUERIDO),
  fecha_fin: string().max(100).required(CAMPO_REQUERIDO),
  estado: string().length(1).default(ESTADO_ACTIVO),
  unidad: string().max(100).required(CAMPO_REQUERIDO),
  precio_unidad: string()
  .max(10)
  .matches(PRECIO_REGEX, "Debe ser un número válido con hasta 2 decimales")
  .required(CAMPO_REQUERIDO),
  ultimo_pago: string().max(100).required(CAMPO_REQUERIDO),
  ultimo_deuda: string().max(100).required(CAMPO_REQUERIDO),
  estado_deuda: string().max(100).required(CAMPO_REQUERIDO),
  

  idCliente: number().required(CAMPO_REQUERIDO),
  idTipoServicio: number().required(CAMPO_REQUERIDO),
});

export type ServicioDTO = InferType<typeof ServicioSchemaDTO> & {};

export interface FiltroServicioDTO extends PaginacionDTO {
  nombre?: string;
  precio_unidad?: string;
}
