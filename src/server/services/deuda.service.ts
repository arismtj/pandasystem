import { DB } from "@/db/drizzle"
import { clienteTable } from "@/db/schemas/cliente"
import { deudaTable } from "@/db/schemas/deuda"
import { servicioTable } from "@/db/schemas/servicios"
import { tiposervicioTable } from "@/db/schemas/tiposervicio"
import { ESTADO_INACTIVO } from "@/lib/constantes"
import { DeudaDTO, FiltroDeudaDTO } from "@/lib/dto/deuda.dto"
import { and, count, eq, sql, SQL } from "drizzle-orm"
import { User } from "next-auth"


export async function listarModulosDeuda(idDeuda: number) {

  const cliente = await DB.select().from(deudaTable).where(eq(deudaTable.id, idDeuda))

  if (!cliente || cliente.length === 0) {
    return []
  }
}

export async function obtenerDeudaPorId(idDeuda: number): Promise<DeudaDTO | null> {
  const deudasList = await DB.select().from(deudaTable).where(
    eq(deudaTable.id, idDeuda)
  ).limit(1)

  if (deudasList && deudasList.length > 0) {
    const deuda = deudasList[0]
    return {
      id: deuda.id,
      fechaCreacion: deuda.fechaCreacion,
      fechaLimite: deuda.fechaLimite,
      fechaNotificacion: deuda.fechaNotificacion,
      estado: deuda.estado,
      monto: deuda.monto,
      ultimoPago: deuda.ultimoPago,

      idServicio: deuda.idServicio,
    }
  }
  return null
}

function generarWhereFiltroDeudas(filtros: FiltroDeudaDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.ultimoPago) where.push(eq(deudaTable.ultimoPago, filtros.ultimoPago))
  return where
}


export async function contarDeudasPorFiltro(filtros: FiltroDeudaDTO): Promise<number> {
  const where = generarWhereFiltroDeudas(filtros)

  const data = await DB.select({
    total: count(deudaTable.id),
  }).from(deudaTable).where(and(...where))

  return data[0].total
}

export async function listarDeudasPorFiltro(filtros: FiltroDeudaDTO): Promise<DeudaDTO[]> {

  const where = generarWhereFiltroDeudas(filtros)

  const data = await DB.select({
    id: deudaTable.id,
    fechaCreacion: deudaTable.fechaCreacion,
    fechaLimite: deudaTable.fechaLimite,
    fechaNotificacion: deudaTable.fechaNotificacion,
    estado: deudaTable.estado,
    monto: deudaTable.monto,
    ultimoPago: deudaTable.ultimoPago,

    idServicio: deudaTable.idServicio,
    nombreTipoServicio: tiposervicioTable.nombre,
    nombreCliente: sql<string>`concat(${clienteTable.nombres}, ' ', ${clienteTable.apellidos})`,
  }).from(deudaTable)
    .innerJoin(servicioTable, eq(servicioTable.id, deudaTable.idServicio))
    .innerJoin(tiposervicioTable, eq(tiposervicioTable.id, servicioTable.idTipoServicio))
    .innerJoin(clienteTable, eq(clienteTable.id, servicioTable.idCliente))
  return data
}

export async function registrarDeuda(deudaDTO: DeudaDTO, authUser: User): Promise<DeudaDTO> {
  const { id, ...datosDeuda } = deudaDTO

  if (deudaDTO.id) {
    await DB.update(deudaTable).set({
      ...datosDeuda,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(deudaTable.id, id!))

    return deudaDTO
  }

  // Si el campo id no tiene valor, entonces es un nuevo registro y se debe hacer un insert
  const entidad = await DB.insert(deudaTable).values({
    ...datosDeuda,
    usuarioCreacion: +authUser.id!
  })

  return { id: +entidad[0].insertId, ...datosDeuda }
}

export async function anularDeuda(idDeuda: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(deudaTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(deudaTable.id, idDeuda))
}
