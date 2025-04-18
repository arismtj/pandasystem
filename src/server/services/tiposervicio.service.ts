import { DB } from "@/db/drizzle"
import { servicioTable } from "@/db/schemas/servicios"
import { tiposervicioTable } from "@/db/schemas/tiposervicio"
import { ESTADO_ACTIVO, ESTADO_INACTIVO } from "@/lib/constantes"
import { SelectDTO2 } from "@/lib/dto/common.dto"
import { FiltroTipoServicioDTO, TipoServicioDTO } from "@/lib/dto/tiposervicio.dto"
import { and, count, eq, like, ne, SQL } from "drizzle-orm"
import { User } from "next-auth"


interface ClienteSelectOpts {
  excluirId?: number | string
  soloActivos?: boolean
}
export async function listarTiposServicioSelect(filtro: string, { excluirId, soloActivos = false }: ClienteSelectOpts): Promise<SelectDTO2[]> {
  const where: SQL[] = [
    like(tiposervicioTable.nombre, `%${filtro}%`)
  ]

  if (excluirId) {
    where.push(ne(tiposervicioTable.id, +excluirId))
  }
  if (soloActivos === true) {
    where.push(eq(tiposervicioTable.estado, ESTADO_ACTIVO))
  }
  3
  const tiposServicioList = await DB.select({
    id: tiposervicioTable.id,
    nombre: tiposervicioTable.nombre,
    estado: tiposervicioTable.estado,
    precioUnitario: tiposervicioTable.precioUnitario
  }).from(tiposervicioTable).where(and(...where)).limit(40)

  if (tiposServicioList.length === 0) {
    return []
  }

  return tiposServicioList.map(item => {
    return {
      value: item.id + '',
      label: item.nombre,
      disabled: item.estado !== ESTADO_ACTIVO,
      extras: item.precioUnitario
    } as SelectDTO2
  })
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
      frecuencia: tiposervicio.frecuencia,
      precioUnitario: tiposervicio.precioUnitario,
      estado: tiposervicio.estado,
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
    frecuencia: tiposervicioTable.frecuencia,
    precioUnitario: tiposervicioTable.precioUnitario,
    estado: tiposervicioTable.estado,
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
