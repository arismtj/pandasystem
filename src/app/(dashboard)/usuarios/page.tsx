
import Page403 from "@/app/components/errors/403"
import { Paginacion } from "@/app/components/paginacion"
import { TableSkeleton } from "@/app/components/table-skeleton"
import FiltrosUsuario from "@/app/components/usuarios/filtros-usuario"
import TablaUsuarios, { TABLA_USUARIOS_COLS } from "@/app/components/usuarios/tabla-usuarios"
import { FiltroUsuarioDTO } from "@/lib/dto/usuario.dto"
import { simpleHash } from "@/lib/utils"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { contarUsuariosPorFiltro } from "@/server/services/usuario.service"
import { Button, Flex } from "@mantine/core"
import Link from "next/link"
import { Suspense } from "react"


interface Props {
  searchParams?: Promise<FiltroUsuarioDTO>
}

export default async function UsuariosPage(props: Props) {
  const session = await auth()
  
    // Validamos que el usuario tenga acceso a este módulo sino mostramos error
    const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/usuarios')
    if (!tienePermiso) {
      return <Page403 />
    }

  const searchParams = await props.searchParams

  const filtros: FiltroUsuarioDTO = {
    username: searchParams?.username,
    nombres: searchParams?.nombres,
    apellidos: searchParams?.apellidos,
    page: searchParams?.page || 1,
    rowsPerPage: searchParams?.rowsPerPage
  }

  const key = simpleHash(searchParams)

  const datosTotales = await contarUsuariosPorFiltro(filtros)

  return <>
    <FiltrosUsuario>
      <Link href="/usuarios/registro/nuevo">
        <Button>Nuevo</Button>
      </Link>
    </FiltrosUsuario>
    <br />
    <Flex>
      <Suspense key={key} fallback={<TableSkeleton columns={TABLA_USUARIOS_COLS} />}>
        <TablaUsuarios {...filtros} />
      </Suspense>
    </Flex>

    <br />

    <div className="w-full">
      <Paginacion datosTotales={datosTotales} />
    </div>
  </>
}