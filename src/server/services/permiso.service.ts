import { DB } from "@/db/drizzle"
import { moduloTable, permisoModuloTable, permisoTable } from "@/db/schemas/permiso"
import { ESTADO_ACTIVO, ESTADO_INACTIVO } from "@/lib/constantes"
import { SelectDTO } from "@/lib/dto/common.dto"

import { FiltroPermisoDTO, PermisoDTO } from "@/lib/dto/permiso.dto"
import { and, count, eq, like, SQL } from "drizzle-orm"
import { User } from "next-auth"
import { registrarModulosPermisos } from "./modulo.service"


export async function listarPermisosSelect(soloActivos = false): Promise<SelectDTO[]> {
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

export async function obtenerPermisoPorId(idPermiso: number): Promise<PermisoDTO | null> {
  const permisosList = await DB.select().from(permisoTable).where(
    eq(permisoTable.id, idPermiso)
  ).limit(1)

  if (permisosList && permisosList.length > 0) {
    const permiso = permisosList[0]

    // Obtenemos todos los módulos a los que el permiso tiene acceso

    // Seleccionamos todos los módulos a los que el usuario tiene permiso
    const modulosList = await DB.select({ modulo: moduloTable })
      .from(permisoModuloTable)
      .leftJoin(moduloTable, eq(moduloTable.id, permisoModuloTable.idModulo))
      .where(
        eq(permisoModuloTable.idPermiso, permiso.id!)
      )

    const idsModulo = modulosList.map(item => item.modulo?.id!)

    return {
      id: permiso.id,
      nombre: permiso.nombre,
      estado: permiso.estado,
      idsModulo
    }
  }
  return null
}

function generarWhereFiltroPermisos(filtros: FiltroPermisoDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.nombre) where.push(like(permisoTable.nombre, '%' + filtros.nombre + '%'))

  return where
}


export async function contarPermisosPorFiltro(filtros: FiltroPermisoDTO): Promise<number> {
  const where = generarWhereFiltroPermisos(filtros)

  const data = await DB.select({
    total: count(permisoTable.id),
  }).from(permisoTable).where(and(...where))

  return data[0].total
}

export async function listarPermisosPorFiltro(filtros: FiltroPermisoDTO): Promise<PermisoDTO[]> {

  const where = generarWhereFiltroPermisos(filtros)

  const data = await DB.select({
    id: permisoTable.id,
    nombre: permisoTable.nombre,
    estado: permisoTable.estado,
  }).from(permisoTable)
    .where(and(...where))

  return data.map(item => {
    return { ...item, idsModulo: [] }
  })
}

export async function registrarPermiso(permisoDTO: PermisoDTO, authUser: User): Promise<PermisoDTO> {
  const { id, idsModulo, ...datosPermiso } = permisoDTO

  /** 
   * Si el campo id en permisoDTO tiene valor, entonces el permiso ya existe y
   * debemos hacer una actualizacion de datos
   */
  if (permisoDTO.id) {
    await DB.update(permisoTable).set({
      ...datosPermiso,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(permisoTable.id, id!))

    await registrarModulosPermisos(id!, idsModulo)
    return permisoDTO
  }

  // Si el campo id no tiene valor, entonces es un nuevo registro y se debe hacer un insert
  const entidad = await DB.insert(permisoTable).values({
    ...datosPermiso,
    usuarioCreacion: +authUser.id!
  })

  const idPermiso = +entidad[0].insertId
  await registrarModulosPermisos(idPermiso!, idsModulo)

  return { id: idPermiso, ...datosPermiso, idsModulo }
}

export async function anularPermiso(idPermiso: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(permisoTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(permisoTable.id, idPermiso))
}
