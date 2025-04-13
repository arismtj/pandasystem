import { DB } from "@/db/drizzle"
import { Modulo, moduloTable, permisoModuloTable, permisoTable } from "@/db/schemas/permiso"
import { Usuario, usuarioTable } from "@/db/schemas/usuario"
import { FiltroUsuarioDTO, UsuarioDTO } from "@/lib/dto/usuario.dto"
import { and, count, eq, like, SQL } from "drizzle-orm"
import { User } from "next-auth"
import { bcryptHash } from "../auth/bcrypt.utils"

export async function listarModulosUsuario(idUsuario: number): Promise<Modulo[]> {

  const usuario = await DB.select().from(usuarioTable).where(eq(usuarioTable.id, idUsuario))

  if (!usuario || usuario.length === 0) {
    return []
  }

  // Seleccionamos todos los módulos a los que el usuario tiene permiso
  const modulosList = await DB.select({ modulo: moduloTable })
    .from(permisoModuloTable)
    .leftJoin(moduloTable, eq(moduloTable.id, permisoModuloTable.idModulo))
    .where(
      eq(permisoModuloTable.idPermiso, usuario[0].idPermiso)
    )

  return modulosList.map(item => item.modulo!)
}

export async function obtenerUsuarioPorUsername(username: string): Promise<Usuario | null> {
  const usuariosList = await DB.select().from(usuarioTable).where(
    eq(usuarioTable.username, username)
  )

  if (usuariosList && usuariosList.length > 0) {
    return usuariosList[0]
  }

  return null
}

export async function obtenerUsuarioPorId(idUsuario: number): Promise<UsuarioDTO | null> {
  const usuariosList = await DB.select().from(usuarioTable).where(
    eq(usuarioTable.id, idUsuario)
  ).limit(1)

  if (usuariosList && usuariosList.length > 0) {
    const usuario = usuariosList[0]
    return {
      id: usuario.id,
      username: usuario.username,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      numeroTelefono: usuario.numeroTelefono,
      idPermiso: usuario.idPermiso,
      estado: usuario.estado,
    }
  }

  return null
}

function generarWhereFiltroUsuarios(filtros: FiltroUsuarioDTO): SQL[] {
  // Creamos una lista de condiciones sql que se usarán en el WHERE de la consulta sql
  const where: SQL[] = []

  if (filtros.username) where.push(like(usuarioTable.username, '%' + filtros.username + '%'))
  if (filtros.nombres) where.push(like(usuarioTable.nombres, '%' + filtros.nombres + '%'))
  if (filtros.apellidos) where.push(like(usuarioTable.apellidos, '%' + filtros.apellidos + '%'))

  return where
}

export async function contarUsuariosPorFiltro(filtros: FiltroUsuarioDTO): Promise<number> {
  const where = generarWhereFiltroUsuarios(filtros)

  const data = await DB.select({
    total: count(usuarioTable.id),
  }).from(usuarioTable).where(and(...where))

  return data[0].total
}

export async function listarUsuariosPorFiltro(filtros: FiltroUsuarioDTO): Promise<UsuarioDTO[]> {

  const where = generarWhereFiltroUsuarios(filtros)

  const data = await DB.select({
    id: usuarioTable.id,
    username: usuarioTable.username,
    nombres: usuarioTable.nombres,
    apellidos: usuarioTable.apellidos,
    numeroTelefono: usuarioTable.numeroTelefono,
    email: usuarioTable.email,
    idPermiso: usuarioTable.idPermiso,
    estado: usuarioTable.estado,
    nombrePermiso: permisoTable.nombre,
  }).from(usuarioTable)
    .innerJoin(permisoTable, eq(permisoTable.id, usuarioTable.idPermiso))
    .where(and(...where))

  return data
}

export async function registrarUsuario(usuarioDTO: UsuarioDTO, authUser: User): Promise<UsuarioDTO> {
  const { id, ...datosUsuario } = usuarioDTO

  if (usuarioDTO.id) {

    await DB.update(usuarioTable).set({
      ...datosUsuario,
      usuarioModificacion: +authUser.id!,
      fechaModificacion: new Date()
    }).where(eq(usuarioTable.id, id!))

    return usuarioDTO
  }

  // la contraseña serán las primeras 2 letras de su nombre y las 2 primeras de su apellido
  const contrasenia = usuarioDTO.nombres.slice(0, 2) + usuarioDTO.apellidos.slice(0, 2)
  const claveEncriptada = await bcryptHash(contrasenia.toLowerCase())

  const entidad = await DB.insert(usuarioTable).values({
    ...datosUsuario,
    password: claveEncriptada,
    usuarioCreacion: +authUser.id!
  })

  return { id: +entidad[0].insertId, ...datosUsuario }
}