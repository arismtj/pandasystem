'use client'

import { SelectDTO } from "@/lib/dto/common.dto"
import { Button, Select, TextInput } from "@mantine/core"
import { IconClearAll, IconSearch } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent } from "react"

interface Props {
  children?: React.ReactNode
  zonas: SelectDTO[]
}

export default function FiltrosCliente({ children, zonas }: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  function filtrarBusqueda(event: FormEvent) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget as any)
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')

    for (const [key, value] of formData.entries()) {
      if (value) {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    }

    replace(`${pathname}?${params}`)
  }

  function limpiarFiltros() {
    const params = new URLSearchParams(searchParams)
    params.set('nombres', '')
    params.set('apellidos', '')
    params.set('idZona', '')

    replace(`${pathname}?${params}`)
  }

  return <form onSubmit={filtrarBusqueda}>
    <div className="flex flex-row gap-2 flex-wrap">

      <TextInput
        className="w-full md:w-[30%]"
        defaultValue={searchParams.get('nombres')?.toString()}
        label="Nombres" name="nombres"
      />
      <TextInput
        className="w-full md:w-[30%]"
        defaultValue={searchParams.get('apellidos')?.toString()}
        label="Apellidos" name="apellidos"
      />
      <Select
        allowDeselect
        data={zonas}
        label="Zona"
        className="w-full md:w-[30%]"
        defaultValue={searchParams.get('idZona')?.toString()}
        name="idZona"
      />

    </div>
    <br />
    <div className="flex flex-row gap-2">
      <Button leftSection={<IconSearch />} type="submit">
        Buscar
      </Button>

      <Button leftSection={<IconClearAll />} color="orange" onClick={limpiarFiltros}>
        Limpiar
      </Button>

      {children}
    </div>
  </form>
}