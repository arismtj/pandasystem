import { DB } from "@/db/drizzle"
import { clienteTable } from "@/db/schemas/cliente"
import { servicioTable } from "@/db/schemas/servicios"
import { tiposervicioTable } from "@/db/schemas/tiposervicio"
import { ESTADO_ACTIVO, ESTADO_INACTIVO, FRECUENCIA_SERV_UNICO, SELECT_FRECUENCIA } from "@/lib/constantes"
import { FiltroServicioDTO, ServicioDTO } from "@/lib/dto/servicio.dto"
import { and, count, eq, sql, SQL } from "drizzle-orm"
import { User } from "next-auth"
import { obtenerTipoServicioPorId } from "./tiposervicio.service"
import { selectDtoArrayToMap } from "@/lib/utils"
import { registrarDeuda } from "./deuda.service"

export async function listarModulosServicio(idServicio: number) {

  const cliente = await DB.select().from(servicioTable).where(eq(servicioTable.id, idServicio))

  if (!cliente || cliente.length === 0) {
    return []
  }
}

export async function obtenerServicioPorId(idServicio: number): Promise<ServicioDTO | null> {
  const serviciosList = await DB.select({
    data: servicioTable,
    nombreCliente: sql<string>`concat(${clienteTable.nombres}, ' ', ${clienteTable.apellidos})`,
    nombreTipoServicio: tiposervicioTable.nombre,
  }).from(servicioTable).where(
    eq(servicioTable.id, idServicio)
  ).innerJoin(clienteTable, eq(clienteTable.id, servicioTable.idCliente))
    .innerJoin(tiposervicioTable, eq(tiposervicioTable.id, servicioTable.idTipoServicio))
    .limit(1)

  if (serviciosList && serviciosList.length > 0) {
    const servicio = serviciosList[0]
    return {
      id: servicio.data.id,
      fechaInicio: servicio.data.fechaInicio,
      fechaFin: servicio.data.fechaFin,
      estado: servicio.data.estado,
      unidad: servicio.data.unidad,
      precioUnidad: servicio.data.precioUnidad,
      ultimoPago: servicio.data.ultimoPago,
      ultimaDeuda: servicio.data.ultimaDeuda,
      estadoDeuda: servicio.data.estadoDeuda,
      numeroIp: servicio.data.numeroIp,

      idCliente: servicio.data.idCliente,
      idTipoServicio: servicio.data.idTipoServicio,
      nombreCliente: servicio.nombreCliente,
      nombreTipoServicio: servicio.nombreTipoServicio,
    }
  }
  return null
}

function generarWhereFiltroServicios(filtros: FiltroServicioDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
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
    id: servicioTable.id,
    fechaInicio: servicioTable.fechaInicio,
    fechaFin: servicioTable.fechaFin,
    estado: servicioTable.estado,
    unidad: servicioTable.unidad,
    precioUnidad: servicioTable.precioUnidad,
    ultimoPago: servicioTable.ultimoPago,
    ultimaDeuda: servicioTable.ultimaDeuda,
    estadoDeuda: servicioTable.estadoDeuda,
    numeroIp: servicioTable.numeroIp,

    idCliente: servicioTable.idCliente,
    idTipoServicio: servicioTable.idTipoServicio,

    nombreCliente: sql<string>`concat(${clienteTable.nombres}, ' ', ${clienteTable.apellidos})`,
    direccionCliente: clienteTable.direccion,
    nombreTipoServicio: tiposervicioTable.nombre,
    frecuenciaServicio: tiposervicioTable.frecuencia,
  }).from(servicioTable)
    .innerJoin(clienteTable, eq(clienteTable.id, servicioTable.idCliente))
    .innerJoin(tiposervicioTable, eq(tiposervicioTable.id, servicioTable.idTipoServicio))

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

  const response = { id: +entidad[0].insertId, ...datosServicio }

  const tipoServicio = await obtenerTipoServicioPorId(servicioDTO.idTipoServicio)

  if (tipoServicio?.frecuencia === FRECUENCIA_SERV_UNICO) {
    await registrarDeuda({
      idServicio: response.id,
      fechaLimite: new Date(),
      fechaNotificacion: new Date(),
      monto: servicioDTO.precioUnidad * servicioDTO.unidad,
      ultimoPago: '-',
      estado: ESTADO_ACTIVO,
    }, authUser)
  }

  return response
}

export async function anularServicio(idServicio: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(servicioTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(servicioTable.id, idServicio))
}
