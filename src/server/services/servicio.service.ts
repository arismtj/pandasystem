import { DB } from "@/db/drizzle"
import { servicioTable } from "@/db/schemas/servicios"
import { ESTADO_INACTIVO } from "@/lib/constantes"
import { FiltroServicioDTO, ServicioDTO } from "@/lib/dto/servicio.dto"
import { and, count, eq, SQL } from "drizzle-orm"
import { User } from "next-auth"


export async function listarModulosServicio(idServicio: number) {

  const cliente = await DB.select().from(servicioTable).where(eq(servicioTable.id, idServicio))

  if (!cliente || cliente.length === 0) {
    return []
  }
}

export async function obtenerServicioPorId(idServicio: number): Promise<ServicioDTO | null> {
  const serviciosList = await DB.select().from(servicioTable).where(
    eq(servicioTable.id, idServicio)
  ).limit(1)

  if (serviciosList && serviciosList.length > 0) {
    const servicio = serviciosList[0]
    return {
    id:servicio.id ,
    nombre: servicio.nombre ,   
    fecha_inicio:servicio.fecha_inicio ,
    fecha_fin:servicio.fecha_fin,
    estado: servicio.estado ,
    unidad:servicio.unidad,
    precio_unidad:servicio.precio_unidad ,
    ultimo_pago: servicio.ultimo_pago ,
    ultimo_deuda: servicio.ultimo_deuda ,
    estado_deuda: servicio.estado_deuda ,    
    idCliente: servicio.idCliente,
    idTipoServicio:servicio.idTipoServicio,
    }
  }
  return null
}

function generarWhereFiltroServicios(filtros: FiltroServicioDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.nombre) where.push(eq(servicioTable.nombre, filtros.nombre))
  if (filtros.precio_unidad) where.push(eq(servicioTable.precio_unidad, filtros.precio_unidad))
  return where
}


export async function contarServiciosPorFiltro(filtros: FiltroServicioDTO): Promise<number> {
  const where = generarWhereFiltroServicios(filtros)

  const data = await DB.select({
    total: count(servicioTable.id),
  }).from(servicioTable).where(and(...where))

  return data[0].total
}

export async function listarServiciosPorFiltro(filtros: FiltroServicioDTO): Promise<ServicioDTO[]> {

  const where = generarWhereFiltroServicios(filtros)

  const data = await DB.select({
    id:servicioTable.id ,
    nombre: servicioTable.nombre ,   
    fecha_inicio:servicioTable.fecha_inicio ,
    fecha_fin:servicioTable.fecha_fin,
    estado: servicioTable.estado ,
    unidad:servicioTable.unidad,
    precio_unidad:servicioTable.precio_unidad ,
    ultimo_pago: servicioTable.ultimo_pago ,
    ultimo_deuda: servicioTable.ultimo_deuda ,
    estado_deuda: servicioTable.estado_deuda ,    
    idCliente: servicioTable.idCliente,
    idTipoServicio:servicioTable.idTipoServicio,
  }).from(servicioTable)
  return data
}

export async function registrarServicio(servicioDTO: ServicioDTO, authUser: User): Promise<ServicioDTO> {
  const { id, ...datosServicio } = servicioDTO

  if (servicioDTO.id) {
    await DB.update(servicioTable).set({
      ...datosServicio,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(servicioTable.id, id!))

    return servicioDTO
  }

  // Si el campo id no tiene valor, entonces es un nuevo registro y se debe hacer un insert
  const entidad = await DB.insert(servicioTable).values({
    ...datosServicio,
    usuarioCreacion: +authUser.id!
  })

  return { id: +entidad[0].insertId, ...datosServicio }
}

export async function anularServicio(idServicio: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(servicioTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(servicioTable.id, idServicio))
}
