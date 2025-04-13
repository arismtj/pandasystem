
import FiltrosCliente from "@/app/components/clientes/filtros-cliente"
import TablaClientes, { TABLA_CLIENTES_COLS } from "@/app/components/clientes/tabla-clientes"
import Page403 from "@/app/components/errors/403"
import { Paginacion } from "@/app/components/paginacion"
import { TableSkeleton } from "@/app/components/table-skeleton"
import { FiltroClienteDTO } from "@/lib/dto/cliente.dto"
import { simpleHash } from "@/lib/utils"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { contarClientesPorFiltro } from "@/server/services/cliente.service"
import { listarZonasSelect } from "@/server/services/zona.service"
import { Button, Flex } from "@mantine/core"
import Link from "next/link"
import { Suspense } from "react"


interface Props {
  searchParams?: Promise<FiltroClienteDTO>
}

export default async function ClientesPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/clientes')
  if (!tienePermiso) {
    return <Page403 />
  }

  const searchParams = await props.searchParams

  const filtros: FiltroClienteDTO = {
    nombres: searchParams?.nombres,
    apellidos: searchParams?.apellidos,
    idZona: searchParams?.idZona,
    page: searchParams?.page || 1,
    rowsPerPage: searchParams?.rowsPerPage
  }

  const key = simpleHash(searchParams)

  const datosTotales = await contarClientesPorFiltro(filtros)
  // aqui obtenemos todas las zonas que usaremos en el combobox del filtro de Zona
  const zonasSelect = await listarZonasSelect()

  return <>
    <FiltrosCliente zonas={zonasSelect}>
      <Link href="/clientes/registro/nuevo">
        <Button>Nuevo</Button>
      </Link>
    </FiltrosCliente>
    <br />
    <Flex>
      <Suspense key={key} fallback={<TableSkeleton columns={TABLA_CLIENTES_COLS} />}>
        <TablaClientes {...filtros} />
      </Suspense>
    </Flex>

    <br />

    <div className="w-full">
      <Paginacion datosTotales={datosTotales} />
    </div>
  </>
}