import { DB } from "@/db/drizzle"
import { deudaTable } from "@/db/schemas/deuda"
import { pagoTable } from "@/db/schemas/pagos"
import { servicioTable } from "@/db/schemas/servicios"
import { ESTADO_INACTIVO } from "@/lib/constantes"
import { DeudaDTO, FiltroDeudaDTO } from "@/lib/dto/deuda.dto"
import { FiltroPagoDTO, PagoDTO } from "@/lib/dto/pagos.dto"
import { FiltroServicioDTO, ServicioDTO } from "@/lib/dto/servicio.dto"
import { and, count, eq, SQL } from "drizzle-orm"
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
      id: deuda.id ,  
      fecha_creacion:deuda.fecha_creacion ,
      fecha_limite: deuda.fecha_limite ,
      fecha_notificacion: deuda.fecha_notificacion,
      estado: deuda.estado,
      monto:deuda.monto,
      ultimo_pago: deuda.ultimo_pago,
      
      idServicio: deuda.idServicio ,
    }
  }
  return null
}

function generarWhereFiltroDeudas(filtros: FiltroDeudaDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.fecha_creacion) where.push(eq(deudaTable.fecha_creacion, filtros.fecha_creacion))
  if (filtros.ultimo_pago) where.push(eq(deudaTable.ultimo_pago, filtros.ultimo_pago))
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
    id: deudaTable.id ,  
    fecha_creacion:deudaTable.fecha_creacion ,
    fecha_limite: deudaTable.fecha_limite ,
    fecha_notificacion: deudaTable.fecha_notificacion,
    estado: deudaTable.estado,
    monto:deudaTable.monto,
    ultimo_pago: deudaTable.ultimo_pago,
    
    idServicio: deudaTable.idServicio ,
  }).from(deudaTable)
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
