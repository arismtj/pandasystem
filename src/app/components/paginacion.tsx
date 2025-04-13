'use client'

import { Group, Pagination, Select, Text } from "@mantine/core"
import { usePathname, useRouter, useSearchParams } from "next/navigation"


interface Props {
  datosTotales: number
}

// Destructuramos el objeto props para acceder directamente a los valores
export function Paginacion({ datosTotales }: Props) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 1
  const rowsPerPage = Number(searchParams.get('rowsPerPage')) || 20

  // Calculamos el total de páginas basado en los datos totales  el numero de filas
  const totalPages = datosTotales / rowsPerPage

  function onPageChange(value: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', value.toString())

    replace(`${pathname}?${params}`)
  }

  function onRowsPerPageChange(value: string | null) {
    const params = new URLSearchParams(searchParams)
    params.set('rowsPerPage', value || '20')

    replace(`${pathname}?${params}`)
  }

  return <Group justify="space-between">

    <Select w="70" size="xs"
      defaultValue={rowsPerPage + ''}
      data={['20', '30', '40', '50']}
      onChange={onRowsPerPageChange}
    />

    <Text size="sm" fw={500}>
      {datosTotales > rowsPerPage ? rowsPerPage : datosTotales}/{datosTotales}
    </Text>

    <Pagination
      total={totalPages}
      defaultValue={currentPage}
      disabled={totalPages <= 1} // Desactivamos el componente si hay menos de 2 páginas
      onChange={onPageChange}
    />
  </Group>

}