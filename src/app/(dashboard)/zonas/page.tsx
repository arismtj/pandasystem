
import Page403 from "@/app/components/errors/403"
import { Paginacion } from "@/app/components/paginacion"
import { TableSkeleton } from "@/app/components/table-skeleton"
import FiltrosZona from "@/app/components/zonas/filtros-zona"
import TablaZonas, { TABLA_ZONAS_COLS } from "@/app/components/zonas/tabla-zonas"
import { FiltroZonaDTO } from "@/lib/dto/zona.dto"
import { simpleHash } from "@/lib/utils"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { contarZonasPorFiltro } from "@/server/services/zona.service"
import { Button, Flex } from "@mantine/core"
import Link from "next/link"
import { Suspense } from "react"


interface Props {
  searchParams?: Promise<FiltroZonaDTO>
}

export default async function ZonasPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/zonas')
  if (!tienePermiso) {
    return <Page403 />
  }

  const searchParams = await props.searchParams

  const filtros: FiltroZonaDTO = {
    nombre: searchParams?.nombre,
    page: searchParams?.page || 1,
    rowsPerPage: searchParams?.rowsPerPage
  }

  const key = simpleHash(searchParams)

  const datosTotales = await contarZonasPorFiltro(filtros)

  return <>
    <FiltrosZona>
      <Link href="/zonas/registro/nuevo">
        <Button>Nuevo</Button>
      </Link>
    </FiltrosZona>
    <br />
    <Flex justify="center">
      <Suspense key={key} fallback={<TableSkeleton columns={TABLA_ZONAS_COLS} />}>
        <TablaZonas {...filtros} />
      </Suspense>
    </Flex>

    <br />

    <div className="w-full">
      <Paginacion datosTotales={datosTotales} />
    </div>
  </>
}