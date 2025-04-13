import { InferType, number, object, string } from "yup";
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, PRECIO_REGEX } from "../constantes";
import { PaginacionDTO } from "./common.dto";

export const DeudaSchemaDTO = object({
id: number(),  
fecha_creacion: string().max(50).required(CAMPO_REQUERIDO),
fecha_limite: string().max(30).required(CAMPO_REQUERIDO),
fecha_notificacion: string().max(100).required(CAMPO_REQUERIDO),
estado: string().length(1).default(ESTADO_ACTIVO),
monto:string().max(100).required(CAMPO_REQUERIDO),
ultimo_pago: string().max(100).required(CAMPO_REQUERIDO),


  idServicio: number().required(CAMPO_REQUERIDO),
});

export type DeudaDTO = InferType<typeof DeudaSchemaDTO> & {};

export interface FiltroDeudaDTO extends PaginacionDTO {
  fecha_creacion?: string;
  ultimo_pago?: string;
}
