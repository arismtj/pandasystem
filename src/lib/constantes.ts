export const ESTADO_ACTIVO = 'A'
export const ESTADO_INACTIVO = 'I'

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
export const MAP_FRECUENCIA = {
  UN: 'Único',
  DI: 'Diario',
  ME: 'Mensual',
  AN: 'Anual',
}

export const MAP_ESTADO_DEUDA = {
  PE: 'Pendiente',
  CA: 'Cancelada',
  VE: 'Vencida',
}