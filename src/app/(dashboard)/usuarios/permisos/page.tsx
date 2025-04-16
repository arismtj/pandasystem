
import Page403 from "@/app/components/errors/403"
import { Paginacion } from "@/app/components/paginacion"
import { TableSkeleton } from "@/app/components/table-skeleton"
import FiltrosPermiso from "@/app/components/usuarios/permisos/filtros-permiso"
import TablaPermisos, { TABLA_PERMISOS_COLS } from "@/app/components/usuarios/permisos/tabla-permisos"
import { FiltroPermisoDTO } from "@/lib/dto/permiso.dto"
import { simpleHash } from "@/lib/utils"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { contarPermisosPorFiltro } from "@/server/services/permiso.service"
import { Button, Flex } from "@mantine/core"
import Link from "next/link"
import { Suspense } from "react"


interface Props {
  searchParams?: Promise<FiltroPermisoDTO>
}

export default async function PermisosPage(props: Props) {
  const session = await auth()
  
    // Validamos que el usuario tenga acceso a este módulo sino mostramos error
    const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/usuarios')
    if (!tienePermiso) {
      return <Page403 />
    }

  const searchParams = await props.searchParams

  const filtros: FiltroPermisoDTO = {
    nombre: searchParams?.nombre,
    idModulo: searchParams?.idModulo,
    page: searchParams?.page || 1,
    rowsPerPage: searchParams?.rowsPerPage
  }

  const key = simpleHash(searchParams)

  const datosTotales = await contarPermisosPorFiltro(filtros)

  return <>
    <FiltrosPermiso>
      <Link href="/usuarios/permisos/registro/nuevo">
        <Button>Nuevo</Button>
      </Link>
    </FiltrosPermiso>
    <br />
    <Flex justify="center">
      <Suspense key={key} fallback={<TableSkeleton columns={TABLA_PERMISOS_COLS} />}>
        <TablaPermisos {...filtros} />
      </Suspense>
    </Flex>

    <br />

    <div className="w-full">
      <Paginacion datosTotales={datosTotales} />
    </div>
  </>
}