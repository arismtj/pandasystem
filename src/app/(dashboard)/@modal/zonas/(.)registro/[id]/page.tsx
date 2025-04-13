import { OpenedModal } from "@/app/components/custom-modal"
import Page403 from "@/app/components/errors/403"
import { FormularioRegistroZona } from "@/app/components/zonas/formulario-registro-zona"
import { ZonaDTO } from "@/lib/dto/zona.dto"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { obtenerZonaPorId } from "@/server/services/zona.service"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{}>
}

export default async function RegistroZonaPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/zonas')
  if (!tienePermiso) {
    return <Page403 />
  }

  const params = await props.params

  const zonaDTO: ZonaDTO | null = await obtenerZonaPorId(+params.id | 0)

  return (
    <OpenedModal title="Registro de zonas">
      <FormularioRegistroZona
        zona={zonaDTO}
      />
    </OpenedModal>)
}