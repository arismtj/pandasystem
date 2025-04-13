import { DB } from "@/db/drizzle"
import { comprobanteTable } from "@/db/schemas/comprobante"
import { pagoTable } from "@/db/schemas/pagos"
import { servicioTable } from "@/db/schemas/servicios"
import { ESTADO_INACTIVO } from "@/lib/constantes"
import { ComprobanteDTO, FiltroComprobanteDTO } from "@/lib/dto/comprobante.dto"
import { FiltroPagoDTO, PagoDTO } from "@/lib/dto/pagos.dto"
import { FiltroServicioDTO, ServicioDTO } from "@/lib/dto/servicio.dto"
import { and, count, eq, SQL } from "drizzle-orm"
import { User } from "next-auth"


export async function listarModulosComprobante(idComprobante: number) {

  const cliente = await DB.select().from(pagoTable).where(eq(comprobanteTable.id, idComprobante))

  if (!cliente || cliente.length === 0) {
    return []
  }
}

export async function obtenerComprobantePorId(idComprobante: number): Promise<ComprobanteDTO | null> {
  const comprobantesList = await DB.select().from(comprobanteTable).where(
    eq(comprobanteTable.id, idComprobante)
  ).limit(1)

  if (comprobantesList && comprobantesList.length > 0) {
    const comprobante = comprobantesList[0]
    return {
      id: comprobante.id ,  
      idPago: comprobante.idPago ,
      numero_identificacion: comprobante.numero_identificacion,
      igv: comprobante.igv,
      tipo_comprobante: comprobante.tipo_comprobante,
      fecha_emision: comprobante.fecha_emision,
       estado:comprobante.estado ,
    }
  }
  return null
}

function generarWhereFiltroComprobantes(filtros: FiltroComprobanteDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.numero_identificacion) where.push(eq(comprobanteTable.numero_identificacion, filtros.numero_identificacion))
  if (filtros.tipo_comprobante) where.push(eq(comprobanteTable.tipo_comprobante, filtros.tipo_comprobante))
  return where
}


export async function contarComprobantesPorFiltro(filtros: FiltroComprobanteDTO): Promise<number> {
  const where = generarWhereFiltroComprobantes(filtros)

  const data = await DB.select({
    total: count(comprobanteTable.id),
  }).from(comprobanteTable).where(and(...where))

  return data[0].total
}

export async function listarComprobantesPorFiltro(filtros: FiltroComprobanteDTO): Promise<ComprobanteDTO[]> {

  const where = generarWhereFiltroComprobantes(filtros)

  const data = await DB.select({
    id: comprobanteTable.id ,  
    idPago: comprobanteTable.idPago ,
    numero_identificacion: comprobanteTable.numero_identificacion,
    igv: comprobanteTable.igv,
    tipo_comprobante: comprobanteTable.tipo_comprobante,
    fecha_emision: comprobanteTable.fecha_emision,
     estado:comprobanteTable.estado ,
  }).from(comprobanteTable)
  return data
}

export async function registrarComprobante(comprobanteDTO: ComprobanteDTO, authUser: User): Promise<ComprobanteDTO> {
  const { id, ...datosComprobante } = comprobanteDTO

  if (comprobanteDTO.id) {
    await DB.update(comprobanteTable).set({
      ...datosComprobante,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(comprobanteTable.id, id!))

    return comprobanteDTO
  }

  // Si el campo id no tiene valor, entonces es un nuevo registro y se debe hacer un insert
  const entidad = await DB.insert(comprobanteTable).values({
    ...datosComprobante,
    usuarioCreacion: +authUser.id!
  })

  return { id: +entidad[0].insertId, ...datosComprobante }
}

export async function anularComprobante(idComprobante: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(comprobanteTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(comprobanteTable.id, idComprobante))
}
