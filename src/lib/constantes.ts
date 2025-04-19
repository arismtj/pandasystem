import { SelectDTO } from "./dto/common.dto"

export const ESTADO_ACTIVO = 'A'
export const ESTADO_INACTIVO = 'I'

export const FRECUENCIA_SERV_UNICO = 'UN'
export const FRECUENCIA_SERV_DIARIO = 'DI'
export const FRECUENCIA_SERV_MENSUAL = 'ME'
export const FRECUENCIA_SERV_ANUAL = 'AN'

export const ESTADO_DEUDA_PENDIENTE = 'PE'
export const ESTADO_DEUDA_CANCELADA = 'CA'
export const ESTADO_DEUDA_VENCIDA = 'VE'

// Mensajes de validacion
export const CAMPO_REQUERIDO = 'Este campo es requerido'
export const NUMERO_INVALIDO = 'Debe ingresar un número válido'
export const FECHA_INVALIDA = 'Debe ingresar una fecha válida'
export const MONTO_INVALIDO = 'Debe ingresar un monto válido'
export const SELECT_MINIMO_UNO = 'Debe seleccionar al menos 1 valor'

// Expresiones regulares
export const COORDENADAS_REGEX = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((180(\.0+)?)|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
export const IP_V4_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const PRECIO_REGEX = /^\d+(\.\d{1,2})?$/
export const NUMERO_DNI_REGEX = /^\d{8}$/

// arreglos y estructuras
export const SELECT_FRECUENCIA: SelectDTO[] = [
  { value: FRECUENCIA_SERV_UNICO, label: 'Único' },
  { value: FRECUENCIA_SERV_DIARIO, label: 'Diario' },
  { value: FRECUENCIA_SERV_MENSUAL, label: 'Mensual' },
  { value: FRECUENCIA_SERV_ANUAL, label: 'Anual' },
]

export const SELECT_ESTADO_DEUDA: SelectDTO[] = [
  { value: ESTADO_DEUDA_PENDIENTE, label: 'Pendiente' },
  { value: ESTADO_DEUDA_CANCELADA, label: 'Cancelada' },
  { value: ESTADO_DEUDA_VENCIDA, label: 'Vencida' },
]