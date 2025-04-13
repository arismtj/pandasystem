import { InferType, number, object, string } from "yup";
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, PRECIO_REGEX } from "../constantes";
import { PaginacionDTO } from "./common.dto";

export const comprobanteSchemaDTO = object({
id: number(),  
idPago: number().required(CAMPO_REQUERIDO),
numero_identificacion: string().max(30).required(CAMPO_REQUERIDO),
igv: string().max(100).required(CAMPO_REQUERIDO),
tipo_comprobante:string().max(100).required(CAMPO_REQUERIDO),
fecha_emision: string().max(100).required(CAMPO_REQUERIDO),
 estado: string().length(1).default(ESTADO_ACTIVO),

});

export type ComprobanteDTO = InferType<typeof comprobanteSchemaDTO> & {};

export interface FiltroComprobanteDTO extends PaginacionDTO {
  numero_identificacion?: string;
  tipo_comprobante?: string;
}
