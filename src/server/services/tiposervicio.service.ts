import { DB } from "@/db/drizzle"
import { servicioTable } from "@/db/schemas/servicios"
import { tiposervicioTable } from "@/db/schemas/tiposervicio"
import { ESTADO_INACTIVO } from "@/lib/constantes"
import { FiltroTipoServicioDTO, TipoServicioDTO } from "@/lib/dto/tiposervicio.dto"
import { and, count, eq, SQL } from "drizzle-orm"
import { User } from "next-auth"


export async function listarModulosTipoServicio(idTipoServicio: number) {

  const cliente = await DB.select().from(tiposervicioTable).where(eq(tiposervicioTable.id, idTipoServicio))

  if (!cliente || cliente.length === 0) {
    return []
  }
}

export async function obtenerTipoServicioPorId(idTipoServicio: number): Promise<TipoServicioDTO | null> {
  const tiposerviciosList = await DB.select().from(tiposervicioTable).where(
    eq(tiposervicioTable.id, idTipoServicio)
  ).limit(1)

  if (tiposerviciosList && tiposerviciosList.length > 0) {
    const tiposervicio = tiposerviciosList[0]
    return {
      id: tiposervicio.id,
      nombre: tiposervicio.nombre,
      estado: tiposervicio.estado,
      frecuencia: tiposervicio.frecuencia,
      precioUnitario: tiposervicio.precioUnitario,
      idCliente: tiposervicio.idCliente,
    }
  }
  return null
}

function generarWhereFiltroTipoServicios(filtros: FiltroTipoServicioDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.nombre) where.push(eq(tiposervicioTable.nombre, filtros.nombre))
  if (filtros.precioUnitario) where.push(eq(tiposervicioTable.precioUnitario, filtros.precioUnitario))
  return where
}


export async function contarTipoServiciosPorFiltro(filtros: FiltroTipoServicioDTO): Promise<number> {
  const where = generarWhereFiltroTipoServicios(filtros)

  const data = await DB.select({
    total: count(tiposervicioTable.id),
  }).from(tiposervicioTable).where(and(...where))

  return data[0].total
}

export async function listarTipoServiciosPorFiltro(filtros: FiltroTipoServicioDTO): Promise<TipoServicioDTO[]> {

  const where = generarWhereFiltroTipoServicios(filtros)

  const data = await DB.select({
    id: tiposervicioTable.id,
    nombre: tiposervicioTable.nombre,
    estado: tiposervicioTable.estado,
    frecuencia: tiposervicioTable.frecuencia,
    precioUnitario: tiposervicioTable.precioUnitario,
    idCliente: tiposervicioTable.idCliente,

  }).from(tiposervicioTable)
  return data
}

export async function registrarTipoServicio(tiposervicioDTO: TipoServicioDTO, authUser: User): Promise<TipoServicioDTO> {
  const { id, ...datosTipoServicio } = tiposervicioDTO

  if (tiposervicioDTO.id) {
    await DB.update(tiposervicioTable).set({
      ...datosTipoServicio,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(servicioTable.id, id!))

    return tiposervicioDTO
  }

  // Si el campo id no tiene valor, entonces es un nuevo registro y se debe hacer un insert
  const entidad = await DB.insert(tiposervicioTable).values({
    ...datosTipoServicio,
    usuarioCreacion: +authUser.id!
  })

  return { id: +entidad[0].insertId, ...datosTipoServicio }
}

export async function anularTipoServicio(idTipoServicio: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(tiposervicioTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(tiposervicioTable.id, idTipoServicio))
}
