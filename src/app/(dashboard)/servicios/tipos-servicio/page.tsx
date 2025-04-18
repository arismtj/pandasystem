
import Page403 from "@/app/components/errors/403"
import { Paginacion } from "@/app/components/paginacion"
import FiltrosTipoServicio from "@/app/components/servicios/tipos-servicio/filtros-tipos-servicio"
import TablaTiposServicio from "@/app/components/servicios/tipos-servicio/tabla-tipos-servicio"
import { TableSkeleton } from "@/app/components/table-skeleton"
import { TABLA_PERMISOS_COLS } from "@/app/components/usuarios/permisos/tabla-permisos"
import { FiltroPermisoDTO } from "@/lib/dto/permiso.dto"
import { FiltroTipoServicioDTO } from "@/lib/dto/tiposervicio.dto"
import { simpleHash } from "@/lib/utils"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { contarTipoServiciosPorFiltro } from "@/server/services/tiposervicio.service"
import { Button, Flex } from "@mantine/core"
import Link from "next/link"
import { Suspense } from "react"


interface Props {
  searchParams?: Promise<FiltroPermisoDTO>
}

export default async function TiposServicioPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/servicios')
  if (!tienePermiso) {
    return <Page403 />
  }

  const searchParams = await props.searchParams

  const filtros: FiltroTipoServicioDTO = {
    nombre: searchParams?.nombre,
    page: searchParams?.page || 1,
    rowsPerPage: searchParams?.rowsPerPage
  }

  const key = simpleHash(searchParams)
  const datosTotales = await contarTipoServiciosPorFiltro(filtros)

  return <>
    <FiltrosTipoServicio>
      <Link href="/servicios/tipos-servicio/registro/nuevo">
        <Button>Nuevo</Button>
      </Link>

      <Link href="/servicios" style={{ marginLeft: 'auto' }}>
        <Button color="violet">Volver a servicios</Button>
      </Link>
    </FiltrosTipoServicio>
    <br />
    <Flex justify="center">
      <Suspense key={key} fallback={<TableSkeleton columns={TABLA_PERMISOS_COLS} />}>
        <TablaTiposServicio {...filtros} />
      </Suspense>
    </Flex>

    <br />

    <div className="w-full">
      <Paginacion datosTotales={datosTotales} />
    </div>
  </>
}