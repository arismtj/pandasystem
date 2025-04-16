import { FormularioRegistroCliente } from "@/app/components/clientes/formulario-registro-cliente"
import { OpenedModal } from "@/app/components/custom-modal"
import Page403 from "@/app/components/errors/403"
import { ClienteDTO } from "@/lib/dto/cliente.dto"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { obtenerClientePorId } from "@/server/services/cliente.service"
import { listarPermisosSelect } from "@/server/services/permiso.service"
import { listarZonasSelect } from "@/server/services/zona.service"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{}>
}

export default async function RegistroClientePage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/clientes')
  if (!tienePermiso) {
    return <Page403 />
  }

  const params = await props.params

  const clienteDTO: ClienteDTO | null = await obtenerClientePorId(+params.id | 0)

  // aqui obtenemos todas las zonas que usaremos en el combobox del formulario para el campo Zona
  const zonasSelect = await listarZonasSelect()

  return (
    <OpenedModal title="Registro de clientes" size="xl">
      <FormularioRegistroCliente
        zonas={zonasSelect}
        cliente={clienteDTO}
      />
    </OpenedModal>)
}