'use client'
import { ESTADO_ACTIVO, ESTADO_INACTIVO, SELECT_ESTADO_DEUDA, SELECT_FRECUENCIA } from "@/lib/constantes"
import { SelectDTO } from "@/lib/dto/common.dto"
import { Select, SelectProps } from "@mantine/core"

interface CustomSelect extends Omit<SelectProps, 'data'> {

}

export function SelectActivoInactivo(props: CustomSelect) {
  const data: SelectDTO[] = [
    { label: 'Activo', value: ESTADO_ACTIVO },
    { label: 'Inactivo', value: ESTADO_INACTIVO },
  ]
  return <Select data={data} {...props} />
}

export function SelectFrecuencia(props: CustomSelect) {

  return <Select data={SELECT_FRECUENCIA} {...props} />
}

export function SelectEstadoDeuda(props: CustomSelect) {
  return <Select data={SELECT_ESTADO_DEUDA} {...props} />
}