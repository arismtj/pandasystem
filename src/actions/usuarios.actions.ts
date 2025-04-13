'use server'

import { RespuestaDTO } from "@/lib/dto/common.dto"
import { UsuarioDTO, UsuarioSchemaDTO } from "@/lib/dto/usuario.dto"
import { auth } from "@/server/auth/auth"
import { registrarUsuario } from "@/server/services/usuario.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<UsuarioDTO>

export async function registrarUsuarioAction(_prevState: RespuestaRegistro | undefined, data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth()

  try {
    const usuarioDTO = await UsuarioSchemaDTO.validate(data)

    const usuarioGuardado = await registrarUsuario(usuarioDTO, session?.user!)

    respuesta.data = usuarioGuardado
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/usuarios')
  return respuesta
}