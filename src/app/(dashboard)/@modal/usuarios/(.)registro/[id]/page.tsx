import { OpenedModal } from "@/app/components/custom-modal"
import Page403 from "@/app/components/errors/403"
import { FormularioRegistroUsuario } from "@/app/components/usuarios/formulario-registro-usuario"
import { UsuarioDTO } from "@/lib/dto/usuario.dto"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { listarPermisosSelect } from "@/server/services/permiso.service"
import { obtenerUsuarioPorId } from "@/server/services/usuario.service"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{}>
}

export default async function RegistroUsuarioPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/usuarios')
  if (!tienePermiso) {
    return <Page403 />
  }

  const params = await props.params

  const usuarioDTO: UsuarioDTO | null = await obtenerUsuarioPorId(+params.id | 0)
  const permisos = await listarPermisosSelect()

  return (
    <OpenedModal title="Registro de usuarios">
      <FormularioRegistroUsuario
        permisos={permisos}
        usuario={usuarioDTO}
      />
    </OpenedModal>)
}