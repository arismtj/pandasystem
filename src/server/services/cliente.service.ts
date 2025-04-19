import { DB } from "@/db/drizzle"
import { clienteTable } from "@/db/schemas/cliente"
import { zonaTable } from "@/db/schemas/zona"
import { ESTADO_ACTIVO, ESTADO_INACTIVO } from "@/lib/constantes"
import { ClienteDTO, FiltroClienteDTO } from "@/lib/dto/cliente.dto"
import { SelectDTO, SelectOptions } from "@/lib/dto/common.dto"
import { eliminarArchivo, guardarArchivo } from "@/lib/files.utils"
import { and, count, eq, like, ne, or, sql, SQL } from "drizzle-orm"
import { User } from "next-auth"

export async function obtenerClientePorId(idCliente: number): Promise<ClienteDTO | null> {
  const clientesList = await DB.select().from(clienteTable).where(
    eq(clienteTable.id, idCliente)
  ).limit(1)

  if (clientesList && clientesList.length > 0) {
    const cliente = clientesList[0]
    return {
      id: cliente.id,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      dni: cliente.dni,
      celular: cliente.celular || null,
      departamento: cliente.departamento,
      provincia: cliente.provincia,
      distrito: cliente.distrito,
      fachada: cliente.fachada,
      idZona: cliente.idZona,
      direccion: cliente.direccion,
      referencia: cliente.referencia,
      coordenadas: cliente.coordenadas,
      estado: cliente.estado,
    }
  }
  return null
}

export async function listarClientesSelect(filtro: string, { excluirId, incluirId, soloActivos = false }: SelectOptions): Promise<SelectDTO[]> {
  const where: SQL[] = []

  if (incluirId) {
    const condicionOr = or(
      like(sql`concat(${clienteTable.nombres}, ' ', ${clienteTable.apellidos})`, `%${filtro}%`),
      eq(clienteTable.id, +incluirId)
    )
    where.push(condicionOr!)
  } else {
    where.push(like(sql`concat(${clienteTable.nombres}, ' ', ${clienteTable.apellidos})`, `%${filtro}%`))
  }

  // otras cosas

  if (excluirId) {
    where.push(ne(clienteTable.id, +excluirId))
  }
  if (soloActivos === true) {
    where.push(eq(clienteTable.estado, ESTADO_ACTIVO))
  }

  const clientesList = await DB.select({
    id: clienteTable.id,
    nombres: clienteTable.nombres,
    apellidos: clienteTable.apellidos,
    estado: clienteTable.estado,
  }).from(clienteTable).where(and(...where))

  if (clientesList.length === 0) {
    return []
  }

  return clientesList.map(item => {
    return {
      value: item.id + '',
      label: item.nombres + ' ' + item.apellidos,
      disabled: item.estado !== ESTADO_ACTIVO
    } as SelectDTO
  })
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
    nombres: clienteTable.nombres,
    apellidos: clienteTable.apellidos,
    dni: clienteTable.dni,
    celular: clienteTable.celular || null,
    departamento: clienteTable.departamento,
    provincia: clienteTable.provincia,
    distrito: clienteTable.distrito,
    fachada: clienteTable.fachada,
    idZona: clienteTable.idZona,
    nombreZona: zonaTable.nombre,
    direccion: clienteTable.direccion,
    referencia: clienteTable.referencia,
    coordenadas: clienteTable.coordenadas,
    estado: clienteTable.estado,
  }).from(clienteTable)
    .leftJoin(zonaTable, eq(zonaTable.id, clienteTable.idZona))
    .where(and(...where))

  return data
}

export async function registrarCliente(clienteDTO: ClienteDTO, authUser: User, fotoFachada?: File | null): Promise<ClienteDTO> {
  const { id, ...datosCliente } = clienteDTO

  if (fotoFachada) {
    const archivo = await guardarArchivo(fotoFachada)
    datosCliente.fachada = archivo

    // Si es un cliente existente, eliminamos la foto de la fachada cargada anteriormente
    if (clienteDTO.id) {
      const clienteFachada = await DB.select({
        fachada: clienteTable.fachada
      }).from(clienteTable).where(eq(clienteTable.id, clienteDTO.id))

      eliminarArchivo(clienteFachada[0].fachada)
    }
  }

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

