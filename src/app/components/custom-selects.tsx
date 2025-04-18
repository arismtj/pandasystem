'use client'
import { ESTADO_ACTIVO, ESTADO_INACTIVO, MAP_ESTADO_DEUDA, MAP_FRECUENCIA } from "@/lib/constantes"
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

  const data: SelectDTO[] = Object.entries(MAP_FRECUENCIA).map(([key, value]) => {
    return { label: value, value: key }
  })

  return <Select data={data} {...props} />
}

export function SelectEstadoDeuda(props: CustomSelect) {

  const data: SelectDTO[] = Object.entries(MAP_ESTADO_DEUDA).map(([key, value]) => {
    return { label: value, value: key }
  })

  return <Select data={data} {...props} />
}