'use client'

import { Button, Flex, Grid, GridCol, TextInput } from "@mantine/core"
import { IconClearAll, IconSearch } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent } from "react"

interface Props {
  children?: React.ReactNode
}

export default function FiltrosTipoServicio({ children }: Props) {
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
    params.set('nombre', '')

    replace(`${pathname}?${params}`)
  }

  return <form onSubmit={filtrarBusqueda}>
    <Grid>
      <GridCol span={{ md: 4 }}>
        <TextInput
          defaultValue={searchParams.get('nombre')?.toString()}
          label="Nombre" name="nombre"
        />
      </GridCol>
    </Grid>
    <br />
    <Flex direction="row" gap="md">
      <Button leftSection={<IconSearch />} type="submit">
        Buscar
      </Button>

      <Button leftSection={<IconClearAll />} color="orange" onClick={limpiarFiltros}>
        Limpiar
      </Button>

      {children}
    </Flex>

  </form>
}