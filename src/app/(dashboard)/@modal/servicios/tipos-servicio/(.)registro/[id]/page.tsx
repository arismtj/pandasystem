import { OpenedModal } from "@/app/components/custom-modal"
import Page403 from "@/app/components/errors/403"
import { FormularioRegistroTipoServicio } from "@/app/components/servicios/tipos-servicio/formulario-registro-tipos-servicio"
import { TipoServicioDTO } from "@/lib/dto/tiposervicio.dto"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { obtenerTipoServicioPorId } from "@/server/services/tiposervicio.service"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{}>
}

export default async function RegistroTipoServicioPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/servicios')
  if (!tienePermiso) {
    return <Page403 />
  }

  const params = await props.params

  const tipoServicioDTO: TipoServicioDTO | null = await obtenerTipoServicioPorId(+params.id | 0)

  return (
    <OpenedModal title="Registro de tipos de servicio">
      <FormularioRegistroTipoServicio tipoServicio={tipoServicioDTO} />
    </OpenedModal>)
}