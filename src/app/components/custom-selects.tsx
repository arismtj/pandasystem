'use client'
import { ESTADO_ACTIVO, ESTADO_INACTIVO } from "@/lib/constantes"
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