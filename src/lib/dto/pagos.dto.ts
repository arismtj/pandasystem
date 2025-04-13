import { InferType, number, object, string } from "yup";
import { CAMPO_REQUERIDO, ESTADO_ACTIVO, PRECIO_REGEX } from "../constantes";
import { PaginacionDTO } from "./common.dto";

export const PagoSchemaDTO = object({
id: number(),  
 fecha_pago: string().max(50).required(CAMPO_REQUERIDO),
 monto: string().max(30).required(CAMPO_REQUERIDO),
 forma_pago: string().max(100).required(CAMPO_REQUERIDO),
 estado: string().length(1).default(ESTADO_ACTIVO),

  idServicio: number().required(CAMPO_REQUERIDO),
  idDeuda: number().required(CAMPO_REQUERIDO),
});

export type PagoDTO = InferType<typeof PagoSchemaDTO> & {};

export interface FiltroPagoDTO extends PaginacionDTO {
  fecha_pago?: string;
  forma_pago?: string;
}
