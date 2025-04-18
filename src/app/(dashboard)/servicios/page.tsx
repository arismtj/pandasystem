
import Page403 from "@/app/components/errors/403"
import { Paginacion } from "@/app/components/paginacion"
import FiltrosServicio from "@/app/components/servicios/filtros-servicio"
import TablaServicios, { TABLA_SERVICIOS_COLS } from "@/app/components/servicios/tabla-servicios"
import { TableSkeleton } from "@/app/components/table-skeleton"
import { FiltroServicioDTO } from "@/lib/dto/servicio.dto"
import { simpleHash } from "@/lib/utils"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { contarServiciosPorFiltro } from "@/server/services/servicio.service"
import { Button, Flex } from "@mantine/core"
import Link from "next/link"
import { Suspense } from "react"


interface Props {
  searchParams?: Promise<FiltroServicioDTO>
}

export default async function ServiciosPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/servicios')
  if (!tienePermiso) {
    return <Page403 />
  }

  const searchParams = await props.searchParams

  const filtros: FiltroServicioDTO = {
    nombre: searchParams?.nombre,
    page: searchParams?.page || 1,
    rowsPerPage: searchParams?.rowsPerPage
  }

  const key = simpleHash(searchParams)

  const datosTotales = await contarServiciosPorFiltro(filtros)

  return <>
    <FiltrosServicio>
      <Link href="/servicios/registro/nuevo">
        <Button>Nuevo</Button>
      </Link>

      <Link href="/servicios/tipos-servicio" style={{ marginLeft: 'auto' }}>
        <Button color="violet">Tipos de servicio</Button>
      </Link>
    </FiltrosServicio>
    <br />
    <Flex justify='center'>
      <Suspense key={key} fallback={<TableSkeleton columns={TABLA_SERVICIOS_COLS} />}>
        <TablaServicios {...filtros} />
      </Suspense>
    </Flex>

    <br />

    <div className="w-full">
      <Paginacion datosTotales={datosTotales} />
    </div>
  </>
}