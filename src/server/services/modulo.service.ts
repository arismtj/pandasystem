import { DB } from "@/db/drizzle"
import { moduloTable, permisoModuloTable } from "@/db/schemas/permiso"
import { SelectDTO } from "@/lib/dto/common.dto"
import { eq } from "drizzle-orm"

export async function listarModulosSelect(): Promise<SelectDTO[]> {
  const modulosList = await DB.select({
    id: moduloTable.id,
    nombre: moduloTable.nombre,
  }).from(moduloTable)

  return modulosList.map(item => {
    const selectDTO: SelectDTO = { value: item.id + '', label: item.nombre }

    return selectDTO
  })
}

export async function registrarModulosPermisos(idPermiso: number, idsModulo: number[]) {
  // Primero eliminamos los modulos relacionados al permiso
  await DB.delete(permisoModuloTable).where(eq(permisoModuloTable.idPermiso, idPermiso))

  // Luego insertamos "nuevos" modulos que tendrá el permiso
  await DB.insert(permisoModuloTable).values(idsModulo.map(item => {
    return { idPermiso, idModulo: item }
  }))

}