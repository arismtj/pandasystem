import { DB } from "@/db/drizzle"
import { moduloTable, permisoModuloTable } from "@/db/schemas/permiso"
import { Sesion, sesionTable, usuarioTable } from "@/db/schemas/usuario"
import { UsuarioDTO } from "@/lib/dto/usuario.dto"
import { and, eq } from "drizzle-orm"
import { obtenerUsuarioPorId } from "../services/usuario.service"

/* Devuelve true si el usuario tiene permiso en la ruta indicada o false si no lo tiene */
export async function usuarioTienePermiso(idUsuario: number, ruta: string): Promise<boolean> {

  // Tratamos de obtener los datos del usuario
  const usuarioDTO = await obtenerUsuarioPorId(idUsuario)

  // Si el usuario no existe devolvemos false indicando que NO tiene permiso
  if (usuarioDTO === null) return false

  // Tratamos de obtener todos los módulos que tiene la ruta solicitada
  // y que pertenecen al permiso del usuario
  const modulos = await DB.select()
    .from(permisoModuloTable)
    .innerJoin(moduloTable, eq(permisoModuloTable.idModulo, moduloTable.id))
    .where(and(
      eq(permisoModuloTable.idPermiso, usuarioDTO.idPermiso),
      eq(moduloTable.url, ruta)
    ))

  // si existe al menos 1 resultado devolvemos true indicando que SI tiene permiso
  if (modulos.length > 0) return true

  return false
}

export async function crearSesion(sessionId: string, idUsuario: number): Promise<Sesion> {
  const session: Sesion = {
    id: sessionId,
    idUsuario,
    expiracion: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  }

  await DB.insert(sesionTable).values(session)
  return session
}

export async function validarTokenSesion(sessionId: string): Promise<SessionValidationResult> {
  const result = await DB.select({
    user: {
      id: usuarioTable.id,
      username: usuarioTable.username,
      nombres: usuarioTable.nombres,
      apellidos: usuarioTable.apellidos,
      email: usuarioTable.email,
      numeroTelefono: usuarioTable.numeroTelefono,
      estado: usuarioTable.estado,
      idPermiso: usuarioTable.idPermiso
    },
    session: sesionTable
  }).from(sesionTable)
    .innerJoin(usuarioTable, eq(sesionTable.idUsuario, usuarioTable.id))
    .where(eq(sesionTable.id, sessionId))


  // Devolvemos null si no existe la sesion
  if (result.length < 1) {
    return { session: null, user: null }
  }

  const { user, session } = result[0]

  // Eliminamos la sesion si ya pasó el tiempo de expiración
  if (Date.now() >= session.expiracion.getTime()) {
    await DB.delete(sesionTable).where(eq(sesionTable.id, session.id))
    return { session: null, user: null }
  }

  // Si aún no expira, reiniciamos el tiempo de expiración en la BD
  if (Date.now() >= session.expiracion.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiracion = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)

    await DB.update(sesionTable).set({
      expiracion: session.expiracion
    }).where(eq(sesionTable.id, session.id))
  }

  return { session, user }
}

export async function invalidarSesion(sessionId: string): Promise<void> {
  await DB.delete(sesionTable).where(eq(sesionTable.id, sessionId))
}

export async function invalidarTodasSesiones(idUsuario: number): Promise<void> {
  await DB.delete(sesionTable).where(eq(sesionTable.idUsuario, idUsuario))
}

export type SessionValidationResult =
  | { session: Sesion; user: UsuarioDTO }
  | { session: null; user: null }