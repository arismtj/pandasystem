import { DB } from "@/db/drizzle"
import { clienteTable } from "@/db/schemas/cliente"
import { zonaTable } from "@/db/schemas/zona"
import { ESTADO_INACTIVO } from "@/lib/constantes"
import { ClienteDTO, FiltroClienteDTO } from "@/lib/dto/cliente.dto"
import { and, count, eq, like, SQL } from "drizzle-orm"
import { User } from "next-auth"

export async function obtenerClientePorId(idCliente: number): Promise<ClienteDTO | null> {
  const clientesList = await DB.select().from(clienteTable).where(
    eq(clienteTable.id, idCliente)
  ).limit(1)

  if (clientesList && clientesList.length > 0) {
    const cliente = clientesList[0]
    return {
      id: cliente.id,
      ip: cliente.ip,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      numero_dni: cliente.numero_dni,
      numeroTelefono: cliente.numeroTelefono || null,    
      direccion: cliente.direccion,
      departamento: cliente.departamento,
      provincia: cliente.provincia,
      distrito: cliente.distrito,
      referencia: cliente.referencia,
      fachada: cliente.fachada,
      coordenadas: cliente.coordenadas,
      estado: cliente.estado,
      idZona: cliente.idZona,
      

    }
  }
  return null
}

function generarWhereFiltroClientes(filtros: FiltroClienteDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []
  if (filtros.nombres) where.push(like(clienteTable.nombres, '%' + filtros.nombres + '%'))
  if (filtros.apellidos) where.push(like(clienteTable.apellidos, '%' + filtros.apellidos + '%'))
  if (filtros.idZona) where.push(eq(clienteTable.idZona, +filtros.idZona))

  return where
}


export async function contarClientesPorFiltro(filtros: FiltroClienteDTO): Promise<number> {
  const where = generarWhereFiltroClientes(filtros)

  const data = await DB.select({
    total: count(clienteTable.id),
  }).from(clienteTable).where(and(...where))

  return data[0].total
}

export async function listarClientesPorFiltro(filtros: FiltroClienteDTO): Promise<ClienteDTO[]> {

  const where = generarWhereFiltroClientes(filtros)

  const data = await DB.select({
    id: clienteTable.id,
      ip: clienteTable.ip,
      nombres: clienteTable.nombres,
      apellidos: clienteTable.apellidos,
      numero_dni: clienteTable.numero_dni,
      numeroTelefono: clienteTable.numeroTelefono || null,    
      direccion: clienteTable.direccion,
      departamento: clienteTable.departamento,
      provincia: clienteTable.provincia,
      distrito: clienteTable.distrito,
      referencia: clienteTable.referencia,
      fachada: clienteTable.fachada,
      coordenadas: clienteTable.coordenadas,
      estado: clienteTable.estado,
      idZona: clienteTable.idZona,
  }).from(clienteTable)
    .leftJoin(zonaTable, eq(zonaTable.id, clienteTable.idZona))
    .where(and(...where))

  return data
}

export async function registrarCliente(clienteDTO: ClienteDTO, authUser: User): Promise<ClienteDTO> {
  const { id, ...datosCliente } = clienteDTO

  /** 
   * Si el campo id en clienteDTO tiene valor, entonces el cliente ya existe y
   * debemos hacer una actualizacion de datos
   */
  if (clienteDTO.id) {
    await DB.update(clienteTable).set({
      ...datosCliente,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(clienteTable.id, id!))

    return clienteDTO
  }

  // Si el campo id no tiene valor, entonces es un nuevo registro y se debe hacer un insert
  const entidad = await DB.insert(clienteTable).values({
    ...datosCliente,
    usuarioCreacion: +authUser.id!
  })

  return { id: +entidad[0].insertId, ...datosCliente }
}

export async function anularCliente(idCliente: number, authUser: User): Promise<void> { // el Promise<void> nos dice que no debemos devolver nada
  await DB.update(clienteTable).set({
    estado: ESTADO_INACTIVO,
    usuarioModificacion: +authUser.id!,
    fechaModificacion: new Date()
  }).where(eq(clienteTable.id, idCliente))
}

