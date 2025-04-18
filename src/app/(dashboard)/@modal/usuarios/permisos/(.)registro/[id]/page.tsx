import { OpenedModal } from "@/app/components/custom-modal"
import Page403 from "@/app/components/errors/403"
import { FormularioRegistroPermiso } from "@/app/components/usuarios/permisos/formulario-registro-permiso"
import { SelectDTO } from "@/lib/dto/common.dto"
import { PermisoDTO } from "@/lib/dto/permiso.dto"
import { auth } from "@/server/auth/auth"
import { usuarioTienePermiso } from "@/server/auth/sesion.utils"
import { listarModulosSelect } from "@/server/services/modulo.service"
import { obtenerPermisoPorId } from "@/server/services/permiso.service"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{}>
}

export default async function RegistroPermisoPage(props: Props) {
  const session = await auth()

  // Validamos que el usuario tenga acceso a este módulo sino mostramos error
  const tienePermiso = await usuarioTienePermiso(+session?.user.id!, '/usuarios')
  if (!tienePermiso) {
    return <Page403 />
  }

  const params = await props.params

  const permisoDTO: PermisoDTO | null = await obtenerPermisoPorId(+params.id | 0)
  const listaModulos: SelectDTO[] = await listarModulosSelect()

  return (
    <OpenedModal title="Registro de permisos">
      <FormularioRegistroPermiso
        permiso={permisoDTO}
        modulos={listaModulos}
      />
    </OpenedModal>)
}