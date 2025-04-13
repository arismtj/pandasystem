import { DB } from "@/db/drizzle"
import { permisoTable } from "@/db/schemas/permiso"
import { ESTADO_ACTIVO, ESTADO_INACTIVO } from "@/lib/constantes"
import { SelectDTO } from "@/lib/dto/common.dto"
import { eq } from "drizzle-orm"


export async function listarPermisosSelect(soloActivos = true): Promise<SelectDTO[]> {
  const permisosList = await DB.select({
    id: permisoTable.id,
    nombre: permisoTable.nombre,
    estado: permisoTable.estado,
  }).from(permisoTable).where(
    soloActivos ? eq(permisoTable.estado, ESTADO_ACTIVO) : undefined
  )

  return permisosList.map(item => {
    const selectDTO: SelectDTO = { value: item.id + '', label: item.nombre }

    if (item.estado === ESTADO_INACTIVO) selectDTO.disabled = true

    return selectDTO
  })
}