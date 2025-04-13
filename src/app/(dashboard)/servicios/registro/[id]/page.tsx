import Page403 from "@/app/components/errors/403"
import { FormularioRegistroServicio } from "@/app/components/servicios/formulario-registro-servicio"
import { ServicioDTO } from "@/lib/dto/servicio.dto"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { obtenerServicioPorId } from "@/server/services/servicio.service"
import { Container } from "@mantine/core"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{}>
}

export default async function RegistroServicioPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/servicios')
  if (!tienePermiso) {
    return <Page403 />
  }

  const params = await props.params

  const servicioDTO: ServicioDTO | null = await obtenerServicioPorId(+params.id | 0)

  return <Container>
    <FormularioRegistroServicio servicio={servicioDTO} />
  </Container>
}