import FiltrosDeudas from "@/app/components/deudas/filtros-deuda"
import TablaDeudas, { TABLA_DEUDAS_COLS } from "@/app/components/deudas/tabla-deudas"
import Page403 from "@/app/components/errors/403"
import { Paginacion } from "@/app/components/paginacion"
import { TableSkeleton } from "@/app/components/table-skeleton"
import { FiltroDeudaDTO } from "@/lib/dto/deuda.dto"
import { simpleHash } from "@/lib/utils"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { contarDeudasPorFiltro } from "@/server/services/deuda.service"
import { Flex } from "@mantine/core"
import { Suspense } from "react"

interface Props {
  searchParams?: Promise<FiltroDeudaDTO>
}

export default async function DeudaPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/pagos')
  if (!tienePermiso) {
    return <Page403 />
  }

  const searchParams = await props.searchParams

  const filtros: FiltroDeudaDTO = {
    page: searchParams?.page || 1,
    rowsPerPage: searchParams?.rowsPerPage
  }

  const key = simpleHash(searchParams)

  const datosTotales = await contarDeudasPorFiltro(filtros)

  return <>
    <FiltrosDeudas />
    <br />
    <Flex justify='center'>
      <Suspense key={key} fallback={<TableSkeleton columns={TABLA_DEUDAS_COLS} />}>
        <TablaDeudas {...filtros} />
      </Suspense>
    </Flex>

    <br />

    <div className="w-full">
      <Paginacion datosTotales={datosTotales} />
    </div>
  </>
}