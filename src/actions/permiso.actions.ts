'use server'

import { RespuestaDTO } from "@/lib/dto/common.dto"
import { PermisoDTO, PermisoSchemaDTO } from "@/lib/dto/permiso.dto"

import { auth } from "@/server/auth/auth"
import { anularPermiso, registrarPermiso } from "@/server/services/permiso.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<PermisoDTO>

export async function registrarPermisoAction(data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    const permisoDTO = await PermisoSchemaDTO.validate(data)

    const zonaGuardada = await registrarPermiso(permisoDTO, session?.user!)

    respuesta.data = zonaGuardada
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/usuarios/permisos')
  return respuesta
}

export async function anularPermisoAction(idZona: number): Promise<RespuestaDTO<any>> {
  const respuesta: RespuestaDTO<any> = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    // intentamos anular al cliente
    await anularPermiso(idZona, session?.user!)

  } catch (e) {
    respuesta.error = e
  }

  revalidatePath('/usuarios/permisos')
  return respuesta
}