import { DB } from "@/db/drizzle"
import { zonaTable } from "@/db/schemas/zona"
import { ESTADO_ACTIVO, ESTADO_INACTIVO } from "@/lib/constantes"
import { SelectDTO } from "@/lib/dto/common.dto"
import { FiltroZonaDTO, ZonaDTO } from "@/lib/dto/zona.dto"
import { and, count, eq, like, SQL } from "drizzle-orm"
import { User } from "next-auth"

export async function obtenerZonaPorId(idZona: number): Promise<ZonaDTO | null> {
  const zonasList = await DB.select().from(zonaTable).where(
    eq(zonaTable.id, idZona)
  ).limit(1)

  if (zonasList && zonasList.length > 0) {
    const zona = zonasList[0]
    return {
      id: zona.id,
      nombre: zona.nombre,
      estado: zona.estado,
    }
  }
  return null
}

function generarWhereFiltroZonas(filtros: FiltroZonaDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.nombre) where.push(like(zonaTable.nombre, '%' + filtros.nombre + '%'))
  return where
}

export async function contarZonasPorFiltro(filtros: FiltroZonaDTO): Promise<number> {
  const where = generarWhereFiltroZonas(filtros)

  const data = await DB.select({
    total: count(zonaTable.id),
  }).from(zonaTable).where(and(...where))

  return data[0].total
}

export async function listarZonasPorFiltro(filtros: FiltroZonaDTO): Promise<ZonaDTO[]> {

  const where = generarWhereFiltroZonas(filtros)

  const data = await DB.select({
    id: zonaTable.id,
    nombre: zonaTable.nombre,
    estado: zonaTable.estado,
  }).from(zonaTable)
    .where(and(...where))

  return data
}

export async function listarZonasSelect(soloActivos = false): Promise<SelectDTO[]> {
  const zonasList = await DB.select({
    id: zonaTable.id,
    nombre: zonaTable.nombre,
    estado: zonaTable.estado,
  }).from(zonaTable).where(
    soloActivos ? eq(zonaTable.estado, ESTADO_ACTIVO) : undefined
  )

  return zonasList.map(item => {
    const selectDTO: SelectDTO = { value: item.id + '', label: item.nombre }

    if (item.estado === ESTADO_INACTIVO) selectDTO.disabled = true

    return selectDTO
  })
}

export async function registrarZona(zonaDTO: ZonaDTO, authUser: User): Promise<ZonaDTO> {
  const { id, ...datosZona } = zonaDTO

  /** 
   * Si el campo id en zonaDTO tiene valor, entonces la zona ya existe y
   * debemos hacer una actualizacion de datos
   */
  if (zonaDTO.id) {
    await DB.update(zonaTable).set({
      ...datosZona,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(zonaTable.id, id!))

    return zonaDTO
  }

  // Si el campo id no tiene valor, entonces es un nuevo registro y se debe hacer un insert
  const entidad = await DB.insert(zonaTable).values({
    ...datosZona,
    usuarioCreacion: +authUser.id!
  })

  return { id: +entidad[0].insertId, ...datosZona }
}

export async function anularZona(idZona: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(zonaTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(zonaTable.id, idZona))
}

