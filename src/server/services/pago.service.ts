import { DB } from "@/db/drizzle"
import { pagoTable } from "@/db/schemas/pagos"
import { servicioTable } from "@/db/schemas/servicios"
import { ESTADO_INACTIVO } from "@/lib/constantes"
import { FiltroPagoDTO, PagoDTO } from "@/lib/dto/pagos.dto"
import { FiltroServicioDTO, ServicioDTO } from "@/lib/dto/servicio.dto"
import { and, count, eq, SQL } from "drizzle-orm"
import { User } from "next-auth"


export async function listarModulosPago(idPago: number) {

  const cliente = await DB.select().from(pagoTable).where(eq(pagoTable.id, idPago))

  if (!cliente || cliente.length === 0) {
    return []
  }
}

export async function obtenerPagoPorId(idPago: number): Promise<PagoDTO | null> {
  const pagosList = await DB.select().from(pagoTable).where(
    eq(pagoTable.id, idPago)
  ).limit(1)

  if (pagosList && pagosList.length > 0) {
    const pago = pagosList[0]
    return {
      id: pago.id ,  
      fecha_pago: pago.fecha_pago ,
      monto: pago.monto ,
      forma_pago: pago.forma_pago ,
      estado: pago.estado ,
     
       idServicio: pago.idServicio,
       idDeuda: pago.idDeuda,
    }
  }
  return null
}

function generarWhereFiltroPagos(filtros: FiltroPagoDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.fecha_pago) where.push(eq(pagoTable.fecha_pago, filtros.fecha_pago))
  if (filtros.forma_pago) where.push(eq(pagoTable.forma_pago, filtros.forma_pago))
  return where
}


export async function contarPagosPorFiltro(filtros: FiltroPagoDTO): Promise<number> {
  const where = generarWhereFiltroPagos(filtros)

  const data = await DB.select({
    total: count(pagoTable.id),
  }).from(pagoTable).where(and(...where))

  return data[0].total
}

export async function listarPagosPorFiltro(filtros: FiltroPagoDTO): Promise<PagoDTO[]> {

  const where = generarWhereFiltroPagos(filtros)

  const data = await DB.select({
    id: pagoTable.id ,  
    fecha_pago: pagoTable.fecha_pago ,
    monto: pagoTable.monto ,
    forma_pago: pagoTable.forma_pago ,
    estado: pagoTable.estado ,
   
     idServicio: pagoTable.idServicio,
     idDeuda: pagoTable.idDeuda,
  }).from(pagoTable)
  return data
}

export async function registrarPago(pagoDTO: PagoDTO, authUser: User): Promise<PagoDTO> {
  const { id, ...datosPago } = pagoDTO

  if (pagoDTO.id) {
    await DB.update(pagoTable).set({
      ...datosPago,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(pagoTable.id, id!))

    return pagoDTO
  }

  // Si el campo id no tiene valor, entonces es un nuevo registro y se debe hacer un insert
  const entidad = await DB.insert(pagoTable).values({
    ...datosPago,
    usuarioCreacion: +authUser.id!
  })

  return { id: +entidad[0].insertId, ...datosPago }
}

export async function anularPago(idPago: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(pagoTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(pagoTable.id, idPago))
}
